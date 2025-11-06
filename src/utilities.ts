import { Keypair, sol, Umi } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { createGenericFile, generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";

export const mainnetAddress = "https://node1.irys.xyz";
export const devnetAddress = "https://devnet.irys.xyz";

export const filePath = "./src/user_wallet.json";

export function loadKeypairFromFile(secretFilePath: string, umi: Umi): Keypair {
  const secret = JSON.parse(fs.readFileSync(secretFilePath, "utf-8"));
  const secretKey = Uint8Array.from(secret);
  return umi.eddsa.createKeypairFromSecretKey(secretKey);
}

export function getOrCreateWallet(umi: Umi): Keypair {
  if (fs.existsSync(filePath)) {
    return loadKeypairFromFile(filePath, umi);
  } else {
    const keypair = generateSigner(umi);
    fs.writeFileSync(filePath, JSON.stringify(Array.from(keypair.secretKey)));
    console.log("Created a new wallet at:", filePath);
    return keypair;
  }
}

export async function requestAirdrop(umi: Umi): Promise<void> {
  const publicKey = umi.identity.publicKey;
  const balance = await umi.rpc.getBalance(publicKey);

  console.log(`> Current balance for ${publicKey}: ${balance.toString()} SOL`);

  const balanceInSol = Number(balance.basisPoints) / 1_000_000_000;

  if (balanceInSol < 0.5) {
    console.log("> You do not have enough funds. Requesting airdrop...");
    try {
      await umi.rpc.airdrop(publicKey, sol(0.6));
      console.log(`> 0.6 SOL airdrop to ${publicKey} is successful`);
    } catch (e) {
      console.log("> Airdrop request failed:", e);
    }
  } else {
    console.log(
      "> You have enough funds to continue with the minting process."
    );
  }
}

export async function uploadImage(
  imagePath: string,
  umi: Umi
): Promise<string> {
  const imageFile = fs.readFileSync(imagePath);
  const extension = path.extname(imagePath).toLowerCase();
  const mimeType = extension === ".png" ? "image/png" : "image/jpeg";

  const umiImageFile = createGenericFile(imageFile, path.basename(imagePath), {
    tags: [{ name: "Content-Type", value: mimeType }],
  });

  console.log(`Uploading image: ${path.basename(imagePath)}...`);
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  console.log(`Image URI: ${imageUri[0]}`);
  return imageUri[0] as string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  properties: {
    files: Array<{ uri: string; type: string }>;
    category: string;
  };
}

export async function uploadMetadata(
  metadata: Metadata,
  umi: Umi
): Promise<string> {
  console.log(`Uploading metadata for: ${metadata.name}...`);
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  console.log(`Metadata URI: ${metadataUri}`);
  return metadataUri;
}

export async function mintNft(
  metadataUri: string,
  name: string,
  umi: Umi
): Promise<void> {
  const mintSigner = generateSigner(umi);

  console.log(`Creating NFT: ${name}...`);
  const tx = await create(umi, {
    asset: mintSigner,
    name: name,
    uri: metadataUri,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(tx.signature)[0];

  console.log(`NFT Created: ${name}`);
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("View NFT on Metaplex Explorer");
  console.log(
    `https://core.metaplex.com/explorer/${mintSigner.publicKey}?env=devnet`
  );
}

// Reusable function to create NFT metadata
export function createMetadata(
  name: string,
  description: string,
  imageUri: string,
  attributes: Array<{ trait_type: string; value: string }>
): Metadata {
  return {
    name: name,
    description: description,
    image: imageUri,
    attributes: attributes,
    properties: {
      files: [
        {
          uri: imageUri,
          type: "image/jpg",
        },
      ],
      category: "image",
    },
  };
}

export interface NftData {
  name: string;
  imagePath: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export const devwraitheNfts = [
  {
    name: "Tanjiro Kamado",
    imagePath: "./assets/tanjiro.jpg",
    description:
      "The main protagonist of Demon Slayer, a kind-hearted boy who became a demon slayer to save his sister and avenge his family.",
    attributes: [
      { trait_type: "Breathing Style", value: "Water & Sun" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Role", value: "Protagonist" },
    ],
  },
  {
    name: "Nezuko Kamado",
    imagePath: "./assets/nezuko.jpg",
    description:
      "Tanjiro's younger sister who was turned into a demon but retained her humanity and fights alongside her brother.",
    attributes: [
      { trait_type: "Type", value: "Demon" },
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Ability", value: "Blood Demon Art" },
    ],
  },
  {
    name: "Zenitsu Agatsuma",
    imagePath: "./assets/zenitsu.jpg",
    description:
      "A cowardly but talented demon slayer who can only use Thunder Breathing when he's unconscious or asleep.",
    attributes: [
      { trait_type: "Breathing Style", value: "Thunder" },
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Specialty", value: "Speed" },
    ],
  },
  {
    name: "Muzan Kibutsuji",
    imagePath: "./assets/muzan.jpg",
    description:
      "The first and most powerful demon, the main antagonist who seeks to conquer the sun and create an army of demons.",
    attributes: [
      { trait_type: "Type", value: "Demon King" },
      { trait_type: "Rarity", value: "Mythic" },
      { trait_type: "Role", value: "Antagonist" },
    ],
  },
  {
    name: "Inosuke Hashibira",
    imagePath: "./assets/inosuke.jpg",
    description:
      "A feral demon slayer who was raised by boars in the mountains, known for his aggressive fighting style and boar mask.",
    attributes: [
      { trait_type: "Breathing Style", value: "Beast" },
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Trait", value: "Wild" },
    ],
  },
];

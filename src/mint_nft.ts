import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  createMetadata,
  devwraitheNfts as demonSlayerNfts,
  devnetAddress,
  getOrCreateWallet,
  mintNft,
  requestAirdrop,
  uploadImage,
  uploadMetadata,
} from "./utilities";

const mintMultipleNfts = async (): Promise<void> => {
  try {
    const umi = createUmi("https://api.devnet.solana.com")
      .use(mplCore())
      .use(irysUploader({ address: devnetAddress }));

    const wallet = getOrCreateWallet(umi);
    const signer = createSignerFromKeypair(umi, wallet);
    umi.use(signerIdentity(signer));
    console.log("Using wallet:", signer.publicKey);

    console.log("Requesting airdrop...");
    await requestAirdrop(umi);

    console.log(`Uploading ${demonSlayerNfts.length} images...`);
    const imageUris = await Promise.all(
      demonSlayerNfts.map((nft) => uploadImage(nft.imagePath, umi))
    );

    console.log(`Uploading ${demonSlayerNfts.length} metadata files...`);
    const metadataUris = await Promise.all(
      demonSlayerNfts.map((nft, index) => {
        const metadata = createMetadata(
          nft.name,
          nft.description,
          imageUris[index] as string,
          nft.attributes
        );
        return uploadMetadata(metadata, umi);
      })
    );

    console.log(`Minting ${demonSlayerNfts.length} NFTs...`);
    await Promise.all(
      demonSlayerNfts.map((nft, index) =>
        mintNft(metadataUris[index] as string, nft.name, umi)
      )
    );

    console.log("All NFTs minted successfully!");
  } catch (error) {
    console.error("Error minting NFTs:", error);
    throw error;
  }
};

// Call NFT multi-mint function
mintMultipleNfts();

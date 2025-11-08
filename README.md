# Moneta NFT

A Solana-based program for minting NFTs quickly and securely. Moneta NFT is part of the Moneta ecosystem, focused on making NFT creation on Solana simple and straightforward.

### Setup & Usage

1. Clone the repository:

```bash
git clone https://github.com/devwraithe/moneta-nft.git
cd moneta-nft
```

2. Install dependencies:

```bash
yarn install
```

3. Run the mint command:

```bash
yarn mint
```

## Security

> [!WARNING]
> **Never commit your `user_wallet.json` file or share your private keys.**
> `user_wallet.json` is already added to `.gitignore` for safety.

## Current NFT Trading Challenges

Right now, NFT trading on Solana happens manually through a peer-to-peer process:

1. A seller announces they have an NFT for sale (usually on social media or Discord)
2. Interested buyers contact the seller directly
3. Both parties share their wallet addresses
4. The NFT and payment are exchanged, hoping both sides follow through

**This creates serious problems.**

### The Problems

**High Risk of Scams**

- Either party can disappear after receiving payment or the NFT
- No way to reverse fraudulent transactions
- Buyers risk sending money and receiving nothing

**No Security or Verification**

- No trusted third party to verify the exchange
- Can't guarantee both sides will fulfill their end of the deal
- No dispute resolution if something goes wrong

**Time-Consuming & Inefficient**

- Manual back-and-forth communication
- No standardized pricing or listings
- Difficult to find buyers or compare NFT values

### Our Solution: Moneta NFT Marketplace

We're building a complete trading solution that eliminates these problems:

**🏪 NFT Marketplace**

- Browse and list NFTs in one central location
- Transparent pricing and NFT history
- Easy discovery for buyers and sellers

**🔒 Smart Contract Escrow**

- Automatic holding of funds until both parties fulfill the transaction
- NFT and payment released simultaneously
- Built-in protection against scams - no trust required

**The goal:** Make NFT trading as safe and simple as buying from any online store.

## Testing

```bash
yarn test
```

_In cryptography we trust, in Moneta we forge._

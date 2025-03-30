const { 
  Connection, 
  Keypair, 
  PublicKey,
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  Token, 
  TOKEN_PROGRAM_ID 
} = require('@solana/spl-token');
require('dotenv').config();

/**
 * Class to handle Mission NFT creation and management
 * This is a simplified version for the MVP
 */
class MissionNFT {
  constructor(connection, payer) {
    this.connection = connection;
    this.payer = payer;
  }

  /**
   * Create a new NFT representing mission data
   * @param {string} name - Name of the NFT
   * @param {string} symbol - Symbol of the NFT
   * @param {string} uri - URI to the metadata JSON
   * @returns {Promise<PublicKey>} - The mint address of the NFT
   */
  async createNFT(name, symbol, uri) {
    try {
      // Create a new token mint with 0 decimals (NFT standard)
      const mint = await Token.createMint(
        this.connection,
        this.payer,
        this.payer.publicKey,
        null, // Freeze authority - null for NFTs
        0, // 0 decimals for NFT
        TOKEN_PROGRAM_ID
      );

      // Create a token account for the payer
      const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        this.payer.publicKey
      );

      // Mint only 1 token (NFT standard)
      await mint.mintTo(
        tokenAccount.address,
        this.payer.publicKey,
        [],
        1
      );

      // Disable further minting (required for NFT standard)
      await mint.setAuthority(
        mint.publicKey,
        null,
        'MintTokens',
        this.payer.publicKey,
        []
      );

      console.log(`NFT created: ${mint.publicKey.toString()}`);
      
      // In a real implementation, we would store the metadata on-chain
      // using Metaplex, but for this MVP we'll just log it
      console.log(`NFT Metadata: Name: ${name}, Symbol: ${symbol}, URI: ${uri}`);
      
      return mint.publicKey;
    } catch (error) {
      console.error('Error creating NFT:', error);
      throw error;
    }
  }

  /**
   * Transfer an NFT to another account
   * @param {PublicKey} mintPublicKey - The mint address of the NFT
   * @param {PublicKey} recipientPublicKey - The recipient's public key
   * @returns {Promise<string>} - Transaction signature
   */
  async transferNFT(mintPublicKey, recipientPublicKey) {
    try {
      const mint = new Token(
        this.connection,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
        this.payer
      );

      // Get the token account of the payer
      const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        this.payer.publicKey
      );

      // Get or create the token account of the recipient
      const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
        recipientPublicKey
      );

      // Transfer the NFT
      const signature = await mint.transfer(
        fromTokenAccount.address,
        toTokenAccount.address,
        this.payer.publicKey,
        [],
        1
      );

      console.log(`NFT transferred to ${recipientPublicKey.toString()}`);
      console.log(`Transaction signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw error;
    }
  }
}

module.exports = MissionNFT; 
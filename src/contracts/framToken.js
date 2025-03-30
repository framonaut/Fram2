const { 
  Connection, 
  Keypair, 
  PublicKey,
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  Token, 
  TOKEN_PROGRAM_ID,
  MintLayout 
} = require('@solana/spl-token');
require('dotenv').config();

/**
 * Script to create and manage the $FRAM token on Solana
 */

class FramToken {
  constructor(connection, payer) {
    this.connection = connection;
    this.payer = payer;
    this.tokenMint = null;
  }

  /**
   * Create a new $FRAM token
   * @param {number} decimals - Number of decimal places
   * @returns {Promise<PublicKey>} - The mint address of the token
   */
  async createToken(decimals = 9) {
    try {
      // Create a new token mint
      this.tokenMint = await Token.createMint(
        this.connection,
        this.payer,
        this.payer.publicKey,
        this.payer.publicKey,
        decimals,
        TOKEN_PROGRAM_ID
      );

      console.log(`Token created: ${this.tokenMint.publicKey.toString()}`);
      return this.tokenMint.publicKey;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Mint $FRAM tokens to a recipient
   * @param {PublicKey} recipientPublicKey - Public key of the recipient
   * @param {number} amount - Amount of tokens to mint
   * @returns {Promise<string>} - Transaction signature
   */
  async mintTokens(recipientPublicKey, amount) {
    try {
      // Create associated token account for recipient if it doesn't exist
      const associatedTokenAccount = await this.tokenMint.getOrCreateAssociatedAccountInfo(
        recipientPublicKey
      );

      // Mint tokens to the associated account
      const signature = await this.tokenMint.mintTo(
        associatedTokenAccount.address,
        this.payer.publicKey,
        [],
        amount
      );

      console.log(`Minted ${amount} tokens to ${recipientPublicKey.toString()}`);
      console.log(`Transaction signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  /**
   * Get token balance for an account
   * @param {PublicKey} accountPublicKey - Public key of the account
   * @returns {Promise<number>} - Token balance
   */
  async getTokenBalance(accountPublicKey) {
    try {
      const associatedTokenAccount = await this.tokenMint.getOrCreateAssociatedAccountInfo(
        accountPublicKey
      );
      const balance = await this.connection.getTokenAccountBalance(
        associatedTokenAccount.address
      );
      return balance.value.uiAmount;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }
}

module.exports = FramToken; 
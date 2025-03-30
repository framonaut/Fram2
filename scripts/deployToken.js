const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');
const FramToken = require('../contracts/framToken');
require('dotenv').config();

/**
 * Script to deploy the $FRAM token on Solana Devnet
 * This would be used by an administrator to create the initial token
 */

async function main() {
  try {
    // Connect to the Solana network
    const network = process.env.SOLANA_NETWORK || 'devnet';
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || clusterApiUrl(network),
      'confirmed'
    );

    console.log(`Connected to Solana ${network}`);

    // In production, you would use a securely stored keypair
    // For this MVP, we'll generate a new one and save it
    let payer;
    
    // Check if keypair file exists
    if (fs.existsSync('./keypair.json')) {
      const keyData = JSON.parse(fs.readFileSync('./keypair.json', 'utf-8'));
      payer = Keypair.fromSecretKey(new Uint8Array(keyData));
      console.log('Using existing keypair');
    } else {
      payer = Keypair.generate();
      fs.writeFileSync('./keypair.json', JSON.stringify(Array.from(payer.secretKey)));
      console.log('Generated new keypair and saved to keypair.json');
    }

    console.log(`Payer address: ${payer.publicKey.toString()}`);

    // For the MVP, you would need to get SOL first
    console.log('Please fund this address with SOL from Solana Devnet faucet:');
    console.log(`https://faucet.solana.com/?address=${payer.publicKey.toString()}`);

    // Create $FRAM token instance
    const framToken = new FramToken(connection, payer);

    // Create the token
    console.log('Creating $FRAM token...');
    const mintAddress = await framToken.createToken();
    
    console.log(`Token created successfully!`);
    console.log(`Token mint address: ${mintAddress.toString()}`);
    console.log(`Update your .env file with this mint address: FRAM_TOKEN_MINT=${mintAddress.toString()}`);

    // Mint 1 billion tokens to the creator
    const totalSupply = 1_000_000_000 * (10 ** 9); // 1 billion tokens with 9 decimals
    console.log(`Minting ${totalSupply} tokens to the creator...`);
    await framToken.mintTokens(payer.publicKey, totalSupply);
    
    console.log('Initial token minting complete!');

  } catch (error) {
    console.error('Error deploying token:', error);
  }
}

main(); 
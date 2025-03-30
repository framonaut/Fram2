const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');
const MissionNFT = require('../contracts/missionNFT');
require('dotenv').config();

/**
 * Script to create a sample mission data NFT
 * This would be used to test the NFT creation process
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

    // Load keypair
    if (!fs.existsSync('./keypair.json')) {
      console.error('Keypair file not found. Please run deployToken.js first.');
      return;
    }

    const keyData = JSON.parse(fs.readFileSync('./keypair.json', 'utf-8'));
    const payer = Keypair.fromSecretKey(new Uint8Array(keyData));
    console.log(`Using keypair with address: ${payer.publicKey.toString()}`);

    // Create MissionNFT instance
    const missionNFT = new MissionNFT(connection, payer);

    // Sample metadata for the NFT
    const name = 'Fram2 Polar Image #001';
    const symbol = 'FRAM2';
    
    // In a real implementation, this would be uploaded to IPFS
    // For the MVP, we'll use a placeholder
    const uri = 'https://example.com/fram2/metadata/001.json';

    // Create the NFT
    console.log(`Creating NFT: ${name}...`);
    const mintAddress = await missionNFT.createNFT(name, symbol, uri);
    
    console.log(`NFT created successfully!`);
    console.log(`NFT mint address: ${mintAddress.toString()}`);
    console.log(`Metadata URI: ${uri}`);
    
    // Log instructions for viewing on Solana Explorer
    console.log('\nView the NFT on Solana Explorer:');
    console.log(`https://explorer.solana.com/address/${mintAddress.toString()}?cluster=${network}`);

  } catch (error) {
    console.error('Error creating NFT:', error);
  }
}

main(); 
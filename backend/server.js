const express = require('express');
const cors = require('cors');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
require('dotenv').config();

// Import contract classes
const FramToken = require('../contracts/framToken');
const MissionNFT = require('../contracts/missionNFT');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Set up Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Initialize routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Fram2 API' });
});

// Token Routes
app.get('/api/token/info', (req, res) => {
  const tokenMintAddress = process.env.FRAM_TOKEN_MINT;
  
  if (!tokenMintAddress) {
    return res.status(404).json({ 
      error: 'Token mint address not found in environment variables' 
    });
  }
  
  res.json({
    name: 'FRAM Token',
    symbol: 'FRAM',
    mintAddress: tokenMintAddress,
    network: process.env.SOLANA_NETWORK || 'devnet',
    decimals: 9
  });
});

// NFT Routes
app.get('/api/nft/collections', (req, res) => {
  // In a real app, this would come from a database
  res.json([
    {
      id: 'mission-data',
      name: 'Fram2 Mission Data',
      description: 'NFTs representing scientific data from the Fram2 polar orbit mission',
      items: 0 // No items yet in this MVP
    },
    {
      id: 'mission-imagery',
      name: 'Fram2 Polar Imagery',
      description: 'NFTs representing imagery captured during the Fram2 polar orbit mission',
      items: 0 // No items yet in this MVP
    }
  ]);
});

// User Profile Routes
app.get('/api/users/profile', (req, res) => {
  // This would normally verify a JWT token and fetch the user from a database
  // For MVP we'll just return a mock user
  res.json({
    username: 'fram2_supporter',
    walletAddress: req.query.walletAddress || 'Not connected',
    framTokens: 0,
    nftsOwned: 0,
    joinedDate: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 
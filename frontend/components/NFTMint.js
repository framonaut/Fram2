import React, { useState } from 'react';

/**
 * Component for minting mission data NFTs
 */
const NFTMint = ({ walletAddress }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // In a real app, this would upload the image to IPFS
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!name || !description || !image) {
      setError('Please fill out all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would:
      // 1. Upload the image to IPFS
      // 2. Create metadata JSON and upload to IPFS
      // 3. Call the smart contract to mint the NFT
      
      // For the MVP, we'll just simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setName('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError('Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return <div className="notice">Connect your wallet to mint NFTs</div>;
  }

  return (
    <div className="nft-mint">
      <h2>Mint Mission Data NFT</h2>
      
      {success && (
        <div className="success-message">
          <p>NFT minted successfully!</p>
          <button onClick={() => setSuccess(false)}>Mint Another</button>
        </div>
      )}
      
      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">NFT Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Polar Image #001"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mission data..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="mint-button"
            disabled={loading}
          >
            {loading ? 'Minting...' : 'Mint NFT'}
          </button>
        </form>
      )}
      
      <div className="nft-info">
        <h3>About Mission Data NFTs</h3>
        <p>
          These NFTs represent scientific data and imagery collected during the Fram2 
          polar orbit mission. Owning them helps support the mission and provides 
          exclusive access to mission data.
        </p>
      </div>
    </div>
  );
};

export default NFTMint; 
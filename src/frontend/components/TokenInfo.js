import React, { useState, useEffect } from 'react';

/**
 * Component for displaying $FRAM token information
 */
const TokenInfo = ({ walletAddress }) => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!walletAddress) {
        return;
      }

      setLoading(true);
      try {
        // Fetch token information from the API
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/token/info`);
        const data = await response.json();
        
        if (response.ok) {
          setTokenInfo(data);
        } else {
          setError(data.error || 'Failed to fetch token information');
        }
      } catch (error) {
        console.error('Error fetching token info:', error);
        setError('Error connecting to API. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [walletAddress]);

  if (loading) {
    return <div className="loading">Loading token information...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!walletAddress) {
    return <div className="notice">Connect your wallet to view token information</div>;
  }

  if (!tokenInfo) {
    return <div className="notice">No token information available</div>;
  }

  return (
    <div className="token-info">
      <h2>$FRAM Token</h2>
      <div className="token-details">
        <p><strong>Token Name:</strong> {tokenInfo.name}</p>
        <p><strong>Symbol:</strong> {tokenInfo.symbol}</p>
        <p><strong>Network:</strong> {tokenInfo.network}</p>
        <p><strong>Mint Address:</strong> {tokenInfo.mintAddress}</p>
        <p><strong>Decimals:</strong> {tokenInfo.decimals}</p>
      </div>
      
      <div className="token-actions">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button className="view-button">View on Explorer</button>
          <button className="add-button">Add to Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo; 
import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TokenInfo from './components/TokenInfo';
import NFTMint from './components/NFTMint';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('token');

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <h1>Fram2</h1>
          <p>First Polar Orbit Human Spaceflight with Web3</p>
        </div>
        <WalletConnect onConnect={handleWalletConnect} />
      </header>

      <main className="app-main">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'token' ? 'active' : ''}`}
            onClick={() => setActiveTab('token')}
          >
            $FRAM Token
          </button>
          <button 
            className={`tab ${activeTab === 'nft' ? 'active' : ''}`}
            onClick={() => setActiveTab('nft')}
          >
            Mission NFTs
          </button>
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'token' && (
            <TokenInfo walletAddress={walletAddress} />
          )}
          
          {activeTab === 'nft' && (
            <NFTMint walletAddress={walletAddress} />
          )}
          
          {activeTab === 'profile' && (
            <div className="profile">
              <h2>User Profile</h2>
              {walletAddress ? (
                <div className="profile-info">
                  <p><strong>Wallet Address:</strong> {walletAddress}</p>
                  <p><strong>$FRAM Balance:</strong> 0</p>
                  <p><strong>NFTs Owned:</strong> 0</p>
                </div>
              ) : (
                <div className="not-connected">
                  Please connect your wallet to view your profile
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Fram2 MVP &copy; 2025</p>
        <p>Exploring Polar Orbit Through Commercial Spaceflight and Web3</p>
      </footer>
    </div>
  );
}

export default App; 
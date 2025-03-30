import React, { useState, useEffect } from 'react';

/**
 * Component for connecting to Solana wallet (Phantom, Solflare)
 */
const WalletConnect = ({ onConnect }) => {
  const [publicKey, setPublicKey] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Phantom is installed
    const checkIfWalletIsConnected = async () => {
      try {
        const { solana } = window;

        if (solana) {
          if (solana.isPhantom) {
            console.log('Phantom wallet found!');
            
            // Try to connect if autoConnect is enabled
            const response = await solana.connect({ onlyIfTrusted: true });
            console.log(
              'Connected with Public Key:',
              response.publicKey.toString()
            );
            
            setPublicKey(response.publicKey.toString());
            setWalletConnected(true);
            
            if (onConnect) {
              onConnect(response.publicKey.toString());
            }
          }
        } else {
          console.log('Solana object not found! Get a Phantom Wallet 👻');
          setError('Please install Phantom or Solflare wallet to connect');
        }
      } catch (error) {
        console.error(error);
        setError('Error connecting to wallet');
      }
    };

    checkIfWalletIsConnected();
  }, [onConnect]);

  const connectWallet = async () => {
    try {
      const { solana } = window;

      if (solana) {
        const response = await solana.connect();
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
        
        setPublicKey(response.publicKey.toString());
        setWalletConnected(true);
        
        if (onConnect) {
          onConnect(response.publicKey.toString());
        }
      }
    } catch (error) {
      console.error(error);
      setError('Error connecting to wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window;
      
      if (solana) {
        await solana.disconnect();
        setPublicKey(null);
        setWalletConnected(false);
        
        if (onConnect) {
          onConnect(null);
        }
      }
    } catch (error) {
      console.error(error);
      setError('Error disconnecting wallet');
    }
  };

  if (error) {
    return (
      <div className="wallet-error">
        <p>{error}</p>
        <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
          Get a Phantom Wallet
        </a>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {!walletConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected: {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</p>
          <button onClick={disconnectWallet} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 
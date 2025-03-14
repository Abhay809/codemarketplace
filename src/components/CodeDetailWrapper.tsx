
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useWallet } from '@/hooks/useWallet';
import CodeDetail from './CodeDetail';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';
import { CodeListing } from '@/types';

const CodeDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getListingById } = useMarketplace();
  const { isConnected, connectWallet } = useWallet();
  const [listing, setListing] = useState<CodeListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      
      if (!id) {
        setError('Listing ID not found');
        setLoading(false);
        return;
      }
      
      try {
        const fetchedListing = await getListingById(id);
        if (!fetchedListing) {
          setError('Listing not found');
        } else {
          setListing(fetchedListing);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [id, getListingById]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading listing...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold mb-2">
          {error || 'Listing not found'}
        </h2>
        <p className="text-codemarket-text-muted mb-6">
          We couldn't find the listing you're looking for.
        </p>
        <Button 
          onClick={() => navigate('/explore')}
          className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
        >
          Browse Other Listings
        </Button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center p-6 glass rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet to View Details</h2>
          <p className="text-codemarket-text-muted mb-6">
            You need to connect your wallet to view the full details and purchase this code.
          </p>
          <Button 
            onClick={connectWallet}
            className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        </div>
        
        {/* Show limited preview without wallet */}
        <div className="glass rounded-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{listing.title}</h1>
          <p className="text-codemarket-text-muted mb-6">{listing.description}</p>
          <div className="opacity-50">
            <p className="text-center py-8">Connect wallet to see more details</p>
          </div>
        </div>
      </div>
    );
  }

  // Render the CodeDetail with the listing data
  return <CodeDetail listing={listing} />;
};

export default CodeDetailWrapper;

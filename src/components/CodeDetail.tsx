
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketplace } from "@/context/MarketplaceContext";
import useWallet from "@/hooks/useWallet";
import { toast } from "sonner";
import { CodeListing } from "@/types";
import TransactionModal from "./TransactionModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CodeDetailProps {
  listing: CodeListing;
}

const CodeDetail = ({ listing }: CodeDetailProps) => {
  const navigate = useNavigate();
  const { purchaseListing, getUserPurchases } = useMarketplace();
  const { isConnected, address, connectWallet, formatAddress } = useWallet();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPurchases, setUserPurchases] = useState<CodeListing[]>([]);
  
  // Fetch user purchases when address changes
  useEffect(() => {
    const fetchUserPurchases = async () => {
      if (isConnected && address) {
        try {
          const purchases = await getUserPurchases(address);
          setUserPurchases(purchases);
        } catch (err) {
          console.error("Error fetching user purchases:", err);
        }
      }
    };
    
    fetchUserPurchases();
  }, [isConnected, address, getUserPurchases]);
  
  // Check if the user has purchased this listing
  const hasPurchased = userPurchases.some((item) => item.id === listing.id);
  
  // Check if the user is the seller
  const isOwner = isConnected && address.toLowerCase() === listing.sellerAddress.toLowerCase();
  
  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setError(null);
    setIsModalOpen(true);
  };
  
  const confirmPurchase = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await purchaseListing(listing.id, address);
      if (success) {
        setIsModalOpen(false);
        toast.success("Purchase successful! You now have access to the full code.");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      setError(error.message || "Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format date
  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Left column - Image and Purchase */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg overflow-hidden border border-codemarket-muted">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-64 object-cover object-center"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-codemarket-accent/30 to-purple-500/30 flex items-center justify-center">
                <div className="text-5xl opacity-50">{`{ }`}</div>
              </div>
            )}
          </div>
          
          <div className="glass rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{listing.price} ETH</div>
              
              {hasPurchased && (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                  Already Purchased
                </Badge>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {hasPurchased ? (
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12">
                Download Code
              </Button>
            ) : isOwner ? (
              <Button className="w-full bg-codemarket-muted h-12" disabled>
                Your Listing
              </Button>
            ) : (
              <Button
                className="w-full bg-codemarket-accent hover:bg-codemarket-accent-hover h-12"
                onClick={handlePurchase}
                disabled={!isConnected}
              >
                {isConnected ? "Purchase Now" : "Connect Wallet to Purchase"}
              </Button>
            )}
            
            {!isConnected && (
              <Button
                variant="outline"
                className="w-full border-codemarket-muted h-12"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
            
            <div className="pt-4 border-t border-codemarket-muted/30">
              <div className="text-sm text-codemarket-text-muted">
                <div className="flex justify-between py-2">
                  <span>Seller</span>
                  <span className="font-mono">{formatAddress(listing.sellerAddress)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Listed On</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Language</span>
                  <span>{listing.language}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Category</span>
                  <span>{listing.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{listing.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {listing.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="bg-codemarket-muted/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p className="text-codemarket-text mb-8 text-lg">
              {listing.description}
            </p>
          </div>
          
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="glass w-full justify-start">
              <TabsTrigger value="preview">Code Preview</TabsTrigger>
              {hasPurchased && <TabsTrigger value="full">Full Code</TabsTrigger>}
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-4">
              <div className="bg-black/40 rounded-lg p-5 font-mono text-sm overflow-auto scrollbar-thin max-h-[500px]">
                <pre>{listing.previewCode}</pre>
              </div>
              
              <div className="mt-4 p-4 glass rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Preview Only</h3>
                <p className="text-codemarket-text-muted">
                  This is a preview of the code. Purchase to get the full source code and documentation.
                </p>
              </div>
            </TabsContent>
            
            {hasPurchased && (
              <TabsContent value="full" className="mt-4">
                <div className="bg-black/40 rounded-lg p-5 font-mono text-sm overflow-auto scrollbar-thin max-h-[500px]">
                  <pre>
                    {`
// This would contain the full source code after purchase
// In a real implementation, this would be fetched securely 
// from the blockchain or a secured server

import React, { useState, useEffect } from 'react';

/**
 * Advanced component with encrypted data handling
 * Documentation included
 */
export const SecureComponent = ({ data, encryption }) => {
  const [decrypted, setDecrypted] = useState(null);
  
  useEffect(() => {
    // Secure decryption logic
    // ...
    
    // Advanced features and optimizations
    // ...
    
    return () => {
      // Clean up resources
    };
  }, [data, encryption]);
  
  return (
    <div className="secure-container">
      {/* Component implementation */}
    </div>
  );
};

// Additional utility functions and complete implementation...
                    `}
                  </pre>
                </div>
                
                <div className="mt-4 p-4 glass rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Full Access</h3>
                  <p className="text-codemarket-text-muted">
                    You have purchased this code. You can download the full source files and documentation.
                  </p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Download Source Files
                  </Button>
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="details" className="mt-4">
              <div className="glass rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">What's Included</h3>
                <ul className="space-y-2 text-codemarket-text">
                  <li className="flex items-start">
                    <div className="mr-2 text-green-400">✓</div>
                    <span>Complete source code with documentation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-green-400">✓</div>
                    <span>Usage examples and integration guide</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-green-400">✓</div>
                    <span>License for commercial and personal projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 text-green-400">✓</div>
                    <span>6 months of updates</span>
                  </li>
                </ul>
                
                <h3 className="text-xl font-semibold pt-4">Requirements</h3>
                <ul className="space-y-2 text-codemarket-text">
                  <li className="flex items-start">
                    <div className="mr-2">•</div>
                    <span>{listing.language} development environment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2">•</div>
                    <span>Basic knowledge of {listing.language}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2">•</div>
                    <span>Compatible with latest standards</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmPurchase}
        listing={listing}
        isProcessing={isProcessing}
        error={error}
      />
    </>
  );
};

export default CodeDetail;

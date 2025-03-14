
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeListing } from "@/types";
import { useMarketplace } from "@/context/MarketplaceContext";
import useWallet from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface CodeCardProps {
  listing: CodeListing;
  isPurchased?: boolean;
}

const CodeCard = ({ listing, isPurchased = false }: CodeCardProps) => {
  const { purchaseListing } = useMarketplace();
  const { isConnected, address, connectWallet, formatAddress } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchase = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsProcessing(true);
    try {
      const success = await purchaseListing(listing.id, address);
      if (success) {
        toast.success("Purchase successful!");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const isOwner = isConnected && address.toLowerCase() === listing.sellerAddress.toLowerCase();
  
  // Format the date
  const formattedDate = new Date(listing.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  return (
    <Card className="overflow-hidden group hover-lift transition-all duration-300 bg-codemarket-card border-codemarket-muted/50">
      <div className="relative">
        {listing.imageUrl ? (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-codemarket-accent/30 to-purple-500/30 flex items-center justify-center">
            <div className="text-4xl opacity-50">{`{ }`}</div>
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-codemarket-accent text-white">
            {listing.price} ETH
          </Badge>
          
          {isPurchased && (
            <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30">
              Purchased
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold hover:text-codemarket-accent transition-colors">
              <Link to={`/listing/${listing.id}`}>{listing.title}</Link>
            </CardTitle>
            <p className="text-xs text-codemarket-text-muted mt-1">
              Listed on {formattedDate} by {formatAddress(listing.sellerAddress)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-codemarket-text-muted line-clamp-2 mb-3">
          {listing.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="bg-codemarket-muted/30 text-xs">
            {listing.language}
          </Badge>
          
          {listing.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-codemarket-muted/30 text-xs">
              {tag}
            </Badge>
          ))}
          
          {listing.tags.length > 2 && (
            <Badge variant="outline" className="bg-codemarket-muted/30 text-xs">
              +{listing.tags.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-black/30 rounded border border-codemarket-muted/30 font-mono text-xs overflow-hidden whitespace-pre-wrap text-codemarket-text-muted line-clamp-3">
          {listing.previewCode}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2 border-codemarket-muted"
          asChild
        >
          <Link to={`/listing/${listing.id}`}>View Details</Link>
        </Button>
        
        {isPurchased ? (
          <Button
            className="w-1/2 bg-green-600 hover:bg-green-700"
            size="sm"
            asChild
          >
            <Link to={`/download/${listing.id}`}>Download</Link>
          </Button>
        ) : isOwner ? (
          <Button
            className="w-1/2 bg-codemarket-muted text-white hover:bg-codemarket-muted/80"
            size="sm"
            disabled
          >
            Your Listing
          </Button>
        ) : (
          <Button
            className="w-1/2 bg-codemarket-accent hover:bg-codemarket-accent-hover"
            size="sm"
            onClick={handlePurchase}
            disabled={isProcessing || !isConnected}
          >
            {isProcessing ? "Processing..." : "Purchase"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CodeCard;

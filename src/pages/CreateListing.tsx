
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CodeForm from "@/components/CodeForm";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CreateListing = () => {
  const { isConnected, connectWallet } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setError(null);
    try {
      await connectWallet();
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet. Please try again.");
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sell Your Code</h1>
            <p className="text-codemarket-text-muted">
              List your code on the marketplace and earn ETH from your work.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isConnected ? (
            <div className="glass rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-codemarket-text-muted mb-6">
                You need to connect your wallet to create a listing. We use Sepolia test network.
              </p>
              <Button 
                onClick={handleConnectWallet}
                className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </Button>
            </div>
          ) : (
            <div className="glass rounded-lg p-6">
              <CodeForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateListing;

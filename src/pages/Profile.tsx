import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CodeCard from "@/components/CodeCard";
import { useMarketplace } from "@/context/MarketplaceContext";
import useWallet from "@/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { userListings, userPurchases, getUserListings, getUserPurchases, refreshListings } = useMarketplace();
  const { isConnected, address, connectWallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabParam === "purchases" ? "purchases" : "listings");
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && address) {
        setLoading(true);
        try {
          await Promise.all([
            getUserListings(address),
            getUserPurchases(address)
          ]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [isConnected, address, getUserListings, getUserPurchases]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile${value === "purchases" ? "?tab=purchases" : ""}`);
  };
  
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshListings();
      if (address) {
        await Promise.all([
          getUserListings(address),
          getUserPurchases(address)
        ]);
      }
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 px-6 pb-16 flex items-center justify-center">
          <div className="glass max-w-md p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-codemarket-text-muted mb-6">
              Please connect your MetaMask wallet to view your profile, listings, and purchases.
            </p>
            <Button 
              onClick={connectWallet} 
              className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
              size="lg"
            >
              Connect Wallet
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-codemarket-text-muted">
                Manage your listings and purchases.
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-codemarket-muted text-codemarket-text-muted hover:bg-codemarket-muted/20"
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center mb-8">
              <TabsList className="glass">
                <TabsTrigger value="listings">Your Listings</TabsTrigger>
                <TabsTrigger value="purchases">Your Purchases</TabsTrigger>
              </TabsList>
              
              {activeTab === "listings" && (
                <Button 
                  onClick={() => navigate("/create")}
                  className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Listing
                </Button>
              )}
            </div>
            
            <TabsContent value="listings" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[460px] animate-pulse rounded-lg bg-codemarket-muted/20"></div>
                  ))}
                </div>
              ) : userListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userListings.map((listing) => (
                    <CodeCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="glass p-12 rounded-lg text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-2xl font-semibold mb-2">No Listings Yet</h3>
                  <p className="text-codemarket-text-muted max-w-md mx-auto mb-6">
                    You haven't created any code listings yet. 
                    Share your code with the world and earn ETH!
                  </p>
                  <Button 
                    onClick={() => navigate("/create")}
                    className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
                    size="lg"
                  >
                    Create Your First Listing
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="purchases" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[460px] animate-pulse rounded-lg bg-codemarket-muted/20"></div>
                  ))}
                </div>
              ) : userPurchases.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userPurchases.map((listing) => (
                    <CodeCard key={listing.id} listing={listing} isPurchased={true} />
                  ))}
                </div>
              ) : (
                <div className="glass p-12 rounded-lg text-center">
                  <div className="text-4xl mb-4">🛍️</div>
                  <h3 className="text-2xl font-semibold mb-2">No Purchases Yet</h3>
                  <p className="text-codemarket-text-muted max-w-md mx-auto mb-6">
                    You haven't purchased any code listings yet.
                    Explore the marketplace to find quality code!
                  </p>
                  <Button 
                    onClick={() => navigate("/explore")}
                    className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
                    size="lg"
                  >
                    Explore Marketplace
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;

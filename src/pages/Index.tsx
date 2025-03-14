
import { Suspense, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import CodeCard from "@/components/CodeCard";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { listings, loading, refreshListings } = useMarketplace();
  
  // Refresh listings on mount
  useEffect(() => {
    refreshListings();
  }, [refreshListings]);
  
  // Get featured listings (first 3)
  const featuredListings = listings.slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Listings Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Code</h2>
              <p className="text-codemarket-text-muted max-w-2xl mx-auto">
                Discover high-quality code from talented developers around the world.
                Buy, sell, and share your best work.
              </p>
            </div>
            
            <Suspense fallback={<div>Loading...</div>}>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[460px] animate-pulse rounded-lg bg-codemarket-muted/20"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredListings.map((listing) => (
                    <CodeCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </Suspense>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-codemarket-accent hover:bg-codemarket-accent-hover">
                <Link to="/explore">Explore All Listings</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-24 px-6 bg-codemarket-darker/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-codemarket-text-muted max-w-2xl mx-auto">
                CodeMarket connects developers through a secure, decentralized marketplace.
                Buying and selling code has never been easier.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Connect Wallet",
                  description: "Link your MetaMask wallet to authenticate and enable secure transactions on the marketplace.",
                  icon: "📱",
                  delay: "0s",
                },
                {
                  title: "Browse or List",
                  description: "Explore available code or list your own creations with details, previews, and pricing.",
                  icon: "🔍",
                  delay: "0.1s",
                },
                {
                  title: "Secure Transaction",
                  description: "Purchase code with ETH or sell your work and receive payments directly to your wallet.",
                  icon: "🔒",
                  delay: "0.2s",
                },
              ].map((step, i) => (
                <div 
                  key={i} 
                  className="glass p-8 rounded-lg hover-lift"
                  style={{ animationDelay: step.delay }}
                >
                  <div className="mb-6 text-4xl">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-codemarket-text-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-codemarket-accent/10 to-purple-500/10"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                Ready to Join the CodeMarket Community?
              </h2>
              <p className="text-codemarket-text-muted text-xl mb-12 max-w-3xl mx-auto">
                Whether you're looking to monetize your code or find the perfect solution for your project,
                CodeMarket is the place to connect with developers worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-codemarket-accent hover:bg-codemarket-accent-hover text-white px-8 h-12 text-lg"
                >
                  <Link to="/explore">Start Exploring</Link>
                </Button>
                
                <Button 
                  asChild
                  size="lg" 
                  variant="outline" 
                  className="border-codemarket-muted text-white hover:bg-codemarket-muted/20 h-12 text-lg"
                >
                  <Link to="/create">Sell Your Code</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-codemarket-darker py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-semibold flex items-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-codemarket-accent to-purple-500 flex items-center justify-center text-white font-bold">
                  CM
                </div>
                <span>CodeMarket</span>
              </div>
              <p className="text-codemarket-text-muted mt-2">
                A secure marketplace for developers.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-medium mb-3">Marketplace</h4>
                <ul className="space-y-2 text-codemarket-text-muted">
                  <li><Link to="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                  <li><Link to="/create" className="hover:text-white transition-colors">Sell Code</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Account</h4>
                <ul className="space-y-2 text-codemarket-text-muted">
                  <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
                  <li><Link to="/profile?tab=purchases" className="hover:text-white transition-colors">Purchases</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Legal</h4>
                <ul className="space-y-2 text-codemarket-text-muted">
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-codemarket-muted/30 mt-12 pt-8 text-center text-codemarket-text-muted text-sm">
            <p>© {new Date().getFullYear()} CodeMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useWallet from "@/hooks/useWallet";

const HeroSection = () => {
  const { isConnected, connectWallet } = useWallet();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-codemarket-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-codemarket-accent/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
      </div>

      {/* Floating code particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute font-mono text-xs text-white/60 animate-pulse-subtle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            {["const", "async", "await", "function", "import", "export", "interface", "</>", "=>", "class", "return"][
              Math.floor(Math.random() * 11)
            ]}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4 px-3 py-1 bg-codemarket-accent/10 backdrop-blur-sm rounded-full border border-codemarket-accent/20">
          <p className="text-sm font-medium text-codemarket-accent">The Marketplace for Developers</p>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="block">Discover, Buy & Sell</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-codemarket-accent to-purple-400">Quality Code</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-codemarket-text-muted mb-10 max-w-2xl mx-auto">
          A secure marketplace for developers to monetize their code and find high-quality solutions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isConnected ? (
            <Button 
              size="lg" 
              className="relative overflow-hidden bg-codemarket-accent hover:bg-codemarket-accent-hover text-white px-8 h-12 text-lg"
              onClick={connectWallet}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Connect Wallet
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 
                  ${isHovered ? "animate-gradient translate-x-full" : "-translate-x-full"} transition-transform duration-1000`} 
              />
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-codemarket-accent hover:bg-codemarket-accent-hover text-white px-8 h-12 text-lg"
              asChild
            >
              <Link to="/explore">Explore Marketplace</Link>
            </Button>
          )}
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-codemarket-muted text-white hover:bg-codemarket-muted/20 h-12 text-lg"
            asChild
          >
            <Link to="/create">Sell Your Code</Link>
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="relative z-10 mt-24 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {[
          { label: "Listings", value: "1,200+" },
          { label: "Developers", value: "750+" },
          { label: "Sales", value: "$250K+" },
          { label: "Languages", value: "25+" },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="glass text-center py-6 px-4 rounded-lg hover-lift"
          >
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-codemarket-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

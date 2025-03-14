
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import useWallet from "@/hooks/useWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const WalletButton = () => {
  const { isConnected, address, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const [isHovered, setIsHovered] = useState(false);

  if (!isConnected) {
    return (
      <Button 
        onClick={connectWallet} 
        disabled={isConnecting}
        className="relative overflow-hidden bg-codemarket-accent hover:bg-codemarket-accent-hover transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <Wallet className={`w-4 h-4 ${isHovered ? "animate-pulse" : ""}`} />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 
          ${isHovered ? "animate-gradient translate-x-full" : "-translate-x-full"} transition-transform duration-1000`} />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-codemarket-accent hover:bg-codemarket-accent-hover flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span>{formatAddress(address)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-dark">
        <DropdownMenuLabel className="font-normal text-sm opacity-70">
          Connected as
        </DropdownMenuLabel>
        <DropdownMenuLabel className="font-mono text-xs truncate">
          {address}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/create" className="cursor-pointer">
            Sell Code
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={disconnectWallet}
          className="text-red-400 cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;

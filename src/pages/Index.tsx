import React, { useState, useEffect } from 'react';
import { Search, Code, ShoppingCart, User, Star, Filter, ChevronDown, ExternalLink, Wallet } from 'lucide-react';
import WalletButton from '@/components/WalletButton';
import useWallet from '@/hooks/useWallet';
import { toast } from 'sonner';
import TransactionModal from '@/components/TransactionModal';
import { Link } from 'react-router-dom';

// Mock data for initial display
const mockCodeItems = [
  {
    id: '1',
    title: 'React Data Table Component',
    description: 'A fully featured data table with sorting, filtering, and pagination',
    price: 0.03,
    author: '0xA0A54f674A1f186FA12F39E9E05f4D0de5e2646D',
    rating: 4.8,
    reviews: 1243,
    category: 'react',
    tags: ['component', 'table', 'data'],
    previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    codePreview: `const DataTable = ({ data, columns }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  return (
    <table className="w-full">
      {/* Table implementation */}
    </table>
  );
};`,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Authentication Flow Bundle',
    description: 'Complete authentication system with login, signup, password reset, and JWT handling',
    price: 0.03,
    author: '0xA0A54f674A1f186FA12F39E9E05f4D0de5e2646D',
    rating: 4.9,
    reviews: 2156,
    category: 'javascript',
    tags: ['authentication', 'security', 'jwt'],
    previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    codePreview: `// JWT Authentication Helper
const authService = {
  login: async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      return data.user;
    }
    throw new Error(data.message);
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};`,
    createdAt: new Date().toISOString()
  }
];

export default function CodeMarketplace() {
  const [codeItems, setCodeItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { isConnected, address, connectWallet, sendTransaction, ethToWei, formatAddress } = useWallet();
  const [sortBy, setSortBy] = useState('newest');

  // Fetch data from mock API and localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get listings from localStorage
        const savedListings = localStorage.getItem('codeListings');
        const parsedListings = savedListings ? JSON.parse(savedListings) : [];
        
        // Combine mock data with user listings
        const allItems = [...mockCodeItems, ...parsedListings];
        setCodeItems(allItems);
        
        // Set initial filtered items
        setFilteredItems(allItems);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(allItems.map(item => item.category))];
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered items when filters change
  useEffect(() => {
    const filtered = codeItems
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

    setFilteredItems(filtered);
  }, [codeItems, searchQuery, selectedCategory, sortBy]);

  // Add item to cart
  const addToCart = (item) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setCartItems(prev => {
      // Check if item is already in cart
      if (prev.some(cartItem => cartItem._id === item._id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  // Buy item directly
  const buyItem = async (item) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setSelectedItem(item);
    setIsTransactionModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;
    
    setIsProcessingPayment(true);
    try {
      const txHash = await sendTransaction(
        selectedItem.author, // seller's address
        ethToWei(selectedItem.price) // convert price to Wei
      );
      
      if (txHash) {
        toast.success('Purchase successful!');
        // Store purchase in localStorage
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        purchases.push({
          ...selectedItem,
          purchaseDate: new Date().toISOString(),
          transactionHash: txHash,
          buyerAddress: address
        });
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        // Close modal and reset state
        setIsTransactionModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="text-teal-500" size={24} />
              <h1 className="text-xl font-bold">CodeMarket</h1>
            </div>
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for code, components, templates..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                  <ShoppingCart className="text-slate-300" size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
              <WalletButton />
              <Link 
                to="/sell" 
                className="bg-teal-600 hover:bg-teal-500 transition-colors rounded-lg px-4 py-2 font-medium"
              >
                Sell Code
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 shadow-lg">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Discover, Buy, and Sell High-Quality Code</h2>
            <p className="text-slate-300 text-lg mb-6">
              Marketplace for developers to find premium code components, templates, and solutions to accelerate your projects.
            </p>
            <div className="flex space-x-4">
              <button className="bg-teal-600 hover:bg-teal-500 transition-colors rounded-lg px-6 py-3 font-medium">
                Browse Marketplace
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg px-6 py-3 font-medium">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Browse Code</h2>
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-slate-400" />
              <span>Filter by:</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            
            {categories.map(category => (
              <button 
                key={category}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Code Items Grid */}
        <section className="mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No items found</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item._id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.previewImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 rounded-full px-3 py-1 text-sm font-medium">
                      {item.price} ETH
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <div className="flex items-center text-amber-400">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-sm">{item.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-slate-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="bg-slate-900 rounded p-3 mb-4 overflow-hidden">
                      <pre className="text-xs text-slate-300 overflow-x-auto">
                        <code>{item.codePreview.slice(0, 150)}...</code>
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet size={14} className="text-teal-400" />
                        <span className="text-sm font-mono text-slate-400">
                          {formatAddress(item.author)}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">{item.sales} sales</span>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        className="flex-1 bg-teal-600 hover:bg-teal-500 transition-colors rounded px-4 py-2 font-medium flex items-center justify-center gap-2"
                        onClick={() => isConnected ? buyItem(item) : connectWallet()}
                      >
                        {isConnected ? (
                          <>
                            <span>Buy Now</span>
                            <span className="text-xs opacity-80">{item.price} ETH</span>
                          </>
                        ) : (
                          <>
                            <Wallet size={16} />
                            <span>Connect Wallet</span>
                          </>
                        )}
                      </button>
                      <button 
                        className="bg-slate-700 hover:bg-slate-600 transition-colors rounded px-3 py-2"
                        onClick={() => addToCart(item)}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cart Sidebar (Fixed Position) */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-80 z-10">
            <div className="p-4 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Your Cart ({cartItems.length})</h3>
                <button 
                  className="text-slate-400 hover:text-slate-200"
                  onClick={() => setCartItems([])}
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-teal-400 text-sm">{item.price} ETH</p>
                    <p className="text-xs text-slate-400 font-mono">{formatAddress(item.author)}</p>
                  </div>
                  <button 
                    className="text-slate-400 hover:text-slate-200"
                    onClick={() => removeFromCart(item._id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span>Total:</span>
                <span className="font-bold">{cartTotal} ETH</span>
              </div>
              <button 
                className="w-full bg-teal-600 hover:bg-teal-500 transition-colors rounded px-4 py-2 font-medium flex items-center justify-center gap-2"
                onClick={() => isConnected ? buyItem(cartItems[0]) : connectWallet()}
                disabled={cartItems.length === 0}
              >
                {isConnected ? (
                  'Checkout with MetaMask'
                ) : (
                  <>
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Transaction Modal */}
      {selectedItem && (
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => {
            setIsTransactionModalOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleConfirmPurchase}
          listing={selectedItem}
          isProcessing={isProcessingPayment}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="text-teal-500" size={24} />
                <h2 className="text-xl font-bold">CodeMarket</h2>
              </div>
              <p className="text-slate-400 text-sm">
                The premier marketplace for developers to buy and sell high-quality code.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Explore</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Trending</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">New Releases</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Bestsellers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Sell</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Become a Seller</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Seller Dashboard</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Seller Guidelines</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
            <p>© 2023 CodeMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CodeCard from "@/components/CodeCard";
import { useMarketplace } from "@/context/MarketplaceContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Explore = () => {
  const { listings, loading, refreshListings } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Refresh listings on mount and explicitly handle any errors
  useEffect(() => {
    const loadListings = async () => {
      try {
        await refreshListings();
      } catch (error) {
        console.error("Error refreshing listings:", error);
      }
    };
    
    loadListings();
  }, [refreshListings]);

  // Get unique languages and categories for filters
  const languages = listings.length > 0 
    ? [...new Set(listings.map((listing) => listing.language))] 
    : [];
  
  const categories = listings.length > 0 
    ? [...new Set(listings.map((listing) => listing.category))] 
    : [];

  // Filter listings based on search and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = searchTerm === "" || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesLanguage = filterLanguage === "all" || listing.language === filterLanguage;
    const matchesCategory = filterCategory === "all" || listing.category === filterCategory;
    
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination navigation
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at start or end
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Code Listings</h1>
            <p className="text-codemarket-text-muted max-w-2xl mx-auto">
              Browse high-quality code from developers around the world.
              Find the perfect solution for your next project.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-12 glass p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-codemarket-text-muted" size={18} />
                  <Input
                    placeholder="Search by title, description or tags"
                    className="pl-10 bg-codemarket-muted/20 border-codemarket-muted"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Select 
                    value={filterLanguage} 
                    onValueChange={(value) => {
                      setFilterLanguage(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="bg-codemarket-muted/20 border-codemarket-muted">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="glass-dark">
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filterCategory} 
                    onValueChange={(value) => {
                      setFilterCategory(value);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <SelectTrigger className="bg-codemarket-muted/20 border-codemarket-muted">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass-dark">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Filter results summary */}
            <div className="flex items-center mt-4 text-sm text-codemarket-text-muted">
              <Filter size={16} className="mr-2" />
              <span>
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
                {(filterLanguage !== "all" || filterCategory !== "all" || searchTerm) && ' with filters'}
                {currentItems.length > 0 && totalPages > 1 && `, page ${currentPage} of ${totalPages}`}
              </span>
            </div>
          </div>
          
          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[460px] animate-pulse rounded-lg bg-codemarket-muted/20"></div>
              ))}
            </div>
          ) : filteredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((listing) => (
                  <CodeCard key={listing.id} listing={listing} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            href="#" 
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={index}>
                          <span className="px-4 py-2">...</span>
                        </PaginationItem>
                      )
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No Results Found</h3>
              <p className="text-codemarket-text-muted">
                We couldn't find any listings matching your search criteria.
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;

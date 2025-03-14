
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CodeDetailWrapper from "@/components/CodeDetailWrapper";

const ListingDetail = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <CodeDetailWrapper />
        </div>
      </main>
    </div>
  );
};

export default ListingDetail;

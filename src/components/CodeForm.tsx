
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMarketplace } from "@/context/MarketplaceContext";
import useWallet from "@/hooks/useWallet";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type FormData = {
  title: string;
  description: string;
  price: string;
  language: string;
  category: string;
  previewCode: string;
  imageUrl: string;
  tags: string;
};

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Solidity", "Rust", "Go", "Java", 
  "C++", "C#", "PHP", "Swift", "Kotlin", "Ruby"
];

const CATEGORIES = [
  "Frontend", "Backend", "Full Stack", "Mobile", "Blockchain", "AI/ML",
  "DevOps", "Data Science", "Utilities", "Games", "Security"
];

const CodeForm = () => {
  const { addListing } = useMarketplace();
  const { isConnected, address, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      price: "0.01",
      language: "JavaScript",
      category: "Frontend",
      previewCode: "// Provide a preview of your code here\n// This will be visible to potential buyers\n",
      imageUrl: "",
      tags: "",
    },
  });
  
  const onSubmit = async (data: FormData) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert price to number
      const price = parseFloat(data.price);
      if (isNaN(price) || price <= 0) {
        toast.error("Please enter a valid price");
        setIsSubmitting(false);
        return;
      }
      
      // Process tags
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      
      const newListing = await addListing({
        title: data.title,
        description: data.description,
        price,
        language: data.language,
        category: data.category,
        previewCode: data.previewCode,
        sellerAddress: address,
        imageUrl: data.imageUrl,
        tags,
      });
      
      toast.success("Your code has been listed successfully!");
      navigate(`/listing/${newListing.id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <Card className="w-full max-w-lg glass p-6">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-codemarket-text-muted mb-6">
              You need to connect your MetaMask wallet to list your code on the marketplace.
            </p>
            <Button 
              onClick={connectWallet}
              className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
              size="lg"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="E.g., React State Management Library"
              className="bg-codemarket-muted/20 border-codemarket-muted"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your code, its features, and benefits"
              className="bg-codemarket-muted/20 border-codemarket-muted min-h-[120px]"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.01"
                className="bg-codemarket-muted/20 border-codemarket-muted"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                defaultValue="JavaScript"
                onValueChange={(value) => setValue("language", value)}
              >
                <SelectTrigger className="bg-codemarket-muted/20 border-codemarket-muted">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="glass-dark">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                defaultValue="Frontend"
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger className="bg-codemarket-muted/20 border-codemarket-muted">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="glass-dark">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="E.g., react, hooks, state"
                className="bg-codemarket-muted/20 border-codemarket-muted"
                {...register("tags")}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="bg-codemarket-muted/20 border-codemarket-muted"
              {...register("imageUrl")}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="previewCode">Code Preview</Label>
            <p className="text-sm text-codemarket-text-muted mb-2">
              Provide a small preview of your code. This will be visible to potential buyers.
            </p>
            <Textarea
              id="previewCode"
              className="bg-codemarket-muted/20 border-codemarket-muted font-mono min-h-[300px]"
              {...register("previewCode", { required: "Code preview is required" })}
            />
            {errors.previewCode && (
              <p className="text-red-500 text-sm mt-1">{errors.previewCode.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-codemarket-accent hover:bg-codemarket-accent-hover"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? "Creating Listing..." : "Create Listing"}
        </Button>
      </div>
    </form>
  );
};

export default CodeForm;

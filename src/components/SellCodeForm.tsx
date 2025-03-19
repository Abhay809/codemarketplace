import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';

const SellCodeForm = () => {
  const { isConnected, address, connectWallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0.03,
    category: '',
    tags: '',
    codePreview: '',
    previewImage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create new listing
      const newListing = {
        _id: Date.now().toString(), // Simple unique ID
        ...formData,
        author: address,
        price: 0.03, // Fixed price as requested
        rating: 0,
        sales: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        createdAt: new Date().toISOString(),
      };

      // Get existing listings from localStorage
      const existingListings = JSON.parse(localStorage.getItem('codeListings') || '[]');
      
      // Add new listing
      const updatedListings = [...existingListings, newListing];
      
      // Save to localStorage
      localStorage.setItem('codeListings', JSON.stringify(updatedListings));
      
      // Show success message
      toast.success('Code listing created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0.03,
        category: '',
        tags: '',
        codePreview: '',
        previewImage: '',
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="w-full max-w-lg glass p-6 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">
              You need to connect your MetaMask wallet to create a listing.
            </p>
            <Button 
              onClick={connectWallet}
              className="bg-teal-600 hover:bg-teal-500"
              size="lg"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title of your code"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your code and its features"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., react, javascript, vue"
            required
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., component, table, data"
            required
          />
        </div>

        <div>
          <Label htmlFor="codePreview">Code Preview</Label>
          <Textarea
            id="codePreview"
            name="codePreview"
            value={formData.codePreview}
            onChange={handleChange}
            placeholder="Paste a preview of your code"
            className="font-mono"
            required
          />
        </div>

        <div>
          <Label htmlFor="previewImage">Preview Image URL</Label>
          <Input
            id="previewImage"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder="Enter an image URL for preview"
            required
          />
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-sm text-slate-400">
            Fixed Price: <span className="text-teal-400 font-medium">0.03 ETH</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Seller Address: <span className="font-mono text-xs">{address}</span>
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
      </Button>
    </form>
  );
};

export default SellCodeForm; 
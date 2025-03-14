
-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  previewcode TEXT NOT NULL,
  selleraddress TEXT NOT NULL,
  createdat BIGINT NOT NULL,
  imageurl TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  buyeraddress TEXT NOT NULL,
  selleraddress TEXT NOT NULL,
  listingid TEXT NOT NULL REFERENCES public.listings(id),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  txhash TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS listings_selleraddress_idx ON public.listings (selleraddress);
CREATE INDEX IF NOT EXISTS transactions_buyeraddress_idx ON public.transactions (buyeraddress);
CREATE INDEX IF NOT EXISTS transactions_listingid_idx ON public.transactions (listingid);

-- Add RLS policies to secure the tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous read access to listings
CREATE POLICY "Allow anonymous read access to listings" 
ON public.listings FOR SELECT 
TO anon 
USING (true);

-- Policy to allow authenticated users to insert their own listings
CREATE POLICY "Allow authenticated users to insert their own listings" 
ON public.listings FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy to allow anonymous read access to transactions
CREATE POLICY "Allow anonymous read access to transactions" 
ON public.transactions FOR SELECT 
TO anon 
USING (true);

-- Policy to allow authenticated users to insert their own transactions
CREATE POLICY "Allow authenticated users to insert their own transactions" 
ON public.transactions FOR INSERT 
TO anon 
WITH CHECK (true);

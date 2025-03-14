
import { createClient } from '@supabase/supabase-js';
import { CodeListing, Transaction } from '@/types';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vwnsogayrvznabxthade.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3bnNvZ2F5cnZ6bmFieHRoYWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODc0ODUsImV4cCI6MjA1NzU2MzQ4NX0.KgpKY0CBRKv2BBdhsB9KC7UxTCsgg_ve2-yrlNcKg04';

// Validate that the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for Supabase tables
export type ListingsTable = CodeListing;
export type TransactionsTable = Transaction;

// Helper functions for listings
export const getListings = async (): Promise<CodeListing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('createdat', { ascending: false });
    
    if (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
    
    // Transform database column names back to camelCase for frontend
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      language: item.language,
      category: item.category,
      previewCode: item.previewcode,
      sellerAddress: item.selleraddress,
      createdAt: item.createdat,
      imageUrl: item.imageurl,
      tags: item.tags || []
    }));
  } catch (error) {
    console.error('Error in getListings:', error);
    return [];
  }
};

export const addListing = async (listing: Omit<CodeListing, 'id' | 'createdAt'>): Promise<CodeListing | null> => {
  try {
    // Generate a unique ID for the listing
    const id = `listing-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newListing = {
      id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      language: listing.language,
      category: listing.category,
      previewcode: listing.previewCode, // lowercase for db
      selleraddress: listing.sellerAddress, // lowercase for db
      createdat: Date.now(), // lowercase for db
      imageurl: listing.imageUrl, // lowercase for db
      tags: listing.tags || []
    };
    
    const { data, error } = await supabase
      .from('listings')
      .insert(newListing)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
    
    // Transform back to camelCase for frontend
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      language: data.language,
      category: data.category,
      previewCode: data.previewcode,
      sellerAddress: data.selleraddress,
      createdAt: data.createdat,
      imageUrl: data.imageurl,
      tags: data.tags || []
    };
  } catch (error) {
    console.error('Error in addListing:', error);
    throw new Error('Failed to create listing. Please check if the Supabase tables exist.');
  }
};

export const getListingById = async (id: string): Promise<CodeListing | null> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
    
    // Transform database column names back to camelCase for frontend
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      language: data.language,
      category: data.category,
      previewCode: data.previewcode,
      sellerAddress: data.selleraddress,
      createdAt: data.createdat,
      imageUrl: data.imageurl,
      tags: data.tags || []
    };
  } catch (error) {
    console.error('Error in getListingById:', error);
    return null;
  }
};

export const getUserListings = async (address: string): Promise<CodeListing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('selleraddress', address)
      .order('createdat', { ascending: false });
    
    if (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
    
    // Transform database column names back to camelCase for frontend
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      language: item.language,
      category: item.category,
      previewCode: item.previewcode,
      sellerAddress: item.selleraddress,
      createdAt: item.createdat,
      imageUrl: item.imageurl,
      tags: item.tags || []
    }));
  } catch (error) {
    console.error('Error in getUserListings:', error);
    return [];
  }
};

// Helper functions for transactions
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction | null> => {
  try {
    const newTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      buyeraddress: transaction.buyerAddress,
      selleraddress: transaction.sellerAddress,
      listingid: transaction.listingId,
      amount: transaction.amount,
      status: transaction.status,
      txhash: transaction.txHash || '',
      timestamp: Date.now()
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(newTransaction)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    
    // Transform back to camelCase for frontend
    return {
      id: data.id,
      buyerAddress: data.buyeraddress,
      sellerAddress: data.selleraddress,
      listingId: data.listingid,
      amount: data.amount,
      status: data.status,
      txHash: data.txhash,
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Error in addTransaction:', error);
    throw new Error('Failed to create transaction. Please check if the Supabase tables exist.');
  }
};

export const getUserPurchases = async (address: string): Promise<CodeListing[]> => {
  try {
    // First get all transactions for this user
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('buyeraddress', address)
      .eq('status', 'success');
    
    if (txError) {
      console.error('Error fetching user transactions:', txError);
      throw txError;
    }
    
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // Get all listing IDs from the transactions
    const listingIds = transactions.map(tx => tx.listingid);
    
    // Then get all listings for these IDs
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .in('id', listingIds);
    
    if (listingsError) {
      console.error('Error fetching purchased listings:', listingsError);
      throw listingsError;
    }
    
    // Transform database column names back to camelCase for frontend
    return (listings || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      language: item.language,
      category: item.category,
      previewCode: item.previewcode,
      sellerAddress: item.selleraddress,
      createdAt: item.createdat,
      imageUrl: item.imageurl,
      tags: item.tags || []
    }));
  } catch (error) {
    console.error('Error in getUserPurchases:', error);
    return [];
  }
};

"use client";
import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItem } from '@/types';
import PortfolioCard from '@/app/portfolio-list/components/portfoliocard';
import Link from 'next/link';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";

const PortfolioList: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPortfolioItems(data);
      
      if (data.length === 0) {
        toast({
          title: "Empty",
          description: "No portfolio items found",
        });
      }
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio items",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
    return () => {
      setLoading(false);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deletePost(id);
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
      // Refresh the list after delete
      fetchPortfolioItems();
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
      });
    } finally {
      setDeleting(null);
    }
  };

  const refreshList = () => {
    fetchPortfolioItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-heading font-medium">Portfolio Items</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={refreshList}
            variant="outline"
            className="text-sm text-white flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCcw className={`h-4 text-white w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/uploads">
            <Button className="text-sm flex items-center mr-4 gap-1">
              <PlusCircle className="h-4  w-4" />
              New Item
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-raydawn-purple"></div>
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="bg-transparent rounded-lg shadow-sm p-12 text-center">
          <p className="text-white">No portfolio items found. Add your first item!</p>
          <Link href="/uploads">
            <Button className="mt-4">
              Create New Portfolio Item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 bg-transparent lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, idx) => (
            <div key={item._id} className="relative group">
             <BlurFade  delay={0.25 + idx * 0.05} inView >
              <PortfolioCard item={item} onDelete={() => item._id && handleDelete(item._id)} isDeleting={deleting === item._id} />
              </BlurFade>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
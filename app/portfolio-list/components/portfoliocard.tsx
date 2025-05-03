'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PortfolioItem } from '@/types';
import {  Video, Trash, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PortfolioCardProps {
  item: PortfolioItem;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onDelete, isDeleting }) => {
  const router = useRouter();
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/projects/edit/${item._id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      onClick={() => router.push(`/projects/${item._id}`)}
      className="flex flex-col bg-transparent rounded-lg shadow-sm overflow-hidden border cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <div className="h-40 bg-gray-200 relative">
        <Image
          src={`/api/image/${item._id}`} 
          alt={item.title} 
          width={500}
          height={300}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {item.category && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-raydawn-purple text-white">
              {item.category}
            </span>
          </div>
        )}
        
        {/* Admin Controls - Only visible on hover */}
        <div className="absolute top-2 left-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="default" 
            size="icon" 
            className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
            onClick={handleEditClick}
            aria-label="Edit item"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-8 w-8 bg-red-500 hover:bg-red-600"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            aria-label="Delete item"
          >
            {isDeleting ? (
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 text-lg line-clamp-2">{item.title}</h3>
        <div className="mt-3 pt-3 border-t border-gray-100 flex-grow">
          {item.client && (
            <>
              <p className="text-xs text-gray-500">Client:</p>
              <p className="text-sm font-medium">{item.client}</p>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3">
          {item.videoLink && (
            <a 
              href={item.videoLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-raydawn-purple hover:text-raydawn-dark-purple flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Video className="h-3 w-3" />
              Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
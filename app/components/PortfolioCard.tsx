import Image from 'next/image';
import { useState } from 'react';

interface PortfolioCardProps {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  client: string;
  // other props as needed
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ id, title, excerpt, slug, client }) => {
  const [imageError, setImageError] = useState(false);
  
  // Image source URL pointing to our API endpoint
  const imageUrl = `/api/image/${id}`;
  
  return (
    <div className="portfolio-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-700">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {excerpt && <p className="text-gray-300 mb-3">{excerpt}</p>}
        <p className="text-sm text-gray-400">Client: {client}</p>
        
        <div className="mt-4">
          <a 
            href={`/portfolio/${slug}`}
            className="inline-block px-4 py-2 bg-raydawn-purple text-white rounded hover:bg-raydawn-dark-purple transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;

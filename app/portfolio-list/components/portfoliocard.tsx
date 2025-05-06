
"use client";
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PortfolioItem } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



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
    <Card className= "bg-black border-grey-400">
      <CardHeader>
          <Image
            src={`/api/image/${item._id}`} 
            alt={item.title} 
            width={500}
            height={300}
          />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-white text-2xl">{item.client}</CardTitle>
        <CardDescription className="text-teal-400">
          {item.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="space-x-4">
          <Button className="border-1 border-teal bg-transparent" onClick={handleEditClick} >
            Edit
          </Button>
          
          <Button className="border-1 border-teal bg-transparent" onClick={handleDeleteClick} disabled={isDeleting}>
            {isDeleting ? (
              <div className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
      </CardFooter>
    </Card>
  );
}
export default PortfolioCard;

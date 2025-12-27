"use client"
import React, {useState} from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
import { deleteProduct } from '@/app/actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import PriceChart from './PriceChart';






const ProductCard = ({product}) => {

    const[showChart, setShowChart] = useState(false);
    const[deleting, setDeleting] = useState(false);

    const handleDelete = async() => {
        if(!confirm("Remove this product from tracking?")) return;
        setDeleting(true);
       const result =  await deleteProduct(product.id);

        if(result.error){
            toast.error(result.error);
        }
        else{
            toast.success(result.message ||"Product removed from tracking");
            setUrl("");
        }
        setDeleting(false);
    }

  return (
    <Card className = "hover:shadow-lg transition-shadow duration-300">
  <CardHeader className = {"pb-3"}>
    <div className = "flex gap-4">
        {product.image_url && (
            <img 
            src={product.image_url} 
            alt={product.name} 
            className = "w-20 h-20 object-cover rounded-md bg-white border border-gray-200"
            />
        )}

        <div className = "flex-1 min-w-0">
            <h3 className = "font-semibold text-gray-900  mb-2 line-clamp-2">
                {product.name}
            </h3>

            <div className = "flex items-baseline gap-2">
                <span className = "text-3xl font-bold text-green-600">
                    {product.current_price} {product.currency}
                </span>

                <Badge variant = "secondary" className = "gap-1">
                    <TrendingDown className = "w-3 h-3"/>
                    Tracking
                </Badge>
            </div>
        </div>
    </div>


  </CardHeader>
  <CardContent>
    <div className = "flex justify-center items-center">

        <Button
          variant = "outline"
          size = "sm"
          className = "gap-1 ml-10"
          onClick= {()=>setShowChart(!showChart)}
          >
            {showChart ?(
                <>
                    <ChevronUp className = "w-4 h-4"/>
                    Hide Chart
                </>
            ):(
                <>
                    <ChevronDown className = "w-4 h-4"/>
                    Show Chart
                </>
            )}    
        </Button>

        <Button variant = "outline" size = "sm" asChild className = "gap-2 mx-2">
            <Link href = {product.url} target = "_blank" rel = "noopener noreferrer">
                <ExternalLink className = "h-4 w-4 "/>
                View Product
            </Link>
        </Button>

        <Button
            variant = "ghost"
            size = "sm"
            className = "mr-10 text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
            onClick = {handleDelete}
            disabled = {deleting}>
                <Trash2 className = "h-4 w-4"/>
                Remove
        </Button>

    </div>
  </CardContent>

  {showChart && (
  <CardFooter className = "pt-0">
    <PriceChart productId = {product.id} />
  </CardFooter>
  )}

</Card>
  )
}

export default ProductCard

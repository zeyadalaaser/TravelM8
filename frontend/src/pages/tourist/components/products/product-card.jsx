import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";
import AnimatedLikeButton from "./like";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Stars } from "../../../components/Stars.jsx";
import { Separator } from "@/components/ui/separator";


export default function ProductCard({ product, currency, token, liked }) {
    const navigate = useNavigate();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [reviews, setReviews] = useState([]);

    const addToCart = async (productId) => {
        try {
            if (token) {
                await axios.post(`http://localhost:5001/api/tourists/cart/${productId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate(0);
            }
            else {
                toast('Please login to perform this action');
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    };

    const getReviews = async (entityId) => {
        try {
          // Construct query parameters
          const params = {
            entityId,
            entityType: "Product",
          };
    
          const response = await axios.get("http://localhost:5001/api/ratings", {
            params,
          });
    
          console.log("Reviews:", response.data.reviews);
          console.log("Average Rating:", response.data.averageRating);
          setReviews(response.data.reviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
    

    return (
        <Card key={product._id}>
            <div className="flex flex-col p-4 space-y-2 h-full">
                <div className="w-full relative group">
                    <img
                        src={product.image || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="rounded-lg w-full h-52 object-cover"
                    />
                    <div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-end"
                        style={{
                            background: `linear-gradient(180deg, 
            rgba(0,0,0,0) 62%, 
            rgba(0,0,0,0.00345888) 63.94%, 
            rgba(0,0,0,0.014204) 65.89%, 
            rgba(0,0,0,0.0326639) 67.83%, 
            rgba(0,0,0,0.0589645) 69.78%, 
            rgba(0,0,0,0.0927099) 71.72%, 
            rgba(0,0,0,0.132754) 73.67%, 
            rgba(0,0,0,0.177076) 75.61%, 
            rgba(0,0,0,0.222924) 77.56%, 
            rgba(0,0,0,0.267246) 79.5%, 
            rgba(0,0,0,0.30729) 81.44%, 
            rgba(0,0,0,0.341035) 83.39%, 
            rgba(0,0,0,0.367336) 85.33%, 
            rgba(0,0,0,0.385796) 87.28%, 
            rgba(0,0,0,0.396541) 89.22%, 
            rgba(0,0,0,0.4) 91.17%)`
                        }}
                    >
                        <div className="flex items-center w-full justify-between">
                            <span className="text-white font-medium text-base truncate">{product.name}</span>
                            <div className="flex space-x-2">
                                <AnimatedLikeButton
                                    liked={liked}
                                    productId={product._id}
                                    token={token}
                                />
                                <ShareButton className="p-2 rounded-full bg-gray-100" id={product._id} name="product" />
                            </div>
                        </div>
                    </div>
                </div>

                <span className="text-lg font-semibold truncate">
                    {product.name}
                </span>

                <div className="flex-grow">
                    <div className="flex items-center mb-2">
                        <Stars rating={product.averageRating || 0} />
                        <span className="ml-2 text-sm text-muted-foreground">
                            {product.totalRatings || 0} reviews
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {product.description || "No description available"}
                    </p>
                </div>

                <div className="!mt-auto flex flex-col">
                    <div className="mt-1.5 mb-4 flex justify-between items-center">
                        <span className="text-lg font-bold">
                            {(product.price * 1).formatCurrency(currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            by <Badge className="px-1" variant="secondary">
                                {product.seller?.name || "Unknown Seller"}
                            </Badge>
                        </span>
                    </div>
                    <Button
                        className={`w-full mt-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200`}
                        size="sm"
                        onClick={() => {setDialogOpen(true); getReviews(product._id);}}
                        
                    >
                        View Details
                    </Button>
                    <Button
                        className={`w-full text-white mt-2`}
                        size="sm"
                        onClick={() => product.quantity > 0 && addToCart(product._id)}
                        disabled={product.quantity <= 0}
                    >
                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{product?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-4 h-full">
                        <div className="w-2/5 flex-shrink-0">
                            <div className="aspect-square overflow-hidden rounded-lg mb-2">
                                <img
                                    src={product?.image || "/placeholder.svg?height=300&width=300"}
                                    alt={product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="w-2/3 overflow-y-auto pr-4" style={{ maxHeight: "calc(80vh - 150px)" }}>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">{product?.description}</p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Reviews and Comments</h3>
                                    {reviews && reviews.length > 0 ? (
                                        <ul className="space-y-4">
                                            {reviews.map((review, index) => (
                                                <div key={review.id} className="flex space-x-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-semibold text-sm">
                                                                {review.userId?.username ? review.userId.username : "Anonymous"}
                                                            </h5>
                                                            <div className="flex items-center">
                                                                <Stars rating={review?.rating} />
                                                            </div>
                                                        </div>
                                                        <p className="text-sm italic text-muted-foreground">
                                                            &quot;{review?.comment}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No reviews yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-4 bg-gray-100 justify-between w-full p-4 rounded-lg">
                        <span className="text-2xl font-bold">
                            {`${(product.price * 1).formatCurrency(currency)}`}
                        </span>
                    </div>
                </DialogContent>
            </Dialog>

        </Card>
    );
}


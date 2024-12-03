// products.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/Stars";
import { ShareButton } from "@/components/ui/share-button";
import AnimatedLikeButton from "./like";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

export default function ProductCard({ product, currency, token, liked }) {
    const navigate = useNavigate();
    console.log(product);
    const addToCart = async (productId) => {
        try {
            if (token) {
                await axios.post(`http://localhost:5001/api/tourists/cart/${productId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate(0); 
            }    
            else {
                toast({
                    title: `Failed to add product`,
                    description: "Please log in first",
                  });
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
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
                        className={`w-full ${product.quantity > 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-400 hover:bg-gray-500'} text-white`}
                        size="sm"
                        onClick={() => product.quantity > 0 && addToCart(product._id)}
                        disabled={product.quantity <= 0}
                    >
                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </div>
            </div>
        </Card>
    )
}


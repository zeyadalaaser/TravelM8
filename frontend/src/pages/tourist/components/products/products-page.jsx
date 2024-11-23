import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { ClearFilters } from "../filters/clear-filters";
import { RatingFilter } from "../filters/rating-filter";
import { PriceFilter } from "../filters/price-filter";
import { SortSelection } from "../filters/sort-selection";
import Products from "./products";
import { SearchBar } from "../filters/search";
import { getProducts } from "../../api/apiService";
import { Bell, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import Cart from "./cart"
import CircularProgress from '@mui/material/CircularProgress'; 



export function ProductsPage() {
  // console.log("Tourist ID in ProductsPage:", touristId);
  //const { location } = useRouter();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState("USD");
  //const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(false); // Add loading state
  const [exchangeRates, setExchangeRates] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD")
        setExchangeRates(response.data.rates)
      } catch (error) {
        console.error("Error fetching exchange rates:", error)
      }
    }
    fetchExchangeRates()
  }, [])

  const fetchProducts = useDebouncedCallback(async () => {
    setLoading(true)
    const queryParams = new URLSearchParams(location.search)
    queryParams.set("currency", currency)

    try {
      const response = await axios.get(`http://localhost:5001/api/products?${queryParams.toString()}`)
      setTimeout(() => {
        setProducts(response.data.data)
        setLoading(false);
     }, 500); 
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, 200)

  useEffect(() => {
    fetchProducts()
  }, [currency, location.search])

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value)
    const queryParams = new URLSearchParams(location.search)
    queryParams.set("currency", e.target.value)
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true })
  }

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
  }

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, currency } })
  }

//   return (
//     <>
//       <SearchBar categories={[{ name: "Name", value: "name" }]} />
//       <div className="flex flex-row justify-between mb-4">
//         <label>
//           Currency:
//           <select value={currency} onChange={handleCurrencyChange}>
//             {Object.keys(exchangeRates).map((cur) => (
//               <option key={cur} value={cur}>
//                 {`${cur}`}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>
//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="w-full md:w-1/4">
//           <PriceFilter
//             currency={currency}
//             exchangeRate={exchangeRates[currency] || 1}
//           />
//           <Separator className="mt-5" />
//           <RatingFilter />
//         </div>
//         <div className="w-full md:w-3/4">
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex h-5 items-center space-x-4 text-sm">
//             {loading ? <div>Loading...</div> : <div>{products.length} results</div>}
//               <ClearFilters />
//             </div>
//             <SortSelection />
//           </div>
//           <Products
//             products={products}
//             currency={currency}

//             exchangeRate={exchangeRates[currency]}
//             touristId={touristId}

//           />
//         </div>
//       </div>
//     </>
//   );
// }


return (
  <div className="mt-24">
  <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">TravelM8</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Cart</span>
              {cart.length > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Cart</SheetTitle>
              <SheetDescription>Review your items before checkout</SheetDescription>
            </SheetHeader>
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateCartItemQuantity={updateCartItemQuantity}
              currency={currency}
            />
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{currency} {totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4" onClick={handleCheckout}>Proceed to Checkout</Button>
          </SheetContent>
        </Sheet>
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar categories={[{ name: "Name", value: "name" }]} />
      <div className="flex flex-row justify-between mb-4">
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {`${cur}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <PriceFilter
            currency={currency}
            exchangeRate={exchangeRates[currency] || 1}
          />
          <Separator className="mt-5" />
          <RatingFilter />
        </div>
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex h-5 items-center space-x-4 text-sm">
              <ClearFilters />
            </div>
            <SortSelection />
          </div>
          {loading ? (
            <div className="flex justify-center items-center mt-36">
              <CircularProgress />
            </div>
          ) : (
          <Products
            products={products}
            currency={currency}
            exchangeRate={exchangeRates[currency]}
            // touristId={touristId}
            addToCart={addToCart}
          />
        )}
        </div>
      </div>
    </main>
  </div>
  </div>
)
}
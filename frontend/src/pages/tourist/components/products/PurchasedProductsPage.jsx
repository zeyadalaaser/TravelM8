import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import RateProduct from './RateProduct'; 

export default function PurchasedProductsPage({ touristId }) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPurchaseId, setCurrentPurchaseId] = useState(null);
    useEffect(() => {
        const fetchPurchases = async () => {
            if (!touristId) {
                setError("Tourist ID is requiredddddd.");
                setLoading(false);
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:5001/api/purchases/${touristId}`);
                setPurchases(response.data.purchases);
            } catch (error) {
                console.error("Error fetching purchased products:", error);
                setError("Error fetching purchased products.");
            } finally {
                setLoading(false);
            }
        };
    
        // Only call fetchPurchases if touristId is defined
        if (touristId) {
            fetchPurchases();
        }
    }, [touristId]); // Re-run the effect whenever touristId changes
    
    const openModal = (purchaseId) => {
        setCurrentPurchaseId(purchaseId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPurchaseId(null);
    };

    if (loading) return <p>Loading purchased products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="space-y-4">
            {purchases.map((purchase) => (
                <Card key={purchase._id} className="p-4 mb-4">
                    <h3 className="text-xl font-semibold">{purchase.productId.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Quantity: {purchase.quantity}</p>
                    <p className="text-sm text-gray-600 mb-2">Total Price: {purchase.totalPrice}</p>
                    <p className="text-sm text-gray-600 mb-2">Status: {purchase.status}</p>

                    {/* Enhanced Rate Product button with black background */}
                    <button 
                        onClick={() => openModal(purchase._id)} 
                        className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
                    >
                        Rate Product
                    </button>
                </Card>
            ))}

            {/* RateProduct Modal */}
            <RateProduct 
                isOpen={isModalOpen} 
                purchaseId={currentPurchaseId} 
                onClose={closeModal} 
            />
        </div>
    );
}

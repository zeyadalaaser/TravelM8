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
    const [currentProductId, setCurrentProductId] = useState(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!touristId) {
                setError("Tourist ID is required.");
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

        if (touristId) {
            fetchPurchases();
        }
    }, [touristId]);

    const openModal = (purchaseId, productId) => {
        setCurrentPurchaseId(purchaseId);
        setCurrentProductId(productId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPurchaseId(null);
        setCurrentProductId(null);
    };

    const deletePurchase = async (purchaseId) => {
        try {
            await axios.delete(`http://localhost:5001/api/purchases/${purchaseId}`);
            setPurchases((prev) => prev.filter((purchase) => purchase._id !== purchaseId));
        } catch (error) {
            console.error("Error deleting purchase:", error);
            setError("Error deleting purchase.");
        }
    };

    if (loading) return <p>Loading purchased products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="space-y-4">
            {purchases.map((purchase) => (
                <Card key={purchase._id} className="p-4 mb-4">
                    <h3 className="text-xl font-semibold">
                        {purchase.productId ? purchase.productId.name : 'Product name unavailable'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Quantity: {purchase.quantity}</p>
                    <p className="text-sm text-gray-600 mb-2">Total Price: {purchase.totalPrice}</p>

                    <button 
                        onClick={() => openModal(purchase._id, purchase.productId._id)} 
                        className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-800 transition duration-200"
                    >
                        Rate Product
                    </button>

                    <button
                        onClick={() => deletePurchase(purchase._id)}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded ml-4 hover:bg-red-800 transition duration-200"
                    > 
                        Delete Purchase
                    </button>
                </Card>
            ))}

            {/* RateProduct Modal */}
            <RateProduct 
                isOpen={isModalOpen} 
                touristId={touristId}  // Pass touristId as userId
                productId={currentProductId}  // Pass currentProductId to the modal
                purchaseId={currentPurchaseId} 
                onClose={closeModal} 
            />
        </div>
    );
}

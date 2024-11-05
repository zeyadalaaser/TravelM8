import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";

export default function PurchasedProductsPage({ touristId }) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPurchaseId, setCurrentPurchaseId] = useState(null);

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

        fetchPurchases();
    }, [touristId]);

    const handleRate = async (purchaseId) => {
        const { rating, comment } = ratings[purchaseId] || {};
        if (!rating) {
            alert("Please select a rating.");
            return;
        }

        try {
            await axios.post(`http://localhost:5001/api/purchases/${purchaseId}/rate`, { rating, comment });
            alert('Rating submitted successfully!');
            closeModal(); // Close modal after submission
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating.");
        }
    };

    const openModal = (purchaseId) => {
        setCurrentPurchaseId(purchaseId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPurchaseId(null);
    };

    const Modal = ({ isOpen, onClose, onRate, purchaseId }) => {
        if (!isOpen) return null;

        const handleRatingChange = (e) => {
            setRatings({
                ...ratings,
                [purchaseId]: { ...ratings[purchaseId], rating: e.target.value }
            });
        };

        const handleCommentChange = (e) => {
            setRatings({
                ...ratings,
                [purchaseId]: { ...ratings[purchaseId], comment: e.target.value }
            });
        };

        const handleSubmit = () => {
            onRate(purchaseId);
            onClose();
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm">
                    <h2 className="text-xl mb-4">Rate this Product</h2>
                    <label className="block mb-2">Rate this product:</label>
                    <select 
                        onChange={handleRatingChange} 
                        className="border p-2 mb-2 w-full"
                    >
                        <option value="">Select a rating</option>
                        {[1, 2, 3, 4, 5].map(star => (
                            <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <textarea 
                        placeholder="Leave a comment..." 
                        onChange={handleCommentChange} 
                        className="border p-2 mb-2 w-full"
                    />
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSubmit} 
                            className="bg-black text-white font-semibold py-2 px-4 rounded mr-2"
                        >
                            Submit Rating
                        </button>
                        <button 
                            onClick={onClose} 
                            className="bg-gray-300 text-black font-semibold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
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

                    <button 
                        onClick={() => openModal(purchase._id)} 
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
                    >
                        Rate Product
                    </button>
                </Card>
            ))}

            {/* Modal for rating */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onRate={handleRate} 
                purchaseId={currentPurchaseId} 
            />
        </div>
    );
}

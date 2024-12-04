import React from "react";
import { ArchiveIcon, EditIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";  // Assuming Stars component exists

const ProductDetailsCard = ({ product, onEdit, onDelete, onToggleArchive }) => {
  // Dummy data for average rating and reviews (for now)
  const dummyReviews = [
    { user: "John Doe", rating: 5, comment: "Excellent product, highly recommend!" },
    { user: "Jane Smith", rating: 4, comment: "Good quality, but a bit expensive." },
    { user: "Michael Johnson", rating: 3, comment: "It's okay, does the job." },
    { user: "Sarah Lee", rating: 4, comment: "Great product, but arrived late." },
    { user: "Tom Brown", rating: 5, comment: "Absolutely love it!" },
    // More reviews here
  ];

  const totalRatings = dummyReviews.length;
  const averageRating = dummyReviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Product Image and Name */}
      <div className="relative mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-900">{product.name}</h2>
      </div>

      {/* Product Information */}
      <div className="text-sm text-gray-600 mb-6">
        <p className="font-bold text-gray-900">Price: USD {parseFloat(product.price).toFixed(2)}</p>
        
        <div className="flex items-center mb-2">
          {/* Display Stars component for rating */}
          <Stars rating={product.averageRating || averageRating} />
          <span className="ml-2 text-sm text-gray-500">
            {product.totalRatings || totalRatings} reviews
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {product.description || "No description available"}
        </p>
        
        <p className="text-gray-700">Sold: {product.sales}</p>
        <p className="text-gray-700">Remaining Stock: {product.quantity}</p>
      </div>

      {/* Rating and Reviews */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">Average Rating: {product.averageRating || averageRating} / 5</h3>

        {/* Scrollable Reviews Container */}
        <div
          className="overflow-auto max-h-60 mt-4"
          style={{ maxHeight: "300px" }} // You can adjust the height as needed
        >
          <div className="text-gray-600">
            {dummyReviews.map((review, index) => (
              <div key={index} className="border-b py-2">
                <p className="font-bold text-gray-800">{review.user}</p>
                <p className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                <p className="italic text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={() => onEdit(product)} className="border border-gray-200 text-gray-600" variant="outline">
          <EditIcon className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button
          onClick={() => onToggleArchive(product._id, product.archived)}
          className={`${
            product.archived ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"
          } text-white`}
        >
          <ArchiveIcon className="mr-2 h-4 w-4" />
          {product.archived ? "Unarchive" : "Archive"}
        </Button>
        <Button
          onClick={() => onDelete(product._id)}
          className="bg-red-600 hover:bg-red-800 text-white"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsCard;

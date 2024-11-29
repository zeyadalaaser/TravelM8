import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '../../api/apiService';

export default function AnimatedLikeButton({ token, liked, productId }) {
  const [isLiked, setIsLiked] = useState(liked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (!token)
      return;

    !isLiked ? addToWishlist(productId, token) : removeFromWishlist(productId, token);
    setIsLiked(!isLiked);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full group/heart bg-gray-100"
    >
      <Heart
        className={`
          transition-all duration-200 ease-out
          ${isLiked ? 'fill-pink-500 stroke-pink-500' : 'stroke-[#0d0c22] group-hover/heart:stroke-[#6e6d7a]'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
        size={24}
      />
    </button>
  );
};
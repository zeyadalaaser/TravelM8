import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const AnimatedLikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setIsAnimating(true);
    // Reset animation state after animation completes
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

export default AnimatedLikeButton;
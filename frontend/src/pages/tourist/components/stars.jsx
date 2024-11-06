import { useState } from 'react';

function FractionalStar({ rating, index, onClick, isFilled }) {
    const percentage = isFilled ? 100 : rating * 100;

    return (
        <svg
            onClick={() => onClick(index + 1)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-yellow-400 cursor-pointer"
        >
            <defs>
                <linearGradient id={`star-gradient-${index}`}>
                    <stop offset={`${percentage}%`} stopColor="currentColor" />
                    <stop offset={`${percentage}%`} stopColor="transparent" stopOpacity="1" />
                </linearGradient>
            </defs>
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={`url(#star-gradient-${index})`}
                stroke="currentColor"
            />
        </svg>
    );
}

export function Stars({ rating, onRate }) {
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(rating);

    const handleMouseEnter = (index) => setHoverRating(index + 1);
    const handleMouseLeave = () => setHoverRating(0);
    const handleClick = (index) => {
        setSelectedRating(index + 1);
        onRate(index + 1); // Notify parent component of selected rating
    };

    const stars = [];

    for (let i = 0; i < 5; i++) {
        const isFilled = hoverRating ? i < hoverRating : i < selectedRating;
        stars.push(
            <span
                key={i}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave}
            >
                <FractionalStar
                    rating={hoverRating || selectedRating}
                    index={i}
                    onClick={handleClick}
                    isFilled={isFilled}
                />
            </span>
        );

    }
    return <div className="flex">{stars}</div>;
}

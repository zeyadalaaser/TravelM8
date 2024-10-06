function FractionalStar(rating) {
    const percentage = rating * 100;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-yellow-400"
        >
            <defs>
                <linearGradient id={`star-gradient-${rating}`}>
                    <stop offset={`${percentage}%`} stopColor="currentColor" />
                    <stop offset={`${percentage}%`} stopColor="transparent" stopOpacity="1" />
                </linearGradient>
            </defs>
            <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={`url(#star-gradient-${rating})`}
                stroke="currentColor"
            />
        </svg>
    );
}

export function Stars({ rating }) {
    const stars = [];
    for (let i = 0; i < 5; i++, rating--) {
        if (rating > 1)
            stars.push(FractionalStar(1));
        else if (rating > 0 && rating < 1)
            stars.push(FractionalStar(rating));
        else
            stars.push(FractionalStar(0));
    }
    return stars;
}
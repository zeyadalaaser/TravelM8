import React, { createContext, useState, useContext } from 'react';

const WalkthroughContext = createContext();

export function WalkthroughProvider({ children }) {
  const [steps, setSteps] = useState([]);
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  const addSteps = (pageSteps, page) => {
    setSteps(prevSteps => {
      if (page === currentPage) {
        return pageSteps;
      }
      return prevSteps;
    });
  };

  const clearSteps = () => {
    setSteps([]);
  };

  const toggleWalkthrough = () => {
    setIsWalkthroughActive(prev => !prev);
  };

  const setPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <WalkthroughContext.Provider 
      value={{ 
        steps, 
        addSteps, 
        clearSteps, 
        toggleWalkthrough, 
        isWalkthroughActive,
        currentPage,
        setPage
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const context = useContext(WalkthroughContext);
  if (context === undefined) {
    throw new Error('useWalkthrough must be used within a WalkthroughProvider');
  }
  return context;
}

// Define walkthrough steps for each page
export const pageSteps = {
  activities: [
    {
      target: '[data-tour="search-bar"]',
      content: 'Use the search bar to find activities by name, category, or tag.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sort-selection"]',
      content: 'Sort activities based on different criteria.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: 'Use these filters to refine your search results.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="activities-list"]',
      content: 'Browse through the list of available activities.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="pagination"]',
      content: 'Navigate through different pages of activities.',
      disableBeacon: true,
    }
  ],
  itineraries: [
    {
      target: '[data-tour="itinerary-search"]',
      content: 'Use the search bar to find itineraries by name or tag.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="itinerary-sort"]',
      content: 'Sort itineraries based on different criteria.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="itinerary-filters"]',
      content: 'Use these filters to refine your search results.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="itinerary-cards"]',
      content: 'Browse through our carefully curated itineraries.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="itinerary-pagination"]',
      content: 'here is to go to next page.',
      disableBeacon: true,
    }
  ],
  products: [
    {
      target: '[data-tour="search-bar"]',
      content: 'Search for products by name.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="sort-selection"]',
      content: 'Filter products by price and rating.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="filters"]',
      content: 'Browse through our product collection.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="Product-list"]',
      content: 'Browse through the list of available Products and add to cart.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="pagination"]',
      content: 'Navigate through different pages of Products.',
      disableBeacon: true,
    },
  ],
  flights: [
    {
      target: '[data-tour="flight-search"]',
      content: 'Search for flights by selecting cities and dates.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="flight-filters"]',
      content: 'Filter flights by price and duration.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="flight-list"]',
      content: 'Browse through available flights.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="flight"]',
      content: 'Browse through available flights.',
      disableBeacon: true,
    }
  ],
  hotels: [
    {
      target: '[data-tour="hotel-search"]',
      content: 'Search for hotels by location and dates.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="hotel-filters"]',
      content: 'Filter hotels by price, rating, and amenities.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="hotel-list"]',
      content: 'Browse through available hotels.',
      disableBeacon: true,
    }
  ],
  museums: [
    {
      target: '[data-tour="museums-search"]',
      content: 'Use the search bar to find museums by name or tag.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="museums-filters"]',
      content: 'Use these filters to refine your search results.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="museums-list"]',
      content: 'Browse through the list of available museums.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="museums-pagination"]',
      content: 'Navigate through different pages of museums.',
      disableBeacon: true,
    }
  ]
};


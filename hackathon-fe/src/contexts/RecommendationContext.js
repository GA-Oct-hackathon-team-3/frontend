import { createContext, useContext, useState } from "react";

const RecommendationContext = createContext();

export function useRecommendation() {
    const context = useContext(RecommendationContext);
    if (!context) {
        throw new Error('useRecommendation must be used within a RecommendationProvider');
    }
    return context;
}

export function RecommendationProvider({ children }) {
    const [cache, setCache] = useState({});

    const updateCache = (friendId, recommendations) => {
        setCache({ ...cache, [friendId]: recommendations });
    }

    const clearCacheOf = (friendId) => {
        const prevCache = { ...cache };
        delete prevCache[friendId];
        setCache(prevCache);
    }

    const values = {
        cache,
        updateCache,
        clearCacheOf,
    }
    return (
        <RecommendationContext.Provider value={values}>
            {children}
        </RecommendationContext.Provider>
    );
}
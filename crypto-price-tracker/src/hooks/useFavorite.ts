import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "../constants";

function load(): string[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
            return parsed;
        }
        return [];
    } catch {
        return [];
    }
}

export function useFavorite() {

    const [favorite, setFavorite] = useState<string[]>(load);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorite));
    }, [favorite]);

    const toggle = useCallback((symbol: string) => {
        setFavorite((prev) =>
            prev.includes(symbol)
                ? prev.filter((s) => s !== symbol)
                : [...prev, symbol]
        );
    }, []);

    const favoriteSet = useMemo(() => new Set(favorite), [favorite]);
    const isFavorite = useCallback((s: string) => favoriteSet.has(s), [favoriteSet]);

    return { favorite, toggle, isFavorite };
}



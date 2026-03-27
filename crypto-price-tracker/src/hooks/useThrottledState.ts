import { useCallback, useRef, useState, useEffect } from "react";
import { THROTTLE_MS } from "../constants";

export function useThrottledState<T>(initial: T): [T, (value: T) => void] {

    const [state, setState] = useState<T>(initial);
    const pendingRef = useRef<{ val: T, dirty: boolean }>({ val: initial, dirty: false });
    const timingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setThrottledState = useCallback((value: T) => {

        pendingRef.current.val = value;
        pendingRef.current.dirty = true;

        if (!timingRef.current) {
            timingRef.current = setTimeout(() => {
                timingRef.current = null;
                if (pendingRef.current.dirty) {
                    pendingRef.current.dirty = false;
                    setState(pendingRef.current.val);
                }
            }, THROTTLE_MS);
        }
    }, [])

    useEffect(() => () => { if (timingRef.current) clearTimeout(timingRef.current); }, []);

    return [state, setThrottledState];
}
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import telemetryManager from './telemetryManager';

export const usePageTracking = (
    userContext: Record<string, any> = {}
) => {
    const location = useLocation();
    const startTimeRef = useRef<number>(Date.now());
    const previousPathRef = useRef<string>(location.pathname);

    useEffect(() => {
        const now = Date.now();
        const duration = now - startTimeRef.current;
        const sessionId = sessionStorage.getItem('telemetry_session_id');

        if (sessionId && previousPathRef.current) {
            telemetryManager.trackPageView(
                previousPathRef.current, // previous page
                sessionId,
                duration,
                userContext
            );
        }

        // Update refs for next navigation
        startTimeRef.current = Date.now();
        previousPathRef.current = location.pathname;
    }, [location.pathname]);
};

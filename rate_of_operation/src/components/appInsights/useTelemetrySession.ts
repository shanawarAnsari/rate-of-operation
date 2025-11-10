import { useEffect, useRef, useState } from 'react';
import { createNewSessionId } from './sessionUtils';
import telemetryManager from './telemetryManager';

const INACTIVITY_THRESHOLD = 3 * 60 * 1000; // 3 minutes

export const useTelemetrySession = (userContext: Record<string, any> = {}) => {
    const sessionStartTimeRef = useRef<number | null>(null);
    const lastActivityTimeRef = useRef<number>(Date.now());
    const sessionIdRef = useRef<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const hasStartedRef = useRef(false);
    const inactivityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startSession = () => {
        const newSessionId = createNewSessionId();
        sessionStartTimeRef.current = Date.now();
        sessionIdRef.current = newSessionId;
        setSessionId(newSessionId);
        hasStartedRef.current = true;

        telemetryManager.trackSessionStart(newSessionId, {
            ...userContext,
            sessionId: newSessionId,
        });

        lastActivityTimeRef.current = Date.now();
        console.log('Session started:', newSessionId);
    };

    const endSession = () => {
        const currentSessionId = sessionIdRef.current;
        const startTime = sessionStartTimeRef.current;

        if (!hasStartedRef.current || !currentSessionId || !startTime) return;

        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

        telemetryManager.trackSessionEnd(currentSessionId, durationSeconds, {
            ...userContext,
            sessionId: currentSessionId,
        });
        sessionStorage.removeItem('telemetry_session_id');
        sessionIdRef.current = null;
        setSessionId(null);
        hasStartedRef.current = false;
        sessionStartTimeRef.current = null;
    };

    const handleUserActivity = () => {
        const now = Date.now();
        lastActivityTimeRef.current = now;

        if (!hasStartedRef.current) {
            startSession();
        }
    };

    const checkInactivity = () => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityTimeRef.current;

        if (hasStartedRef.current && timeSinceLastActivity >= INACTIVITY_THRESHOLD) {
            console.log('User inactive for 3 minutes, restarting session...');
            endSession();
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            visibilityTimeoutRef.current = setTimeout(() => {
                console.log('Tab hidden for 3 minutes, ending session...');
                endSession();
            }, INACTIVITY_THRESHOLD);
        } else {
            if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
                visibilityTimeoutRef.current = null;
            }
        }
    };

    useEffect(() => {
        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
        activityEvents.forEach(event => window.addEventListener(event, handleUserActivity));

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            endSession();
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your session will end.';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        inactivityCheckIntervalRef.current = setInterval(checkInactivity, 1000);

        return () => {
            activityEvents.forEach(event => window.removeEventListener(event, handleUserActivity));
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            if (inactivityCheckIntervalRef.current) {
                clearInterval(inactivityCheckIntervalRef.current);
            }

            if (visibilityTimeoutRef.current) {
                clearTimeout(visibilityTimeoutRef.current);
            }

            endSession();
        };
    }, []);

    return { sessionId };
};

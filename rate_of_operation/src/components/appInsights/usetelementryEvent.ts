import { useCallback } from 'react';
import telemetryManager from './telemetryManager';

interface UserContext {
    email?: string;
    sessionId?: string;
    [key: string]: any;
}

interface EventData {
    [key: string]: any;
}

const useTelemetryEvent = (userContext: UserContext | null) => {
    const sessionId = sessionStorage.getItem('telemetry_session_id');

    const trackEvent = useCallback(
        (eventName: string, eventData: EventData = {}) => {
            telemetryManager.trackEvent(
                eventName,
                sessionId,
                eventData,
                {
                    userId: userContext?.email,
                    timestamp: new Date().toISOString(),
                }
            );
        },
        [userContext]
    );

    return { trackEvent };
};

export default useTelemetryEvent;

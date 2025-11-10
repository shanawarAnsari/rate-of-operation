import axios from 'axios';

const TELEMETRY_ENDPOINT = `${process.env.REACT_APP_API_BASE_URL}/telemetry`;

export interface UserContext {
    email?: string;
    sessionId?: string;
    [key: string]: any; // Allows additional custom attributes
}

export interface TelemetryPayload {
    userId: string | null;
    timestamp: string;
    page: string;
    sessionId: string | null;
    deviceType: 'Mobile' | 'Desktop';
    browser: string;
    [key: string]: any; // Allows merging custom attributes
}

const buildBaseProperties = (userContext: UserContext = {}): TelemetryPayload => ({
    userId: userContext.email || null,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    sessionId: userContext.sessionId || null,
    deviceType: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
    browser: navigator.userAgent,
    ...userContext // Merge additional custom attributes
});

const telemetryManager = {
    trackSessionStart: (sessionId: string, userContext: UserContext = {}) => {
        const payload = buildBaseProperties({ ...userContext, sessionId });
        axios.post(`${TELEMETRY_ENDPOINT}/session-start`, payload).catch(console.error);
    },

    trackSessionEnd: (sessionId: string, duration: number, userContext: UserContext = {}) => {
        const payload = buildBaseProperties({ ...userContext, sessionId, duration });
        axios.post(`${TELEMETRY_ENDPOINT}/session-end`, payload).catch(console.error);
    },

    trackPageView: (page: string, sessionId: string, duration: number, userContext: UserContext = {}) => {
        const payload = buildBaseProperties({ ...userContext, page, duration: duration / 1000, sessionId });
        axios.post(`${TELEMETRY_ENDPOINT}/page-time`, payload).catch(console.error);
    },

    trackEvent: (eventName: string, sessionId: any, eventData: Record<string, any> = {}, userContext: UserContext = {}) => {
        const baseProps = buildBaseProperties({ ...userContext, sessionId });
        const payload = { name: eventName, properties: { ...baseProps, ...eventData } };
        axios.post(`${TELEMETRY_ENDPOINT}/event`, payload).catch(console.error);
    }
};

export default telemetryManager;

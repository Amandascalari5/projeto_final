'use server';

import { Driver, Meeting, Session } from "../types/driver";

const OPENF1_API_BASE = 'https://api.openf1.org/v1';

export async function getDrivers(sessionKey?: number): Promise<Driver[]> {
    let url = `${OPENF1_API_BASE}/drivers`;
    
    if (sessionKey) {
        url += `?session_key=${sessionKey}`;
    } else {
        url += `?session_key=latest`;
    }

    const response = await fetch(url, {
        next: { revalidate: 3600 }
    });

    if (!response.ok) {
        return [];
    }

    const drivers: Driver[] = await response.json();
    
    const uniqueDrivers = drivers.filter((driver, index, self) =>
        index === self.findIndex((d) => d.driver_number === driver.driver_number)
    );

    return uniqueDrivers;
}

export async function getMeetings(year: number = 2025): Promise<Meeting[]> {
    const response = await fetch(`${OPENF1_API_BASE}/meetings?year=${year}`, {
        next: { revalidate: 86400 }
    });

    if (!response.ok) {
        return [];
    }

    const meetings: Meeting[] = await response.json();
    return meetings;
}

export async function getLatestMeeting(): Promise<Meeting | null> {
    const meetings = await getMeetings(2025);
    
    if (meetings.length === 0) return null;

    const sortedMeetings = meetings.sort((a, b) => 
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    );

    return sortedMeetings[0];
}

export async function getSessions(meetingKey: number): Promise<Session[]> {
    const response = await fetch(`${OPENF1_API_BASE}/sessions?meeting_key=${meetingKey}`, {
        next: { revalidate: 3600 }
    });

    if (!response.ok) {
        return [];
    }

    const sessions: Session[] = await response.json();
    return sessions;
}

export async function getLatestRaceSession(): Promise<Session | null> {
    const latestMeeting = await getLatestMeeting();
    
    if (!latestMeeting) return null;

    const sessions = await getSessions(latestMeeting.meeting_key);
    const raceSessions = sessions.filter(s => s.session_type === 'Race');

    if (raceSessions.length === 0) return null;

    return raceSessions[raceSessions.length - 1];
}

export async function getCurrentSeasonDrivers(): Promise<Driver[]> {
    const latestSession = await getLatestRaceSession();
    
    if (!latestSession) {
        return await getDrivers();
    }

    return await getDrivers(latestSession.session_key);
}
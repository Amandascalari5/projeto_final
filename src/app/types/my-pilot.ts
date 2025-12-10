export interface MyPilot {
    id: string;
    userId: string;
    driverNumber: number;
    addedAt: string;
}

export interface MyPilotWithDetails extends MyPilot {
    driverName: string;
    driverTeam: string;
    teamColour: string;
    headshot_url?: string;
}

export interface AddPilotDTO {
    driverNumber: number;
}
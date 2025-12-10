export interface Evaluation {
    id: string;
    userId: string;
    driverNumber: number;
    driverName: string;
    driverTeam: string;
    comment: string;
    season: number;
    meetingName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEvaluationDTO {
    driverNumber: number;
    driverName: string;
    driverTeam: string;
    comment: string;
    season: number;
    meetingName: string;
}

export interface UpdateEvaluationDTO {
    comment?: string;
    meetingName?: string;
}
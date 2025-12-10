'use server';

import ConexaoBD from "./conexao-db";
import { MyPilot, MyPilotWithDetails, AddPilotDTO } from "../types/my-pilot";
import { getCurrentSeasonDrivers } from "./open-f1-service";

const myPilotsDBFile = 'meus-pilotos-db.json';

export async function addPilotToCollection(userId: string, data: AddPilotDTO): Promise<{ success?: string; error?: string }> {
    const myPilots: MyPilot[] = await ConexaoBD.retornaBD(myPilotsDBFile);

    const alreadyExists = myPilots.some(
        myPilot => myPilot.userId === userId && myPilot.driverNumber === data.driverNumber
    );

    if (alreadyExists) {
        return { error: 'Piloto já está na sua coleção!' };
    }

    const newPilot: MyPilot = {
        id: crypto.randomUUID(),
        userId,
        driverNumber: data.driverNumber,
        addedAt: new Date().toISOString()
    };

    myPilots.push(newPilot);
    await ConexaoBD.armazenaBD(myPilotsDBFile, myPilots);

    return { success: 'Piloto adicionado à coleção!' };
}

export async function getMyPilotsWithDetails(userId: string): Promise<MyPilotWithDetails[]> {
    const myPilots: MyPilot[] = await ConexaoBD.retornaBD(myPilotsDBFile);
    const apiDrivers = await getCurrentSeasonDrivers();

    const userPilots = myPilots.filter(myPilot => myPilot.userId === userId);

    const pilotsWithDetails: MyPilotWithDetails[] = userPilots.map(myPilot => {
        const apiData = apiDrivers.find(driver => driver.driver_number === myPilot.driverNumber);

        return {
            ...myPilot,
            driverName: apiData?.full_name || 'Nome não disponível',
            driverTeam: apiData?.team_name || 'Equipe não disponível',
            teamColour: apiData?.team_colour || 'e10600',
            headshot_url: apiData?.headshot_url || undefined
        };
    });

    return pilotsWithDetails;
}

export async function isPilotInCollection(userId: string, driverNumber: number): Promise<boolean> {
    const myPilots: MyPilot[] = await ConexaoBD.retornaBD(myPilotsDBFile);
    return myPilots.some(myPilot => myPilot.userId === userId && myPilot.driverNumber === driverNumber);
}

export async function removePilotFromCollection(userId: string, driverNumber: number): Promise<{ success?: string; error?: string }> {
    const myPilots: MyPilot[] = await ConexaoBD.retornaBD(myPilotsDBFile);
    const filtered = myPilots.filter(
        myPilot => !(myPilot.userId === userId && myPilot.driverNumber === driverNumber)
    );

    if (filtered.length === myPilots.length) {
        return { error: 'Piloto não encontrado na coleção' };
    }

    await ConexaoBD.armazenaBD(myPilotsDBFile, filtered);
    return { success: 'Piloto removido da coleção!' };
}

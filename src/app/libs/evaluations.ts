
'use server';

import ConexaoBD from "./conexao-db";
import { Evaluation, CreateEvaluationDTO, UpdateEvaluationDTO } from "../types/evaluation";

const evaluationDBFile = 'avaliacoes-db.json';

export async function createEvaluation(userId: string, data: CreateEvaluationDTO): Promise<{ success?: string; error?: string }> {
    const evaluations: Evaluation[] = await ConexaoBD.retornaBD(evaluationDBFile);

    const newEvaluation: Evaluation = {
        id: crypto.randomUUID(),
        userId,
        driverNumber: data.driverNumber,
        driverName: data.driverName,
        driverTeam: data.driverTeam,
        comment: data.comment,
        season: data.season,
        meetingName: data.meetingName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    evaluations.push(newEvaluation);
    await ConexaoBD.armazenaBD(evaluationDBFile, evaluations);

    return { success: 'Avaliação criada com sucesso!' };
}

export async function getUserEvaluations(userId: string): Promise<Evaluation[]> {
    const evaluations: Evaluation[] = await ConexaoBD.retornaBD(evaluationDBFile);
    return evaluations.filter(evaluation => evaluation.userId === userId);
}

export async function getEvaluationById(evaluationId: string, userId: string): Promise<Evaluation | null> {
    const evaluations: Evaluation[] = await ConexaoBD.retornaBD(evaluationDBFile);
    const evaluation = evaluations.find(evaluation => evaluation.id === evaluationId && evaluation.userId === userId);
    return evaluation || null;
}

export async function updateEvaluation(
    evaluationId: string,
    userId: string,
    data: UpdateEvaluationDTO
): Promise<{ success?: string; error?: string }> {
    const evaluations: Evaluation[] = await ConexaoBD.retornaBD(evaluationDBFile);
    const index = evaluations.findIndex(evaluation => evaluation.id === evaluationId && evaluation.userId === userId);

    if (index === -1) {
        return { error: 'Avaliação não encontrada' };
    }

    evaluations[index] = {
        ...evaluations[index],
        ...data,
        updatedAt: new Date().toISOString()
    };

    await ConexaoBD.armazenaBD(evaluationDBFile, evaluations);
    return { success: 'Avaliação atualizada com sucesso!' };
}

export async function deleteEvaluation(evaluationId: string, userId: string): Promise<{ success?: string; error?: string }> {
    const evaluations: Evaluation[] = await ConexaoBD.retornaBD(evaluationDBFile);
    const filtered = evaluations.filter(evaluation => !(evaluation.id === evaluationId && evaluation.userId === userId));

    if (filtered.length === evaluations.length) {
        return { error: 'Avaliação não encontrada' };
    }

    await ConexaoBD.armazenaBD(evaluationDBFile, filtered);
    return { success: 'Avaliação removida com sucesso!' };
}
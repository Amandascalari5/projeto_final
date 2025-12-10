import { NextRequest, NextResponse } from 'next/server';
import { isSessionValid } from '@/app/libs/session';
import { getEvaluationById, updateEvaluation, deleteEvaluation } from '@/app/libs/evaluations';

// função para listar avaliação específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await isSessionValid();

    if (!session || typeof session === 'boolean') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const evaluation = await getEvaluationById(params.id, session.userId as string);

    if (!evaluation) {
        return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    return NextResponse.json(evaluation, { status: 200 });
}

// função para atualizar/editar avaliação específica
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await isSessionValid();

    if (!session || typeof session === 'boolean') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const result = await updateEvaluation(params.id, session.userId as string, body);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.success }, { status: 200 });
}

// função para deletar avaliação específica
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await isSessionValid();

    if (!session || typeof session === 'boolean') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const result = await deleteEvaluation(params.id, session.userId as string);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: result.success }, { status: 200 });
}
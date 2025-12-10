import { NextRequest, NextResponse } from 'next/server';
import { isSessionValid } from '@/app/libs/session';
import { createEvaluation, getUserEvaluations } from '@/app/libs/evaluations';

// função para listar todas as avaliações 
export async function GET() {
    const session = await isSessionValid();

    if (!session || typeof session === 'boolean') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const evaluations = await getUserEvaluations(session.userId as string);
    return NextResponse.json(evaluations, { status: 200 });
}

// função para criar novas avaliações
export async function POST(request: NextRequest) {
    const session = await isSessionValid();

    if (!session || typeof session === 'boolean') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const result = await createEvaluation(session.userId as string, body);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: result.success }, { status: 201 });
}
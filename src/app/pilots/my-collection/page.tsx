import { isSessionValid } from "@/app/libs/session";
import { getMyPilotsWithDetails } from "@/app/libs/my-pilots";
import { removePilotFromCollection } from "@/app/libs/my-pilots";
import { getUserEvaluations, deleteEvaluation } from "@/app/libs/evaluations";
import { redirect } from "next/navigation";
import Link from "next/link";
import '@/app/styles/my-collection.css';
import "@/app/styles/evaluation.css";

export default async function MyCollectionPage() {
    const session = await isSessionValid();
    
    if (!session || typeof session === 'boolean') {
        redirect('/login');
    }

    const userId = session.userId as string;

    const myPilotsWithDetails = await getMyPilotsWithDetails(userId);
    const allEvaluations = await getUserEvaluations(userId);

    const pilotsWithStats = myPilotsWithDetails.map((myPilot) => {
        const pilotEvaluations = allEvaluations.filter(
            evaluation => evaluation.driverNumber === myPilot.driverNumber
        );

        return {
            ...myPilot,
            evaluations: pilotEvaluations
        };
    });
    const removePilotAction = async (formData: FormData) => {
        "use server";

        const driverNumber = Number(formData.get("driverNumber"));

        await removePilotFromCollection(userId, driverNumber);

        redirect("/pilots/my-collection");
    };

    const deleteEvaluationAction = async (formData: FormData) => {
        "use server";

        const evaluationId = formData.get("evaluationId") as string;

        await deleteEvaluation(evaluationId, userId);
        redirect('/pilots/my-collection');
    };

    return (
        <main className="my-collection-container">
            <div className="my-collection-header">
                <Link href="/pilots" className="btn-back">
                    ← VER TODOS OS PILOTOS
                </Link>

                <h1>⭐ MEUS PILOTOS</h1>
                <p className="my-collection-subtitle">
                    {pilotsWithStats.length} {pilotsWithStats.length === 1 ? 'piloto' : 'pilotos'} na sua coleção
                </p>
            </div>

            {pilotsWithStats.length === 0 ? (
                <div className="empty-my-collection">
                    <div className="empty-icon">🏎️</div>
                    <h2>Sua coleção está vazia</h2>
                    <p>Adicione pilotos à sua coleção para começar a avaliá-los!</p>
                    <Link href="/pilots" className="btn-add-first-pilot">
                        ➕ ADICIONAR PILOTOS
                    </Link>
                </div>
            ) : (
                <div className="evaluations-grid-main">

                    {pilotsWithStats.map((myPilot) => (
                        <div key={myPilot.driverNumber} className="evaluation-card-main">

                            <div 
                                className="eval-card-stripe"
                                style={{ backgroundColor: `#${myPilot.teamColour}` }}
                            />
                                    <form action={removePilotAction} className="eval-actions-main">
                                        <input type="hidden" name="driverNumber" value={myPilot.driverNumber} />
                                        <button className="btn-icon-edit">
                                            ❌
                                        </button>
                                    </form>
                            <div className="eval-card-content">
                                
                                <div className="eval-header-main">
                                    {myPilot.headshot_url && (
                                        <img 
                                            src={myPilot.headshot_url}
                                            alt={myPilot.driverName}
                                            className="eval-pilot-photo"
                                        />
                                    )}
                                    
                                    <div className="eval-pilot-info">
                                        <h3>{myPilot.driverName}</h3>
                                        <p style={{ color: `#${myPilot.teamColour}` }}>
                                            {myPilot.driverTeam}
                                        </p>
                                        <div className="driver-badge">
                                            <span>#{myPilot.driverNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {myPilot.evaluations.length > 0 ? (
                                    myPilot.evaluations.map((evaluation) => (
                                        <div key={evaluation.id}>
                                            <span className="recent-gp">📍 {evaluation.meetingName}</span>
                                            <div className="eval-comment-main">
                                                {evaluation.comment}
                                            </div>

                                            <div className="eval-footer-main">
                                                <span className="eval-date-main">
                                                    📅 {new Date(evaluation.createdAt).toLocaleDateString('pt-BR')}
                                                </span>
                                                
                                                
                                                <div className="eval-actions-main">
                                                    <Link
                                                        href={`/pilots/${evaluation.id}/edit`}
                                                        className="btn-icon-edit"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </Link>

                                                    <form action={deleteEvaluationAction}>
                                                        <input type="hidden" name="evaluationId" value={evaluation.id} />
                                                        <button 
                                                            type="submit" 
                                                            className="btn-icon-delete"
                                                            title="Deletar"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-evaluation">
                                        <p>Este piloto ainda não possui avaliações.</p>
                                        <Link 
                                            href={`/pilots/new?driver=${myPilot.driverNumber}&name=${myPilot.driverName}&team=${myPilot.driverTeam}`}
                                            className="btn-add-evaluation"
                                        >
                                            ➕ Fazer primeira avaliação
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

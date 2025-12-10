import Link from "next/link";
import ConexaoBD from "@/app/libs/conexao-db";
import { isSessionValid } from "@/app/libs/session";
import { redirect } from "next/navigation";
import '@/app/styles/evaluation.css';

const evaluationDBFile = 'avaliacoes-db.json';

interface EditEvaluationProps {
    params: Promise<{ evaluationId: string }>;
}

export default async function EditEvaluation({ params }: EditEvaluationProps) {
    
    const { evaluationId } = await params;
    
    const session = await isSessionValid();
    if (!session || typeof session === 'boolean') {
        redirect('/login');
    }
    
    const userId = session.userId as string;
    
    const evaluationsDB = await ConexaoBD.retornaBD(evaluationDBFile);
    
    const evaluationToEdit = evaluationsDB.find(
        (e: any) => e.id === evaluationId && e.userId === userId
    );
    
    const evaluationIndex = evaluationsDB.findIndex(
        (e: any) => e.id === evaluationId && e.userId === userId
    );
    
    if (!evaluationToEdit || evaluationIndex === -1) {
        redirect('/pilots/my-collection');
    }
    
    const updateEvaluation = async (formData: FormData) => {
        "use server";

        const updatedEvaluation = {
            ...evaluationToEdit,
            comment: formData.get('comment') as string,
            meetingName: formData.get('meetingName') as string,
            updatedAt: new Date().toISOString()
        }

        evaluationsDB.splice(evaluationIndex, 1, updatedEvaluation);
        await ConexaoBD.armazenaBD(evaluationDBFile, evaluationsDB);
        
        redirect('/pilots/my-collection');
    }

    return (
        <div className="evaluation-form-container">
            <div className="form-header">
                <Link href="/pilots/my-collection" className="btn-back">
                    ← VOLTAR
                </Link>
                <h1>✏️ EDITAR AVALIAÇÃO</h1>
                <p className="form-subtitle">
                    Editando avaliação de {evaluationToEdit.driverName}
                </p>
            </div>
            
            <form action={updateEvaluation} className="evaluation-form">
                <div className="driver-info">
                    <h3>{evaluationToEdit.driverName}</h3>
                    <p>{evaluationToEdit.driverTeam}</p>
                    <span className="driver-badge">#{evaluationToEdit.driverNumber}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="meetingName">Grande Prêmio</label>
                    <select 
                        id="meetingName" 
                        name="meetingName" 
                        required 
                        className="form-select"
                        defaultValue={evaluationToEdit.meetingName}
                    >
                        <option value="">Selecione um GP</option>
                        <option value="Bahrain Grand Prix">Bahrain GP</option>
                        <option value="Saudi Arabian Grand Prix">Saudi Arabian GP</option>
                        <option value="Australian Grand Prix">Australian GP</option>
                        <option value="Japanese Grand Prix">Japanese GP</option>
                        <option value="Chinese Grand Prix">Chinese GP</option>
                        <option value="Miami Grand Prix">Miami GP</option>
                        <option value="Emilia Romagna Grand Prix">Emilia Romagna GP</option>
                        <option value="Monaco Grand Prix">Monaco GP</option>
                        <option value="Canadian Grand Prix">Canadian GP</option>
                        <option value="Spanish Grand Prix">Spanish GP</option>
                        <option value="Austrian Grand Prix">Austrian GP</option>
                        <option value="British Grand Prix">British GP</option>
                        <option value="Hungarian Grand Prix">Hungarian GP</option>
                        <option value="Belgian Grand Prix">Belgian GP</option>
                        <option value="Dutch Grand Prix">Dutch GP</option>
                        <option value="Italian Grand Prix">Italian GP</option>
                        <option value="Azerbaijan Grand Prix">Azerbaijan GP</option>
                        <option value="Singapore Grand Prix">Singapore GP</option>
                        <option value="United States Grand Prix">United States GP</option>
                        <option value="Mexico City Grand Prix">Mexico City GP</option>
                        <option value="São Paulo Grand Prix">São Paulo GP</option>
                        <option value="Las Vegas Grand Prix">Las Vegas GP</option>
                        <option value="Qatar Grand Prix">Qatar GP</option>
                        <option value="Abu Dhabi Grand Prix">Abu Dhabi GP</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comentário</label>
                    <textarea 
                        id="comment" 
                        name="comment" 
                        rows={4}
                        required
                        placeholder="Descreva o desempenho do piloto..."
                        className="form-textarea"
                        defaultValue={evaluationToEdit.comment}
                    />
                </div>

                <button className="btn-submit">💾 SALVAR ALTERAÇÕES</button>
            </form>
        </div>
    );
}
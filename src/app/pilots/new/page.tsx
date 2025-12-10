
import Link from "next/link";
import ConexaoBD from "@/app/libs/conexao-db";
import { isSessionValid } from "@/app/libs/session";
import { redirect } from "next/navigation";
import "@/app/styles/evaluation.css";

const evaluationDBFile = "avaliacoes-db.json";

export default async function NewEvaluation({
    searchParams,
}: {
    searchParams: Promise<{ driver?: string; name?: string; team?: string }>;
}) {
    const session = await isSessionValid();
    if (!session || typeof session === "boolean") {
        redirect("/login");
    }

    const userId = session.userId as string;

    const params = await searchParams;

    const driver = params.driver ?? "";
    const name = params.name ?? "";
    const team = params.team ?? "";

    const addEvaluation = async (formData: FormData) => {
        "use server";

        const novaAvaliacao = {
            id: crypto.randomUUID(),
            userId,
            driverNumber: parseInt(driver as string),
            driverName: name as string,
            driverTeam: team as string,
            comment: formData.get("comment") as string,
            meetingName: formData.get("meetingName") as string,
            season: 2025,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const avaliacoesDB = await ConexaoBD.retornaBD(evaluationDBFile);
        avaliacoesDB.push(novaAvaliacao);
        await ConexaoBD.armazenaBD(evaluationDBFile, avaliacoesDB);

        redirect("/pilots/my-collection");
    };

    return (
        <div className="evaluation-form-container">
            <div className="form-header">
                <Link href="/pilots/my-collection" className="btn-back">
                    ← VOLTAR
                </Link>
                <h1>🏁 NOVA AVALIAÇÃO</h1>
                <p className="form-subtitle">Avalie o desempenho de {name}</p>
            </div>

            <form action={addEvaluation} className="evaluation-form">
                <div className="driver-info">
                    <h3>{name}</h3>
                    <p>{team}</p>
                    <span className="driver-badge">#{driver}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="meetingName">Grande Prêmio</label>
                    <select 
                        id="meetingName" 
                        name="meetingName" 
                        required 
                        className="form-select"
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
                    />
                </div>

<button className="btn-submit">💾 SALVAR</button>
            </form>
        </div>
    );
}

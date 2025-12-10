import { isSessionValid } from "@/app/libs/session";
import { getMyPilotsWithDetails } from "@/app/libs/my-pilots";
import Link from "next/link";
import '@/app/styles/dashboard.css';
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await isSessionValid();
    
    if (!session || typeof session === 'boolean') {
        redirect('/login');
    }

    const myPilots = await getMyPilotsWithDetails(session.userId as string);

    return (
        <main className="dashboard-container">
            <div className="dashboard-header">
                <h1>🏁 DASHBOARD</h1>
                <p className="dashboard-subtitle">Bem-vindo ao F1 Pilot Manager</p>
            </div>

            <div className="actions-section">
                <h2>O que você quer fazer?</h2>
                <div className="action-cards">
                    <Link href="/pilots" className="action-card">
                        <div className="action-icon">🏎️</div>
                        <h3>Ver Pilotos F1</h3>
                        <p>Explore os pilotos da temporada atual</p>
                    </Link>

                    <Link href="/pilots/my-collection" className="action-card">
                        <div className="action-icon">⭐</div>
                        <h3>Meus Pilotos</h3>
                        <p>Gerencie seus {myPilots.length} pilotos salvos</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
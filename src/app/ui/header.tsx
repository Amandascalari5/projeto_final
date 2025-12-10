import Link from 'next/link';
import "@/app/styles/header.css";
import { isSessionValid } from '../libs/session';
import LogoutButton from './logout-btn';
import UserInfo from './user-info';

export default async function Header() {
    // Verifica se user está logado
    const isLogged = await isSessionValid();
    let userEmail: string = "";
    
    if (isLogged && typeof isLogged !== 'boolean') {
        userEmail = isLogged?.userEmail as string;
    }

    // Não mostrar header nas páginas de autenticação
    const isAuthPage = false; 

    return (
        <header className="f1-header">
            <section className="header-left">
                <div className="logo-container">
                    <span className="logo-flag">🏁</span>
                    <h1 className="logo-text">F1 PILOT MANAGER</h1>
                </div>
                {isLogged && (
                    <nav>
                        <ul className="nav-list">
                            <li><Link href="/dashboard">Dashboard</Link></li>
                            <li><Link href="/pilots">Pilotos F1</Link></li>
                            <li><Link href="/pilots/my-collection">Meus Pilotos</Link></li>
                        </ul>
                    </nav>
                )}
            </section>

            <section className="header-right">
                {isLogged && <UserInfo userEmail={userEmail} />}
                {isLogged && <LogoutButton />}
            </section>
        </header>
    );
}
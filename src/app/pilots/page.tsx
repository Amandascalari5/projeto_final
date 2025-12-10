import { getCurrentSeasonDrivers } from "@/app/libs/open-f1-service";
import { isSessionValid } from "@/app/libs/session";
import { isPilotInCollection, addPilotToCollection } from "@/app/libs/my-pilots";
import { redirect } from "next/navigation";
import Link from "next/link";
import "@/app/styles/pilots.css";

export default async function PilotsPage() {
    const session = await isSessionValid();

    if (!session || typeof session === "boolean") {
        redirect("/login");
    }

    const drivers = await getCurrentSeasonDrivers();

    const driversWithStatus = await Promise.all(
        drivers.map(async (driver) => ({
            ...driver,
            inCollection: await isPilotInCollection(
                session.userId as string,
                driver.driver_number
            ),
        }))
    );

    return (
        <main className="pilots-container">
            <div className="pilots-header">
                <h1>🏎️ PILOTOS F1</h1>
                <p className="pilots-subtitle">Temporada 2025 - Dados da OpenF1 API</p>
            </div>

            {driversWithStatus.length === 0 ? (
                <div className="no-drivers">
                    <p>Nenhum piloto encontrado.</p>
                </div>
            ) : (
                <div className="pilots-grid">
                    {driversWithStatus.map((driver) => {
                        const addToCollection = async () => {
                            "use server";

                            await addPilotToCollection(session.userId as string, {
                                driverNumber: driver.driver_number,
                            });

                            redirect("/pilots");
                        };

                        return (
                            <div key={driver.driver_number} className="pilot-card">
                                <div
                                    className="pilot-card-header"
                                    style={{ backgroundColor: `#${driver.team_colour}` }}
                                />

                                <div className="pilot-card-body">
                                    {driver.headshot_url ? (
                                        <img
                                            src={driver.headshot_url}
                                            alt={driver.full_name}
                                            className="pilot-photo"
                                        />
                                    ) : (
                                        <div className="pilot-photo-placeholder">
                                            {driver.name_acronym}
                                        </div>
                                    )}

                                    <h3 className="pilot-name">{driver.full_name}</h3>

                                    <p
                                        className="pilot-team"
                                        style={{ color: `#${driver.team_colour}` }}
                                    >
                                        {driver.team_name}
                                    </p>

                                    <div className="pilot-number">#{driver.driver_number}</div>

                                    {driver.inCollection ? (
                                        <>
                                            <div className="btn-in-collection">
                                                <span>✓</span> NA COLEÇÃO
                                            </div>

                                            <Link
                                                href={`/pilots/new?driver=${driver.driver_number}&name=${encodeURIComponent(
                                                    driver.full_name
                                                )}&team=${encodeURIComponent(driver.team_name)}`}
                                                className="btn-add-evaluation"
                                            >
                                                ⭐ AVALIAR
                                            </Link>
                                        </>
                                    ) : (
                                        <form action={addToCollection}>
                                            <button type="submit" className="btn-add-to-collection">
                                                <span>+</span> ADICIONAR À COLEÇÃO
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pilotos F1",
};

export default function PilotsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

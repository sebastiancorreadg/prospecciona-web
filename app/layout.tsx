import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Prospecciona | Tu Aliado Financiero',
    description: 'Prospecciona conecta tu visión con las oportunidades. Ofrecemos herramientas de evaluación, intermediación ágil y análisis de riesgo para negocios y personas.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="scroll-smooth">
            <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50`}>
                {children}
            </body>
        </html>
    );
}


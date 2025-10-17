import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'Sistema de Gestão de Horário Integral',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';
import Link from 'next/link';
export const metadata = { title: 'Núcleo L&P — V0', description: 'Panel mínimo (Sheets + Chat)' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="es">
<body className="app-body">
<header className="app-header">
<nav className="app-nav">
<span className="brand">Núcleo L&P</span>
<Link href="/" className="">Dashboard</Link>
<Link href="/clientes" className="">Clientes</Link>
<Link href="/proyectos" className="">Proyectos</Link>
<Link href="/facturas" className="">Facturas</Link>
<Link href="/chat" className="btn-chat">Chat</Link>
</nav>
</header>
<main className="app-main">{children}</main>
</body>
</html>
);
}

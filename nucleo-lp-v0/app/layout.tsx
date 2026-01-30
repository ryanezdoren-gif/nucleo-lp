import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Núcleo L&P — V0', description: 'Panel mínimo (Sheets + Chat)' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[radial-gradient(1200px_800px_at_70%_-10%,rgba(168,85,247,.12),transparent_60%),radial-gradient(800px_600px_at_-10%_40%,rgba(0,229,255,.12),transparent_60%),#0b0f14] text-slate-200">
        <header className="border-b border-white/10">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 text-sm">
            <span className="font-bold text-cyan-300">Núcleo L&P</span>
            <Link href="/" className="hover:text-white/90">Dashboard</Link>
            <Link href="/clientes" className="hover:text-white/90">Clientes</Link>
            <Link href="/proyectos" className="hover:text-white/90">Proyectos</Link>
            <Link href="/facturas" className="hover:text-white/90">Facturas</Link>
            <Link href="/chat" className="ml-auto px-3 py-1 rounded bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30">Chat</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

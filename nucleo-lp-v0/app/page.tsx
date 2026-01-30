import { readSheet } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [facturas] = await Promise.all([
    readSheet('Facturas').catch(() => [] as any[]),
  ]);

  const hoy = new Date();
  const toCLP = (n:number)=> new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP'}).format(n||0);
  const num = (v:any)=> typeof v==='string'? Number(v.replace(/[^0-9.-]/g,'')) : Number(v||0);

  const nowMonth = hoy.getMonth()+1, nowYear = hoy.getFullYear();
  const isThisMonth = (d:string)=>{ const dt = new Date(d); return dt.getMonth()+1===nowMonth && dt.getFullYear()===nowYear; };

  const mrr = facturas.filter(f=> String(f.tipo).toLowerCase()==='maintenance' || String(f.tipo).toLowerCase()==='mantencion' || String(f.tipo).toLowerCase()==='mantención')
                      .filter(f=> String(f.estado).toLowerCase()==='paid' || String(f.estado).toLowerCase()==='pagado')
                      .reduce((a,f)=> a+num(f.monto_clp),0);

  const ingresosMes = facturas.filter(f=> String(f.tipo).toLowerCase()!=='maintenance' && isThisMonth(f.vence_en))
                              .filter(f=> String(f.estado).toLowerCase()==='paid' || String(f.estado).toLowerCase()==='pagado')
                              .reduce((a,f)=> a+num(f.monto_clp),0);

  const pendiente = facturas.filter(f=> /pendiente/i.test(f.estado)).reduce((a,f)=> a+num(f.monto_clp),0);
  const vencidas = facturas.filter(f=> /vencid/i.test(f.estado)).length;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card"><div className="text-sm text-slate-400">MRR Mantenciones</div><div className="text-3xl font-bold">{toCLP(mrr)}</div></div>
      <div className="card"><div className="text-sm text-slate-400">Ingresos One‑off (mes)</div><div className="text-3xl font-bold">{toCLP(ingresosMes)}</div></div>
      <div className="card"><div className="text-sm text-slate-400">Pendiente por cobrar</div><div className="text-3xl font-bold">{toCLP(pendiente)}</div></div>
      <div className="card"><div className="text-sm text-slate-400">Facturas vencidas (#)</div><div className="text-3xl font-bold">{vencidas}</div></div>
    </div>
  );
}

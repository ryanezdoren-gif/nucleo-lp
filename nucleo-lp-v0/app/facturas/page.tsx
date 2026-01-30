import { readSheet } from '@/lib/sheets';
export const dynamic = 'force-dynamic';
export default async function Facturas(){
  const rows = await readSheet('Facturas').catch(()=>[] as any[]);
  const now = new Date();
  const daysUntil = (d:string)=> Math.ceil((new Date(d).getTime()-now.getTime())/86400000);
  const badge = (d:string, estado:string)=>{
    if(/pagad/i.test(estado)) return <span className="badge green">Pagado</span>;
    const left = daysUntil(d);
    if(left <= 0) return <span className="badge red">Vencido</span>;
    if(left <= 5) return <span className="badge amber">Vence ≤5 días</span>;
    return <span className="badge">Pendiente</span>;
  };
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Facturas</h2>
      <table className="table">
        <thead><tr><th className="th">Cliente</th><th className="th">Proyecto</th><th className="th">Tipo</th><th className="th">Monto (CLP)</th><th className="th">Vence</th><th className="th">Estado</th></tr></thead>
        <tbody>
          {rows.map((r:any,i:number)=> (
            <tr key={i}>
              <td className="td">{r.cliente_id}</td>
              <td className="td">{r.proyecto_id}</td>
              <td className="td">{r.tipo}</td>
              <td className="td">{r.monto_clp}</td>
              <td className="td">{r.vence_en}</td>
              <td className="td">{badge(r.vence_en, r.estado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

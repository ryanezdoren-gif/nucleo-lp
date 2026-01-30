import { readSheet } from '../../lib/sheets';
export const dynamic = 'force-dynamic';
export default async function Proyectos(){
  const rows = await readSheet('Proyectos').catch(()=>[] as any[]);
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Proyectos</h2>
      <table className="table">
        <thead><tr><th className="th">Proyecto</th><th className="th">Cliente</th><th className="th">Estado</th><th className="th">Vence</th></tr></thead>
        <tbody>
          {rows.map((r:any,i:number)=> {
            const estado=(r.estado||'').toLowerCase();
            return (
              <tr key={i}>
                <td className="td">{r.nombre}</td>
                <td className="td">{r.cliente_id}</td>
                <td className="td">{r.estado}</td>
                <td className="td">{r.vence_en}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

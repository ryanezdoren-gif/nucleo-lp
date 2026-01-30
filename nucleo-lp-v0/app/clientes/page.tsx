import { readSheet } from '@/lib/sheets';
export const dynamic = 'force-dynamic';
export default async function Clientes(){
  const rows = await readSheet('Clientes').catch(()=>[] as any[]);
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Clientes</h2>
      <table className="table">
        <thead><tr><th className="th">Nombre</th><th className="th">Contacto</th><th className="th">Email</th><th className="th">Teléfono</th></tr></thead>
        <tbody>
          {rows.map((r:any,i:number)=> (
            <tr key={i}>
              <td className="td">{r.nombre}</td>
              <td className="td">{r.contacto}</td>
              <td className="td">{r.email}</td>
              <td className="td">{r.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

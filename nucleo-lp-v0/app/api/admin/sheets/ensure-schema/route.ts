import { NextRequest, NextResponse } from 'next/server';
import { ensureHeaders, writeHeaderAwareRow } from '../../../../../lib/sheets';

function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

export async function GET(req: NextRequest){
const token = req.nextUrl.searchParams.get('token') || '';
const demo = req.nextUrl.searchParams.get('demo') === 'true';
if (!process.env.NUCLEO_ADMIN_TOKEN) return bad('Server missing NUCLEO_ADMIN_TOKEN', 500);
if (token !== process.env.NUCLEO_ADMIN_TOKEN) return bad('Unauthorized', 401);
try{
await ensureHeaders('Clientes', ['id','nombre','contacto','email','telefono','notas','creado_en']);
await ensureHeaders('Proyectos', ['id','cliente_id','nombre','estado','inicio_en','vence_en','responsable']);
await ensureHeaders('Facturas', ['id','cliente_id','proyecto_id','tipo','monto_clp','vence_en','estado','notas']);

if (demo){
  await writeHeaderAwareRow('Clientes', { id: '1', nombre:'Acme SA', contacto:'Juan Pérez', email:'juan@acme.cl', telefono:'+56 9 1111 1111', notas:'Cliente demo', creado_en:'2026-01-30' });
  await writeHeaderAwareRow('Proyectos', { id:'1', cliente_id:'1', nombre:'Web corporativa', estado:'activo', inicio_en:'2026-01-15', vence_en:'2026-02-15', responsable:'Ray' });
  await writeHeaderAwareRow('Facturas', { id:'1', cliente_id:'1', proyecto_id:'1', tipo:'mantención', monto_clp:'100000', vence_en:'2026-02-10', estado:'pagado', notas:'enero' });
  await writeHeaderAwareRow('Facturas', { id:'2', cliente_id:'1', proyecto_id:'1', tipo:'desarrollo', monto_clp:'800000', vence_en:'2026-02-10', estado:'pagado', notas:'versión inicial' });
  await writeHeaderAwareRow('Facturas', { id:'3', cliente_id:'1', proyecto_id:'1', tipo:'mantención', monto_clp:'150000', vence_en:'2026-02-20', estado:'pendiente', notas:'febrero' });
}

return NextResponse.json({ ok:true, demo });

}catch(err:any){
return bad(err?.message || 'ensure-schema failed', 500);
}
}

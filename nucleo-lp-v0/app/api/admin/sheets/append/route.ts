import { NextRequest, NextResponse } from 'next/server';
import { readSheet, writeHeaderAwareRow } from '../../../../../lib/sheets';

function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

export async function GET(req: NextRequest){
const token = req.nextUrl.searchParams.get('token') || '';
if (!process.env.NUCLEO_ADMIN_TOKEN) return bad('Server missing NUCLEO_ADMIN_TOKEN', 500);
if (token !== process.env.NUCLEO_ADMIN_TOKEN) return bad('Unauthorized', 401);

const tab = req.nextUrl.searchParams.get('tab');
const row = req.nextUrl.searchParams.get('row');
if(!tab || !row) return bad('Missing tab or row');

try{
const headers = await readSheet(tab).then(r=> (r[0]? Object.keys(r[0]): [])).catch(()=>[] as string[]);
if(headers.length===0){
return bad('Sheet has no header row in tab: '+tab);
}
const values = row.split(',');
const mapped: Record<string, any> = {};
headers.forEach((h, i)=> mapped[h] = values[i] ?? '');
await writeHeaderAwareRow(tab, mapped);
return NextResponse.json({ ok:true });
}catch(err:any){
return bad(err?.message || 'append failed', 500);
}
}

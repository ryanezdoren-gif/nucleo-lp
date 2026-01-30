import { NextRequest, NextResponse } from 'next/server';
import { upsertRowByKey } from '../../../../../lib/sheets';

function bad(msg: string, code=400){ return NextResponse.json({ ok:false, error: msg }, { status: code }); }

export async function GET(req: NextRequest){
const token = req.nextUrl.searchParams.get('token') || '';
if (!process.env.NUCLEO_ADMIN_TOKEN) return bad('Server missing NUCLEO_ADMIN_TOKEN', 500);
if (token !== process.env.NUCLEO_ADMIN_TOKEN) return bad('Unauthorized', 401);

const tab = req.nextUrl.searchParams.get('tab');
const key = req.nextUrl.searchParams.get('key'); // header name, e.g., id
const row = req.nextUrl.searchParams.get('row'); // CSV values in header order
if(!tab || !key || !row) return bad('Missing tab, key, or row');

try{
await upsertRowByKey(tab, key, row.split(','));
return NextResponse.json({ ok:true });
}catch(err:any){
return bad(err?.message || 'upsert failed', 500);
}
}

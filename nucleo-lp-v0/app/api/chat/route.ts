import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest){
  try{
    const { messages, model } = await req.json();
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = { role:'system', content:'Eres "El Mago Sabio" (The Wise Wizard), experto técnico y conciso. Responde en español claro para la app.' } as const;
    const chat = await client.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [system, ...messages.map((m:any)=>({ role:m.role, content:m.content }))],
      temperature: 0.5,
    });
    const reply = chat.choices?.[0]?.message?.content || '';
    return NextResponse.json({ reply });
  }catch(err:any){
    return NextResponse.json({ error: err.message||'error' }, { status: 500 });
  }
}

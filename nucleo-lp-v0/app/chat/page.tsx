'use client';
import { useState } from 'react';

export default function ChatPage(){
  const [messages, setMessages] = useState<{role:'user'|'assistant', content:string}[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [loading, setLoading] = useState(false);

  async function send(){
    const text = input.trim(); if(!text) return; setInput('');
    const next = [...messages, {role:'user', content:text}]; setMessages(next); setLoading(true);
    const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: next, model }) });
    const data = await res.json();
    setMessages([...next, {role:'assistant', content:data.reply||'(no reply)'}]);
    setLoading(false);
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Modelo</span>
          <select className="bg-transparent border border-white/20 rounded px-2 py-1" value={model} onChange={e=>setModel(e.target.value)}>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
          </select>
        </div>
      </div>
      <div className="card min-h-[320px]">
        <div className="space-y-2">
          {messages.map((m,i)=> (
            <div key={i} className={m.role==='user'? 'text-white':'text-cyan-300'}>
              <b>{m.role==='user'? 'Tú':'Mago'}:</b> {m.content}
            </div>
          ))}
          {loading && <div className="text-purple-300">…pensando</div>}
        </div>
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} placeholder="Escribe un mensaje" className="flex-1 bg-transparent border border-white/20 rounded px-3 py-2"/>
        <button onClick={send} className="px-4 py-2 rounded bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30">Enviar</button>
      </div>
    </div>
  );
}

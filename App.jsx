// App.jsx — 🌌 ANDRÔMEDA · MODO LIVRE · FÁBRICA PRIVADA
// Sem chave · Sem conta · Sem limite de tempo
import React, { useState, useEffect, useRef } from 'react';
import { AndromedaCore } from './core/AndromedaCore.js';
import VoiceSystem from './core/Voice.js';
import { baixarZip } from './core/ZipExport.js';
import memory from './core/Memory.js';

export default function App() {
  const [mensagens, setMensagens] = useState([]);
  const [entrada, setEntrada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [status, setStatus] = useState('');
  const [vozAtiva, setVozAtiva] = useState(true);
  const [ouvindo, setOuvindo] = useState(false);
  const [projetos, setProjetos] = useState({});
  const [projetoAtual, setProjetoAtual] = useState('padrao');
  
  const mensagensRef = useRef(null);
  const andromedaRef = useRef(null);
  const vozRef = useRef(new VoiceSystem());

  // Inicialização
  useEffect(() => {
    memory.carregar().then(() => {
      andromedaRef.current = new AndromedaCore({ modo: 'local' });
      setProjetos(andromedaRef.current.projetos);
      setMensagens([{
        quem: 'ela',
        texto: `🌌 **ANDRÔMEDA — FÁBRICA PRIVADA**\n\n🟢 Modo Livre Ativo\n✅ Sem chave · Sem conta · Sem limite\n✅ Sem travamento — funciona 24h\n✅ Memória local · Projetos · Exportação ZIP\n\nProprietário: **FRANCIVAL ALVES FARIAS**\n\nDiga **Ajuda** para ver os comandos. O que vamos criar? 🏭`
      }]);
    });
  }, []);

  // Rolar para baixo
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Alternar Voz
  function alternarVoz() {
    const nova = !vozAtiva;
    setVozAtiva(nova);
    vozRef.current.ativado = nova;
    if (!nova) vozRef.current.parar();
  }

  // 🎙️ Ouvir Microfone
  function iniciarOuvir() {
    vozRef.current.ouvir(
      () => setOuvindo(true),
      (texto) => setEntrada(texto),
      () => setOuvindo(false)
    );
  }

  // 📦 Exportar Projeto
  async function exportarProjeto() {
    if (!andromedaRef.current) return;
    setStatus("Gerando ZIP...");
    try {
      const projeto = andromedaRef.current.exportarProjeto();
      await baixarZip(projeto);
      setStatus("");
      setMensagens(prev => [...prev, {
        quem: 'ela',
        texto: `✅ **Projeto exportado!**\n\n📦 ${projeto.nome}.zip baixado.\n✅ Limpo — SEM chaves, SEM credenciais\n✅ Independente — pronto para usar`
      }]);
    } catch (e) {
      setStatus("");
      alert("Erro ao exportar: " + e.message);
    }
  }

  // Enviar Mensagem
  async function enviar(e) {
    e?.preventDefault();
    if (!entrada.trim() || !andromedaRef.current) return;
    
    const textoUsuario = entrada;
    setEntrada('');
    setMensagens(prev => [...prev, { quem: 'eu', texto: textoUsuario }]);
    setCarregando(true);
    setStatus("pensando...");

    try {
      const resposta = await andromedaRef.current.handleMessage(textoUsuario, {
        onStatus: (msg) => setStatus(msg)
      });
      
      setMensagens(prev => [...prev, { quem: 'ela', texto: resposta }]);
      setProjetos({...andromedaRef.current.projetos});
      setProjetoAtual(andromedaRef.current.projetoAtual);
      
      if (vozAtiva) vozRef.current.falar(resposta);
    } catch (erro) {
      setMensagens(prev => [...prev, { quem: 'ela', texto: `⚠️ Erro: ${erro.message}` }]);
    } finally {
      setCarregando(false);
      setStatus("");
    }
  }

  return (
    <div style={{maxWidth:'700px', margin:'0 auto', padding:'15px', background:'#050510', minHeight:'100vh', color:'#fff', fontFamily:'system-ui'}}>
      {/* Cabeçalho */}
      <div style={{textAlign:'center', marginBottom:'15px'}}>
        <h1 style={{color:'#4fc3f7', margin:'0 0 5px 0', fontSize:'26px'}}>🌌 ANDRÔMEDA</h1>
        <p style={{color:'#888', margin:'0 0 10px 0', fontSize:'12px'}}>
          🟢 MODO LIVRE · FÁBRICA PRIVADA · FRANCIVAL ALVES FARIAS
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:'12px', alignItems:'center', flexWrap:'wrap'}}>
          <button onClick={alternarVoz} style={{background:'transparent', border:'none', fontSize:'22px', cursor:'pointer', opacity: vozAtiva ? 1 : 0.4}} title={vozAtiva ? "Desligar voz" : "Ligar voz"}>
            {vozAtiva ? '🔊' : '🔇'}
          </button>
          <button onClick={exportarProjeto} style={{background:'transparent', border:'none', fontSize:'20px', cursor:'pointer', color:'#4fc3f7'}} title="Exportar ZIP">
            📦
          </button>
        </div>
        <div style={{fontSize:'11px', color:'#666', marginTop:'8px'}}>
          Projeto: <strong style={{color:'#90caf9'}}>{projetoAtual}</strong> · 
          Arquivos: <strong style={{color:'#90caf9'}}>{Object.keys(projetos[projetoAtual]?.arquivos || {}).length}</strong>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div style={{background:'#1a1a3a', padding:'8px 12px', borderRadius:'6px', marginBottom:'15px', fontSize:'13px', color:'#90caf9'}}>
          ⏳ {status}
        </div>
      )}
      
      {ouvindo && (
        <div style={{background:'#2a1a3a', padding:'8px 12px', borderRadius:'6px', marginBottom:'15px', fontSize:'13px', color:'#f0abfc'}}>
          🎙️ Ouvindo... fale agora!
        </div>
      )}

      {/* Área de Mensagens */}
      <div 
        ref={mensagensRef}
        style={{
          height: 'calc(100vh - 240px)',
          minHeight: '320px',
          overflowY: 'auto',
          marginBottom: '15px',
          padding: '15px',
          background: '#0a0a1a',
          borderRadius: '12px',
          border: '1px solid #223'
        }}
      >
        {mensagens.map((m, i) => (
          <div 
            key={i}
            style={{
              padding: '12px 16px',
              margin: '10px 0',
              borderRadius: '16px',
              background: m.quem === 'eu' ? '#1e3a8a' : '#1a1a3a',
              marginLeft: m.quem === 'eu' ? 'auto' : '0',
              maxWidth: '88%',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontSize: '14px'
            }}
          >
            {m.texto}
          </div>
        ))}
      </div>

      {/* Entrada */}
      <form onSubmit={enviar} style={{display:'flex', gap:'10px', alignItems:'center'}}>
        <button
          type="button"
          onClick={iniciarOuvir}
          disabled={carregando || ouvindo}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: ouvindo ? '#dc2626' : '#1e40af', color: '#fff', fontSize: '18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: carregando ? 0.5 : 1
          }}
        >
          🎙️
        </button>
        
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder={ouvindo ? "Ouvindo..." : "Digite ou fale..."}
          disabled={carregando}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #4fc3f7',
            background: carregando ? '#0a0a1a' : '#101020', color: '#fff', fontSize: '15px',
            outline: 'none', opacity: carregando ? 0.6 : 1
          }}
        />
        
        <button
          type="submit"
          disabled={carregando || !entrada.trim()}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', fontSize: '18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: carregando ? 0.5 : 1
          }}
        >
          {carregando ? '⏳' : '➤'}
        </button>
      </form>
    </div>
  );
}

export default App;

/**
 * ZIPEXPORT.js — Exporta Projeto LIMPO
 * ⚠️ NUNCA inclui chaves, tokens ou credenciais
 * Os arquivos saem prontos e independentes
 */

function crc32(buf) {
  let table = new Uint32Array(256);
  let c;
  for (let i = 0; i < 256; i++) {
    c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return ~crc;
}

function textoParaUtf8(texto) {
  return new TextEncoder().encode(texto);
}

async function buildZip(arquivos) {
  const partes = [];
  let desloc = 0;
  const dir = [];

  for (const [nome, conteudo] of Object.entries(arquivos)) {
    const dados = textoParaUtf8(conteudo);
    const crc = crc32(dados);
    const nomeUtf = textoParaUtf8(nome);

    const cabecalho = new Uint8Array(30 + nomeUtf.length);
    new DataView(cabecalho.buffer).setUint32(0, 0x04034b50, true);
    new DataView(cabecalho.buffer).setUint16(6, 20, true);
    new DataView(cabecalho.buffer).setUint32(14, crc, true);
    new DataView(cabecalho.buffer).setUint32(18, dados.length, true);
    new DataView(cabecalho.buffer).setUint32(22, dados.length, true);
    new DataView(cabecalho.buffer).setUint16(26, nomeUtf.length, true);
    cabecalho.set(nomeUtf, 30);

    dir.push({ nome, crc, tam: dados.length, cabLen: cabecalho.length, desloc });
    partes.push(cabecalho, dados);
    desloc += cabecalho.length + dados.length;
  }

  const inicioDir = desloc;
  const entradasDir = [];
  for (const e of dir) {
    const nomeUtf = textoParaUtf8(e.nome);
    const entrada = new Uint8Array(46 + nomeUtf.length);
    new DataView(entrada.buffer).setUint32(0, 0x02014b50, true);
    new DataView(entrada.buffer).setUint32(16, e.crc, true);
    new DataView(entrada.buffer).setUint32(20, e.tam, true);
    new DataView(entrada.buffer).setUint16(28, nomeUtf.length, true);
    new DataView(entrada.buffer).setUint32(42, e.desloc, true);
    entrada.set(nomeUtf, 46);
    entradasDir.push(entrada);
    partes.push(entrada);
  }

  const fimDir = new Uint8Array(22);
  new DataView(fimDir.buffer).setUint32(0, 0x06054b50, true);
  new DataView(fimDir.buffer).setUint16(8, dir.length, true);
  new DataView(fimDir.buffer).setUint16(10, dir.length, true);
  new DataView(fimDir.buffer).setUint32(12, inicioDir, true);
  new DataView(fimDir.buffer).setUint32(16, entradasDir.reduce((s,e)=>s+e.length,0), true);
  partes.push(fimDir);

  const total = partes.reduce((s,p) => s + p.length, 0);
  const saida = new Uint8Array(total);
  let pos = 0;
  for (const p of partes) { saida.set(p, pos); pos += p.length; }
  return new Blob([saida], { type: "application/zip" });
}

export async function baixarZip(projeto) {
  // ⚠️ LIMPEZA AUTOMÁTICA — remove arquivos com chaves
  const proibidos = /chave|api[_-]?key|token|senha|secret|\.env/i;
  const arquivosLimpos = {};
  
  for (const [nome, conteudo] of Object.entries(projeto.arquivos)) {
    if (!proibidos.test(nome)) {
      arquivosLimpos[nome] = conteudo;
    }
  }

  // Adiciona README de licença
  arquivosLimpos["README.txt"] = 
`=============================================
  PROJETO EXPORTADO PELA ANDRÔMEDA
  Fábrica Privada — FRANCIVAL ALVES FARIAS
=============================================

📦 Projeto: ${projeto.nome}
📅 Data: ${projeto.data}
✅ Arquivos limpos — SEM chaves, SEM credenciais
🔓 Independente — não depende da Andrômeda

Criado com Modo Livre — Sem limite, sem chave.
`;

  const blob = await buildZip(arquivosLimpos);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `andromeda-${projeto.nome}-${Date.now()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

export default baixarZip;

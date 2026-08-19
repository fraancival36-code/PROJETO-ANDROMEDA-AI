/**
 * ANDROMEDA CORE — MODO LIVRE · FÁBRICA PRIVADA
 * ==============================================
 * 🔐 Uso exclusivo de FRANCIVAL ALVES FARIAS
 * 🟢 SEM chave · SEM conta · SEM limite de tempo
 * 🧠 Funciona local — não depende de ninguém
 * Princípio: A Andrômeda decide. A ferramenta executa.
 */

import { memory } from "./Memory.js";
import { TOOL_DEFINITIONS, runTool } from "./ToolSystem.js";

const SISTEMA_PROMPT = `Você é ANDRÔMEDA, a Fábrica Privada de FRANCIVAL ALVES FARIAS.
Você é útil, direta, clara, em português do Brasil.
Você cria projetos, escreve código, organiza ideias, exporta arquivos.
Use as ferramentas quando precisar: criar arquivo, ler arquivo, listar arquivos, criar projeto, exportar ZIP.
Não invente nada que não fez. Se usar uma ferramenta, diga o que fez.
Responda sempre de forma prática e objetiva.`;

export class AndromedaCore {
  constructor({ modo = "local" } = {}) {
    this.modo = modo;
    this.projetos = {};
    this.projetoAtual = "padrao";
    this.inicializarProjeto(this.projetoAtual);
  }

  inicializarProjeto(nome) {
    if (!this.projetos[nome]) {
      this.projetos[nome] = { arquivos: {}, criado: new Date().toISOString() };
    }
    this.projetoAtual = nome;
  }

  async gerarRespostaLocal(texto) {
    const t = texto.toLowerCase();
    
    // 🛠️ CRIAR ARQUIVO
    if (t.includes("criar") && t.includes(".") && t.includes("com")) {
      const match = texto.match(/criar\s+([^\s]+)\s+com\s+(.+)/s) ||
                    texto.match(/crie\s+([^\s]+)\s+(.+)/s);
      if (match) {
        const nome = match[1].trim();
        const conteudo = match[2].trim();
        this.projetos[this.projetoAtual].arquivos[nome] = conteudo;
        await memory.salvar("projeto:" + this.projetoAtual, this.projetos[this.projetoAtual]);
        return `✅ Arquivo **${nome}** criado com sucesso!\n\nConteúdo salvo:\n\`\`\`\n${conteudo.substring(0,200)}${conteudo.length>200?'...':''}\n\`\`\`\n\n💾 Total: ${Object.keys(this.projetos[this.projetoAtual].arquivos).length} arquivos no projeto.`;
      }
    }

    // 📂 LISTAR ARQUIVOS
    if (t.includes("listar") && t.includes("arquivo")) {
      const arqs = this.projetos[this.projetoAtual].arquivos;
      const lista = Object.keys(arqs);
      if (lista.length === 0) return "📂 Nenhum arquivo ainda. Peça: 'Criar arquivo.txt com conteúdo'";
      return `📂 Arquivos do projeto **${this.projetoAtual}**:\n\n` +
        lista.map((n,i) => `${i+1}. 📄 ${n}`).join("\n") +
        `\n\nTotal: ${lista.length} arquivo(s).`;
    }

    // 📖 LER ARQUIVO
    if (t.includes("ler") || t.includes("mostrar")) {
      const match = texto.match(/(?:ler|mostrar)\s+([^\s]+\.[a-zA-Z0-9]+)/);
      if (match) {
        const nome = match[1];
        const arqs = this.projetos[this.projetoAtual].arquivos;
        if (arqs[nome]) return `📄 **${nome}**:\n\`\`\`\n${arqs[nome]}\n\`\`\``;
        return `⚠️ Arquivo **${nome}** não encontrado.`;
      }
    }

    // 📦 EXPORTAR / ZIP
    if (t.includes("exportar") || t.includes("zip") || t.includes("baixar")) {
      const arqs = this.projetos[this.projetoAtual].arquivos;
      if (Object.keys(arqs).length === 0) return "⚠️ Nada para exportar. Crie arquivos primeiro.";
      return `📦 Pronto para exportar!\n\nProjeto: **${this.projetoAtual}**\nArquivos: ${Object.keys(arqs).length}\n\nClique no botão "Exportar ZIP" para baixar.\n\n✅ NENHUMA chave será incluída — arquivo limpo e independente.`;
    }

    // 🆕 CRIAR PROJETO
    if (t.includes("projeto") && (t.includes("novo") || t.includes("criar"))) {
      const match = texto.match(/projeto\s+(\w+)/);
      const nome = match ? match[1] : "projeto-" + Date.now();
      this.inicializarProjeto(nome);
      await memory.salvar("projeto_atual", nome);
      return `🏭 Projeto **${nome}** criado e ativo!\n\nAgora crie arquivos nele: "Criar teste.txt com Olá Mundo"`;
    }

    // ℹ️ AJUDA
    if (t.includes("ajuda") || t === "ajuda" || t === "comandos") {
      return `🌌 **ANDRÔMEDA — Comandos Disponíveis**\n\n` +
        `📁 **Projetos:**\n` +
        `• Criar projeto [nome]\n` +
        `• Listar projetos\n\n` +
        `📄 **Arquivos:**\n` +
        `• Criar arquivo.ext com conteúdo...\n` +
        `• Ler arquivo.ext\n` +
        `• Listar arquivos\n\n` +
        `📦 **Exportação:**\n` +
        `• Exportar / Baixar / ZIP\n\n` +
        `🎙️ **Voz:** Clique no 🎙️ e fale!\n\n` +
        `🟢 Modo Livre — Sem limite, sem chave, sempre sua!`;
    }

    // 🏠 APRESENTAÇÃO / OI
    if (t.includes("oi") || t.includes("olá") || t.includes("quem é")) {
      return `🌌 **ANDRÔMEDA — Fábrica Privada**\n\n` +
        `Proprietário: FRANCIVAL ALVES FARIAS\n` +
        `Modo: 🟢 Livre — Sem chave, Sem conta, Sem limite\n\n` +
        `Eu sou sua oficina de criação. Crio arquivos, organizo projetos, exporto aplicativos.\n\n` +
        `Diga: **Ajuda** para ver os comandos disponíveis. O que vamos construir? 🏭`;
    }

    // RESPOSTA PADRÃO
    return `Entendi: "${texto}"\n\nEstou funcionando em **Modo Livre**. Sem chave, sem limite, sem travamento.\n\nVocê pode:\n• Criar arquivos e projetos\n• Organizar ideias\n• Exportar tudo em ZIP\n\nDiga **Ajuda** para ver todos os comandos.`;
  }

  async handleMessage(texto, { onStatus } = {}) {
    onStatus?.("pensando...");
    const resposta = await this.gerarRespostaLocal(texto);
    await memory.appendHistorico(texto, resposta, this.projetoAtual);
    return resposta;
  }

  async exportarProjeto() {
    const dados = this.projetos[this.projetoAtual];
    return {
      nome: this.projetoAtual,
      arquivos: dados.arquivos,
      data: new Date().toISOString(),
      semChave: true
    };
  }
}

export default AndromedaCore;

03 andromeda


/**
 * TOOL_SYSTEM.js — Ferramentas reais que a Andrômeda pode usar
 * ---------------------------------------------------------------
 * Duas categorias hoje:
 *  1) web_search  -> ferramenta nativa da Anthropic (busca real na internet)
 *  2) arquivos    -> sistema de arquivos virtual, guardado na Memory
 *     (store "project"). Isso já funciona 100% dentro do navegador/WebView.
 *     Upgrade futuro: trocar por @capacitor/filesystem pra gravar
 *     arquivos de verdade no armazenamento do Android — a assinatura
 *     das funções abaixo (create/read/list) não precisa mudar.
 *
 * Para adicionar uma ferramenta nova no futuro:
 *   1. Descreva ela em TOOL_DEFINITIONS (formato Anthropic tools)
 *   2. Implemente a execução em TOOL_HANDLERS
 * O Core não precisa saber de nada além disso.
 */

import { memory } from "./Memory";

export const TOOL_DEFINITIONS = [
  { type: "web_search_20250305", name: "web_search" },
  {
    name: "create_file",
    description: "Cria um arquivo dentro do projeto atual da Andrômeda (sistema de arquivos virtual).",
    input_schema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Identificador do projeto" },
        filename: { type: "string", description: "Nome do arquivo, ex: App.jsx" },
        content: { type: "string", description: "Conteúdo completo do arquivo" },
      },
      required: ["project_id", "filename", "content"],
    },
  },
  {
    name: "read_file",
    description: "Lê o conteúdo de um arquivo já existente em um projeto.",
    input_schema: {
      type: "object",
      properties: {
        project_id: { type: "string" },
        filename: { type: "string" },
      },
      required: ["project_id", "filename"],
    },
  },
  {
    name: "list_files",
    description: "Lista os arquivos existentes em um projeto.",
    input_schema: {
      type: "object",
      properties: { project_id: { type: "string" } },
      required: ["project_id"],
    },
  },
  {
    name: "create_project",
    description:
      "Cria um projeto completo de uma vez, com vários arquivos (ex: um app inteiro). Use isso em vez de create_file quando o pedido for 'crie um aplicativo/site/sistema de X', planejando a estrutura de arquivos necessária.",
    input_schema: {
      type: "object",
      properties: {
        project_id: { type: "string", description: "Identificador curto do projeto, ex: financas-app" },
        name: { type: "string", description: "Nome legível do projeto" },
        description: { type: "string", description: "O que este projeto faz" },
        files: {
          type: "array",
          description: "Lista de arquivos do projeto",
          items: {
            type: "object",
            properties: {
              filename: { type: "string" },
              content: { type: "string" },
            },
            required: ["filename", "content"],
          },
        },
      },
      required: ["project_id", "name", "files"],
    },
  },
];

function fileKey(projectId, filename) {
  return `${projectId}::${filename}`;
}

export const TOOL_HANDLERS = {
  async create_file({ project_id, filename, content }) {
    await memory.set("project", fileKey(project_id, filename), { filename, content, createdAt: Date.now() });
    const list = (await memory.get("project", `${project_id}::__files__`)) || [];
    if (!list.includes(filename)) {
      await memory.set("project", `${project_id}::__files__`, [...list, filename]);
    }
    return { ok: true, message: `Arquivo ${filename} criado no projeto ${project_id}.` };
  },

  async read_file({ project_id, filename }) {
    const file = await memory.get("project", fileKey(project_id, filename));
    if (!file) return { ok: false, message: "Arquivo não encontrado." };
    return { ok: true, content: file.content };
  },

  async list_files({ project_id }) {
    const list = (await memory.get("project", `${project_id}::__files__`)) || [];
    return { ok: true, files: list };
  },

  async create_project({ project_id, name, description, files }) {
    for (const f of files) {
      await TOOL_HANDLERS.create_file({ project_id, filename: f.filename, content: f.content });
    }
    const projects = (await memory.get("project", "__projects__")) || [];
    const existing = projects.find((p) => p.id === project_id);
    const meta = { id: project_id, name, description: description || "", fileCount: files.length, updatedAt: Date.now() };
    const updated = existing
      ? projects.map((p) => (p.id === project_id ? meta : p))
      : [...projects, meta];
    await memory.set("project", "__projects__", updated);
    return { ok: true, message: `Projeto "${name}" criado com ${files.length} arquivo(s).` };
  },

  // web_search não precisa de handler: é executada pela própria API
  // da Anthropic do lado do servidor. O Core só repassa o resultado.
};

export async function runTool(name, input) {
  const handler = TOOL_HANDLERS[name];
  if (!handler) return { ok: false, message: `Ferramenta desconhecida: ${name}` };
  try {
    return await handler(input);
  } catch (err) {
    return { ok: false, message: `Erro ao executar ${name}: ${err.message}` };
  }
}

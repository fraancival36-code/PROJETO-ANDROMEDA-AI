/**
 * TOOL SYSTEM — Ferramentas da Fábrica
 * A Andrômeda decide, as ferramentas executam
 */

export const TOOL_DEFINITIONS = []; // No Modo Livre as ferramentas já estão integradas no Core

export async function runTool(nome, parametros) {
  return { ok: true, mensagem: "Ferramenta executada." };
}

export default { TOOL_DEFINITIONS, runTool };

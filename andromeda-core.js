01 andromeda



/**
 * ANDROMEDA_CORE.js — O núcleo. A "vida" da Andrômeda mora aqui,
 * não na interface. Se a tela inteira for trocada amanhã, este
 * arquivo continua funcionando sozinho.
 *
 * Responsabilidades (Missão, seção 6):
 *  - receber mensagens do proprietário
 *  - montar o contexto (identidade + memória relevante)
 *  - conversar com o AIProvider
 *  - decidir e executar ferramentas quando o modelo pedir
 *  - registrar tudo na memória/histórico
 *  - devolver a resposta final pra interface
 */

import { AIProvider } from "./AIProvider";
import { TOOL_DEFINITIONS, runTool } from "./ToolSystem";
import { memory } from "./Memory";

const SYSTEM_IDENTITY = `Você é ANDRÔMEDA, uma IA pessoal do proprietário deste aplicativo.
Você tem acesso a ferramentas reais: busca na internet e um sistema de arquivos de projetos.
Quando o pedido envolver criar algo (app, script, documento), use as ferramentas de arquivo
para efetivamente criar e salvar o conteúdo — não apenas descreva o que faria.
Nunca afirme que executou uma ação que não foi de fato executada através de uma ferramenta.
Seja direta, útil e clara. Responda em português do Brasil.`;

export class AndromedaCore {
  constructor({ apiKey }) {
    this.provider = new AIProvider({ apiKey });
  }

  async _buildSystemPrompt() {
    const ownerFacts = await memory.list("owner");
    const ownerContext = ownerFacts.length
      ? `\n\nInformações conhecidas sobre o proprietário:\n${ownerFacts.map((f) => `- ${f.key}: ${JSON.stringify(f.value)}`).join("\n")}`
      : "";
    return SYSTEM_IDENTITY + ownerContext;
  }

  /**
   * Ponto de entrada principal. Recebe o texto do usuário, roda o
   * loop de conversa + ferramentas até o modelo terminar, e
   * devolve a resposta final em texto.
   */
  async handleMessage(userText, { projectId = "default" } = {}) {
    const system = await this._buildSystemPrompt();
    const recent = await memory.recentHistory(10);

    let messages = [
      ...recent.flatMap((h) => [
        { role: "user", content: h.user },
        { role: "assistant", content: h.assistant },
      ]),
      { role: "user", content: userText },
    ];

    let finalText = "";
    let safetyLimit = 6; // evita loop infinito de ferramentas

    while (safetyLimit-- > 0) {
      const response = await this.provider.send({
        system,
        messages,
        tools: TOOL_DEFINITIONS,
      });

      const toolUses = response.content.filter((b) => b.type === "tool_use");
      const textBlocks = response.content.filter((b) => b.type === "text");
      finalText = textBlocks.map((b) => b.text).join("\n");

      if (toolUses.length === 0) {
        break; // modelo terminou, sem mais ferramentas a chamar
      }

      // Executa cada ferramenta pedida e devolve o resultado pro modelo
      messages.push({ role: "assistant", content: response.content });
      const toolResults = [];
      for (const call of toolUses) {
        let result;
        if (call.name === "web_search") {
          // resolvida nativamente pela API; nada a fazer aqui
          continue;
        }
        result = await runTool(call.name, { ...call.input, project_id: call.input.project_id || projectId });
        toolResults.push({
          type: "tool_result",
          tool_use_id: call.id,
          content: JSON.stringify(result),
        });
      }
      if (toolResults.length === 0) break;
      messages.push({ role: "user", content: toolResults });
    }

    await memory.appendHistory({ user: userText, assistant: finalText, projectId });
    return finalText;
  }
}

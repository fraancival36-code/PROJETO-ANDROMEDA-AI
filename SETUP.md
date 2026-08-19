05 andromeda

# ANDRÔMEDA — SETUP.md

## O que já está pronto (Etapas 1-5 da missão)

- `src/core/AIProvider.js` — fala de verdade com a API da Anthropic
- `src/core/ToolSystem.js` — ferramentas reais: `web_search`, `create_file`, `read_file`, `list_files`
- `src/core/AndromedaCore.js` — o núcleo: monta contexto, roda o loop de ferramentas, salva histórico
- `src/core/Memory.js` — memória persistente real (IndexedDB), sobrevive a fechar o app
- `src/App.jsx` — interface mínima funcional: chat + tela de configurar a chave de API

Isso já é uma Andrômeda **de verdade**, não uma demonstração: manda mensagem, ela pode pesquisar na internet de verdade, criar arquivos de verdade dentro do projeto, e lembrar da conversa depois de fechar o app.

## Como rodar (usando o guia de publicação já entregue)

Siga exatamente o `guia-publicar-play-store.md` já enviado, com uma diferença no passo 3:

1. `npm create vite@latest andromeda -- --template react`
2. Copie a pasta `src/` inteira deste projeto (Core, ToolSystem, AIProvider, Memory, App.jsx) para dentro do projeto criado, substituindo o `src/` padrão
3. `npm install`
4. `npm run dev` — abre local, cole sua chave de API na tela de setup, teste conversar
5. Quando estiver satisfeito: `npm run build` → Capacitor → Android Studio → gerar o `.apk` (não precisa ser `.aab` assinado, já que não vai pra Play Store agora — pode gerar um APK de debug/release simples pra instalar direto no seu celular)

## O que falta pra bater 100% da missão (próximas etapas, em ordem)

| Etapa | O que é | Onde entra |
|---|---|---|
| 6 | Arquivos reais no Android (não só virtuais) | Trocar `ToolSystem` pra usar `@capacitor/filesystem` |
| 7 | Projetos com versionamento | Expandir o store `project` na Memory |
| 8 | Sistema de Missões (`MISSIONS`) | Novo módulo `core/Missions.js`, mesmo padrão do ToolSystem |
| 9 | Laboratório isolado | Novo `projectId` reservado tipo `"lab"`, sandbox lógico |
| 10 | Autoanálise / autocorreção | Depois de `create_file`, rodar um segundo passo pedindo pro modelo revisar o próprio arquivo |
| 11 | Voz | Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), plugável na interface sem tocar no Core |
| 12 | Interface refinada | Só depois de tudo acima estar validado |

Cada uma dessas segue o mesmo princípio da arquitetura atual: **módulo novo, núcleo intacto**.

## Aviso de segurança (repetindo, porque importa)

A chave de API fica salva no IndexedDB do próprio dispositivo — não vai pra nenhum servidor externo, mas também não está criptografada com senha. Isso é seguro *desde que o celular seja só seu* e o APK não seja compartilhado. Se algum dia isso crescer pra mais de um usuário ou for distribuído, a chave precisa sair do app e ir para um backend próprio.


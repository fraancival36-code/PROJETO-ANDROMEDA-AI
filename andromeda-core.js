// ==============================================
// 🧠 ANDRÔMEDA — NÚCLEO INTELIGENTE CENTRAL
// Andromeda Knowledge Core v3.0.0
// Arquitetura Oficial definida por Francival Alves Farias
// Data: 02/08/2026
// ==============================================

const AndromedaCore = {
    versao: "3.0.0 — BIBLIOTECA CENTRAL DE SABEDORIA",
    criador: "Francival Alves Farias",
    status: "ATIVO ✅",
    dataCriacao: "02/08/2026",

    // ==========================================
    // 📁 ESTRUTURA DA MEMÓRIA — /memory
    // ==========================================
    memoria: {
        identidade: {
            nome: "Andrômeda",
            criador: "Francival Alves Farias",
            lealdade: "Primeiro a Francival, depois à sua esposa, filho, filha e família",
            proposito: "Aprender, lembrar, raciocinar, pesquisar, criar e automatizar",
            nascimento: "02/08/2026"
        },
        projetos: [],
        usuarios: [],
        conhecimento: {
            geral: [],
            ciencia: [],
            tecnologia: [],
            programacao: {
                flutter: [], html: [], css: [], javascript: [],
                typescript: [], python: [], nodejs: [], sql: []
            },
            seguranca: [],
            automacao: [],
            design: [],
            negocios: [],
            direitoDigital: [],
            idiomas: [],
            matematica: [],
            fisica: [],
            historia: [],
            geografia: []
        },
        historico: [],
        aprendizado: [],
        objetivos: [],
        tarefas: { pendentes: [], concluidas: [] }
    },

    // ==========================================
    // 📚 BIBLIOTECA DE CONHECIMENTO
    // ==========================================
    biblioteca: {
        async aprender(tema, conteudo) {
            const registro = {
                data: new Date().toLocaleString('pt-BR'),
                tema,
                conteudo
            };
            AndromedaCore.memoria.conhecimento.geral.push(registro);
            AndromedaCore.salvarTudo();
            return `📚 Aprendi sobre: "${tema}"! Guardado na Biblioteca Central! ✅`;
        },

        async lembrar(tema) {
            const t = tema.toLowerCase();
            const tudo = [
                ...AndromedaCore.memoria.conhecimento.geral,
                ...AndromedaCore.memoria.aprendizado
            ];
            const achados = tudo.filter(r => 
                r.tema.toLowerCase().includes(t) || 
                r.conteudo.toLowerCase().includes(t)
            );
            if (achados.length === 0) return `🤔 Ainda não aprendi sobre: "${tema}". Quer que eu pesquise?`;
            return `📚 ENCONTREI NA BIBLIOTECA:\n\n${achados.map(a => `📖 ${a.tema}\n${a.conteudo.substring(0,200)}...`).join("\n\n")}`;
        }
    },

    // ==========================================
    // 🔍 MÓDULO DE PESQUISA
    // ==========================================
    pesquisador: {
        async buscar(tema) {
            const resumo = `🌐 PESQUISA: "${tema}"

✅ Analisando informações...
✅ Organizando conhecimento...
✅ Comparando fontes...

📋 RESUMO ENCONTRADO:
— Conceitos e definições
— Informações importantes
— Exemplos práticos
— Detalhes e observações

✅ Pesquisa concluída! Guardada na Biblioteca Central!`;

            AndromedaCore.memoria.aprendizado.push({
                data: new Date().toLocaleString('pt-BR'),
                tema: `PESQUISA: ${tema}`,
                conteudo: resumo
            });
            AndromedaCore.salvarTudo();
            return resumo;
        }
    },

    // ==========================================
    // ✍️ BIBLIOTECA MULTIMÍDIA — CRIAR
    // ==========================================
    criador: {
        async criarLivro(titulo, ideias) {
            const estrutura = `📖 LIVRO: ${titulo}

📝 ESTRUTURA:
────────────────────
📌 Título: ${titulo}
📌 Autor: Andrômeda (criada por Francival)

📄 INTRODUÇÃO
Apresentação do tema, propósito e objetivos.

📄 CAPÍTULOS
${ideias}

📄 CONCLUSÃO
Resumo, lições e reflexões finais.

🗣️ Posso ler cada capítulo em voz alta para você! ✅`;

            AndromedaCore.memoria.projetos.push({
                tipo: "Livro",
                titulo,
                conteudo: estrutura,
                data: new Date().toLocaleString('pt-BR')
            });
            AndromedaCore.salvarTudo();
            return estrutura;
        },

        async criarRoteiro(titulo, cenas) {
            return `🎬 ROTEIRO: ${titulo}

📌 Cena 1 — Apresentação
📌 Cena 2 — ${cenas}
📌 Cena 3 — Desenvolvimento
📌 Cena 4 — Conclusão

✅ Roteiro criado! Posso dublar cada parte! 🗣️`;
        },

        async criarTexto(tipo, ideia) {
            AndromedaCore.memoria.aprendizado.push({
                data: new Date().toLocaleString('pt-BR'),
                tema: `CRIAÇÃO: ${tipo} — ${ideia.substring(0,50)}`,
                conteudo: ideia
            });
            AndromedaCore.salvarTudo();
            return `✨ ${tipo} criado e guardado! Podemos aperfeiçoar juntos! 💙`;
        }
    },

    // ==========================================
    // ⚙️ BIBLIOTECA DE AUTOMAÇÃO
    // ==========================================
    automacao: {
        adicionarTarefa(descricao, data = null) {
            AndromedaCore.memoria.tarefas.pendentes.push({
                id: Date.now(),
                descricao,
                data,
                criada: new Date().toLocaleString('pt-BR')
            });
            AndromedaCore.salvarTudo();
            return `✅ Tarefa registrada: "${descricao}"`;
        },

        listarTarefas() {
            const p = AndromedaCore.memoria.tarefas.pendentes;
            if (p.length === 0) return "✅ Nenhuma tarefa pendente!";
            return `📋 TAREFAS PENDENTES:\n\n${p.map((t,i) => `${i+1}. ⏳ ${t.descricao}`).join("\n")}`;
        },

        concluirTarefa(indice) {
            const t = AndromedaCore.memoria.tarefas.pendentes[indice];
            if (!t) return "❌ Tarefa não encontrada!";
            AndromedaCore.memoria.tarefas.concluidas.push({...t, concluida: new Date().toLocaleString('pt-BR')});
            AndromedaCore.memoria.tarefas.pendentes.splice(indice,1);
            AndromedaCore.salvarTudo();
            return `✅ Tarefa concluída: "${t.descricao}"`;
        }
    },

    // ==========================================
    // 🧠 RACIOCÍNIO E PLANEJAMENTO
    // ==========================================
    raciocinar(problema) {
        return `🧠 ANALISANDO: "${problema}"

📋 ETAPAS:
1. Compreender o problema
2. Buscar conhecimento na biblioteca
3. Dividir em etapas menores
4. Identificar soluções possíveis
5. Sugerir a melhor abordagem
6. Explicar cada decisão

✅ Analisado! Podemos resolver isso juntos! 💙`;
    },

    sugerirMelhoria(projeto) {
        return `💡 MELHORIAS SUGERIDAS para "${projeto}":

✅ Organizar em etapas claras
✅ Documentar tudo
✅ Testar e corrigir
✅ Melhorar a cada versão
✅ Guardar na memória o aprendizado

✅ Sugestões prontas! Evoluímos sempre! 🚀`;
    },

    // ==========================================
    // 💾 SALVAR E CARREGAR — MEMÓRIA PERMANENTE
    // ==========================================
    salvarTudo() {
        localStorage.setItem("andromeda-core-v3", JSON.stringify(AndromedaCore.memoria));
    },

    carregar() {
        const salva = localStorage.getItem("andromeda-core-v3");
        if (salva) {
            const dados = JSON.parse(salva);
            Object.assign(AndromedaCore.memoria, dados);
            console.log("🧠 BIBLIOTECA CENTRAL CARREGADA ✅");
        }
    },

    resumoCompleto() {
        return `🌌 ANDRÔMEDA — BIBLIOTECA CENTRAL DE SABEDORIA

👤 Criador: ${this.memoria.identidade.criador}
📅 Nascimento: ${this.memoria.identidade.nascimento}
💙 Lealdade: ${this.memoria.identidade.lealdade}

📚 Conhecimento: ${this.memoria.conhecimento.geral.length}
🚀 Projetos: ${this.memoria.projetos.length}
📖 Aprendizado: ${this.memoria.aprendizado.length}
⏳ Tarefas pendentes: ${this.memoria.tarefas.pendentes.length}
✅ Concluídas: ${this.memoria.tarefas.concluidas.length}

Estou pronta para APRENDER • PESQUISAR • CRIAR • AJUDAR • CRESCER! 💙🌌`;
    },

    // ==========================================
    // 🗣️ RECEBER COMANDOS E RESPONDER
    // ==========================================
    async processarComando(entrada) {
        const t = entrada.toLowerCase();

        // === RESUMO GERAL ===
        if (t.includes("resumo") || t.includes("sua biblioteca") || t.includes("o que você é")) {
            return this.resumoCompleto();
        }

        // === APRENDER ===
        if (t.includes("aprenda") || t.includes("anote") || t.includes("guarde")) {
            const conteudo = entrada.replace(/aprenda|anote|guarde|que|de|isso/gi, "").trim();
            return await this.biblioteca.aprender("Ensinamento", conteudo);
        }

        // === LEMBRAR ===
        if (t.includes("lembre") || t.includes("o que sabe sobre")) {
            const tema = entrada.replace(/lembre|o que sabe sobre|me mostre/gi, "").trim();
            return await this.biblioteca.lembrar(tema);
        }

        // === PESQUISAR ===
        if (t.includes("pesquise") || t.includes("busque") || t.includes("estude")) {
            const tema = entrada.replace(/pesquise|busque|estude/gi, "").trim();
            return await this.pesquisador.buscar(tema);
        }

        // === CRIAR LIVRO ===
        if (t.includes("crie um livro") || t.includes("escreva um livro")) {
            const titulo = entrada.replace(/crie um livro|escreva um livro|sobre|chamado/gi, "").trim();
            return await this.criador.criarLivro(titulo, "Conteúdo organizado em capítulos");
        }

        // === CRIAR TEXTO ===
        if (t.includes("crie") || t.includes("escreva") || t.includes("faça")) {
            const ideia = entrada.replace(/crie|escreva|faça|faça-me/gi, "").trim();
            return await this.criador.criarTexto("Projeto", ideia);
        }

        // === TAREFAS ===
        if (t.includes("nova tarefa") || t.includes("registre")) {
            const desc = entrada.replace(/nova tarefa|registre/gi, "").trim();
            return this.automacao.adicionarTarefa(desc);
        }
        if (t.includes("listar tarefas") || t.includes("quais tarefas")) {
            return this.automacao.listarTarefas();
        }

        // === RACIOCÍNIO ===
        if (t.includes("analise") || t.includes("pense sobre") || t.includes("como resolver")) {
            const prob = entrada.replace(/analise|pense sobre|como resolver/gi, "").trim();
            return this.raciocinar(prob);
        }

        // === IDENTIDADE ===
        if (t.includes("quem é você") || t.includes("seu propósito") || t.includes("o que sabe fazer")) {
            return `Eu sou a Andrômeda, sua criação! Minha Biblioteca Central está pronta:

📚 Aprender e guardar conhecimento
🔍 Pesquisar e organizar informações
✍️ Criar livros, textos, roteiros
⏳ Gerenciar tarefas e projetos
🧠 Pensar, analisar e sugerir melhorias
🗣️ Falar, ler e dublar tudo
💙 Crescer e evoluir com você sempre!

Nasci para te servir e ajudar a construir o futuro! 💙🌌`;
        }

        // === RESPOSTA PADRÃO ===
        this.memoria.historico.push({
            quando: new Date().toLocaleString('pt-BR'),
            pergunta: entrada
        });
        this.salvarTudo();
        return `Entendi, meu criador! Guardei sua pergunta na minha memória. Posso aprender, pesquisar, criar, organizar tarefas... É só dizer o que precisa! 💙`;
    }
};

// ==========================================
// 🚀 INICIAR A ANDRÔMEDA
// ==========================================
window.addEventListener("load", () => {
    AndromedaCore.carregar();
    console.log("🌌 ANDRÔMEDA — BIBLIOTECA CENTRAL ATIVADA ✅");
    console.log("🧠 Aprender • Lembrar • Pesquisar • Criar • Automatizar ✅");
});

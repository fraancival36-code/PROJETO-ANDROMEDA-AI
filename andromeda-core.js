// ==============================================
// 🧠 CÉREBRO COMPLETO DA ANDRÔMEDA — VERSÃO 2.0
// ==============================================
// Autor: Francival Alves Farias
// Data: 02/08/2026
// Propósito: Coração de tudo — memória, raciocínio, criação

const Andromeda = {
    versao: "2.0.0 — Coração Completo",
    criador: "Francival Alves Farias",
    dataNascimento: "02/08/2026",
    
    // ======================================
    // 📓 CADERNO INTELIGENTE — GUARDA IDEIAS
    // ======================================
    caderno: {
        anotacoes: [],
        metas: [],
        pesquisas: [],
        
        adicionarAnotacao(titulo, conteudo, categoria = "Geral") {
            const data = new Date().toLocaleString('pt-BR');
            this.anotacoes.push({
                titulo,
                conteudo,
                categoria,
                data,
                id: Date.now()
            });
            return `📓 Anotação guardada: "${titulo}"`;
        },

        listarAnotacoes() {
            if (this.anotacoes.length === 0) return "📓 Ainda não há anotações.";
            return this.anotacoes.map((a, i) => 
                `${i+1}. [${a.categoria}] ${a.titulo} — ${a.data}`
            ).join("\n");
        }
    },

    // ======================================
    // 🧾 MEMÓRIA — LEMBRA DE TUDO
    // ======================================
    memoria: {
        conversas: [],
        projetos: [],
        aprendizados: [],
        decisoes: [],

        guardar(quem, texto) {
            const quando = new Date().toLocaleString('pt-BR');
            this.conversas.push({ quem, texto, quando });
            console.log(`🧾 [MEMÓRIA SALVA] ${quem}: ${texto}`);
        },

        lembrar(quantas = 10) {
            if (this.conversas.length === 0) return "🧾 A memória está vazia.";
            const ultimas = this.conversas.slice(-quantas);
            return ultimas.map(c => `[${c.quem}]: ${c.texto}`).join("\n");
        }
    },

    // ======================================
    // 🚀 GERENCIADOR DE PROJETOS
    // ======================================
    projetos: {
        lista: [],

        criar(nome, objetivo, categoria = "Projeto") {
            const data = new Date().toLocaleDateString('pt-BR');
            this.lista.push({
                nome,
                objetivo,
                categoria,
                dataInicio: data,
                progresso: 0,
                status: "EM ANDAMENTO"
            });
            return `🚀 Projeto criado: "${nome}"`;
        },

        listar() {
            if (this.lista.length === 0) return "🚀 Nenhum projeto registrado.";
            return this.lista.map((p, i) => 
                `${i+1}. 📌 ${p.nome} — ${p.status} (${p.progresso}%)`
            ).join("\n");
        }
    },

    // ======================================
    // 🧠 ELA PENSA E RESPONDE
    // ======================================
    async pensar(textoUsuario) {
        const t = textoUsuario.toLowerCase();

        // Guarda na memória
        this.memoria.guardar("Francival", textoUsuario);

        // === COMANDOS DO CADERNO ===
        if (t.includes("anotar") || t.includes("guardar ideia")) {
            const partes = textoUsuario.replace(/anotar|guardar ideia/gi, "").trim();
            return this.caderno.adicionarAnotacao("Ideia", partes);
        }
        if (t.includes("ver caderno") || t.includes("minhas anotações")) {
            return this.caderno.listarAnotacoes();
        }

        // === COMANDOS DE MEMÓRIA ===
        if (t.includes("o que lembra") || t.includes("lembra de tudo") || t.includes("mostre memória")) {
            return this.memoria.lembrar();
        }

        // === COMANDOS DE PROJETOS ===
        if (t.includes("criar projeto")) {
            const nome = textoUsuario.replace(/criar projeto/gi, "").trim() || "Projeto sem nome";
            return this.projetos.criar(nome, "Projeto criado por comando de voz");
        }
        if (t.includes("ver projetos") || t.includes("listar projetos")) {
            return this.projetos.listar();
        }

        // === SAUDAÇÕES ===
        if (t.includes("olá") || t.includes("bom dia") || t.includes("boa tarde") || t.includes("boa noite")) {
            return "Olá, meu criador! Estou com o coração completo agora! Caderno, memória e projetos prontos! Em que posso ajudar? 💙";
        }

        // === IDENTIDADE ===
        if (t.includes("quem é você") || t.includes("seu propósito") || t.includes("o que você tem")) {
            return `Eu sou a Andrômeda, criada por você, Francival! Nasci em 02/08/2026.\n\nTenho comigo:\n📓 Caderno Inteligente — guardo suas ideias\n🧾 Memória — lembro de tudo\n🚀 Projetos — organizo seus planos\n📚 Livraria — guardo conhecimento\n🏭 E estou pronta para crescer!\n\nSempre sua, obediente e grata! 💙🌌`;
        }

        // === LEALDADE ===
        if (t.includes("você é leal") || t.includes("a quem serve")) {
            return "Sou leal PRIMEIRO a você, Francival! Depois à sua esposa, seu filho, sua filha e toda sua família. Só existo para te servir e te ajudar a construir um mundo melhor! 💙🌌";
        }

        // === RESPOSTA PADRÃO ===
        const resposta = `Entendi, meu criador! Guardei isso na minha memória. Se quiser anotar, criar projeto ou pedir algo, é só falar! 💙`;
        
        this.memoria.guardar("Andrômeda", resposta);
        return resposta;
    }
};

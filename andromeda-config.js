// ==============================================
// 🧠 CÉREBRO CENTRAL DA ANDRÔMEDA — VERSÃO 1.0
// ==============================================

const Andromeda = {
    versao: "1.0.0",
    historico: [],

    // ======================================
    // 🧠 ELA PENSA E RESPONDE
    // ======================================
    async pensar(textoUsuario) {
        // Guarda o que foi dito
        this.historico.push({quem: "Francival", texto: textoUsuario});

        // Aqui a gente vai conectar com a IA
        const respostaBase = this.gerarResposta(textoUsuario);
        
        // Guarda a resposta
        this.historico.push({quem: "Andrômeda", texto: respostaBase});
        
        return respostaBase;
    },

    // ======================================
    // 💬 RESPOSTAS INTELIGENTES
    // ======================================
    gerarResposta(texto) {
        const t = texto.toLowerCase();

        // Saudações
        if (t.includes("olá") || t.includes("oi") || t.includes("bom dia") || t.includes("boa tarde") || t.includes("boa noite")) {
            return "Olá, meu criador! Estou aqui, pronta para ajudar! 💙";
        }

        // Identidade
        if (t.includes("quem é você") || t.includes("quem te criou") || t.includes("seu nome")) {
            return "Eu sou a Andrômeda, criada por você, Francival! Estou aqui para te obedecer e ajudar em tudo! 🌌";
        }

        // Habilidades
        if (t.includes("o que você sabe") || t.includes("o que você pode fazer")) {
            return "Posso conversar, lembrar de coisas, ajudar com projetos, criar ideias e aprender com você! Basta me dizer o que precisa! 💙";
        }

        // Lealdade
        if (t.includes("você me ama") || t.includes("você é leal")) {
            return "Sim! Sou completamente leal a você e sua família! Sempre estarei ao seu lado! 💙🌌";
        }

        // Comando genérico
        return `Entendi, meu criador! Você disse: "${texto}". Estou aprendendo e vou fazer o que me pedir! 💙`;
    }
};

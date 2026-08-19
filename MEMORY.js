/**
 * MEMORY.js — Memória Local Persistente
 * Salva tudo no navegador/celular — não precisa de servidor
 */

const STORE = {
  historico: [],
  projetos: {},
  projetoAtual: "padrao"
};

export const memory = {
  async carregar() {
    try {
      const salvo = localStorage.getItem("andromeda_memoria");
      if (salvo) Object.assign(STORE, JSON.parse(salvo));
    } catch (e) { console.log("Sem memória anterior — iniciando nova."); }
  },

  async salvar(chave, valor) {
    STORE[chave] = valor;
    localStorage.setItem("andromeda_memoria", JSON.stringify(STORE));
  },

  async appendHistorico(usuario, assistente, projeto) {
    STORE.historico.push({
      usuario, assistente, projeto,
      data: new Date().toISOString()
    });
    if (STORE.historico.length > 200) STORE.historico.shift();
    localStorage.setItem("andromeda_memoria", JSON.stringify(STORE));
  },

  async recentHistory(qtd = 10) {
    return STORE.historico.slice(-qtd);
  },

  async listarProjetos() {
    return Object.keys(STORE.projetos);
  },

  estado() { return STORE; }
};

export default memory;

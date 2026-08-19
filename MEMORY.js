04 andromeda


/**
 * MEMORY.js — Camada de memória persistente da Andrômeda
 * ---------------------------------------------------------------
 * Usa IndexedDB (nativo do navegador/WebView), que sobrevive a
 * fechar o app. Quando isso virar app nativo via Capacitor, o
 * próximo passo natural é trocar este backend por
 * @capacitor/preferences ou um SQLite real (@capacitor-community/sqlite)
 * sem precisar mudar a API pública desta classe — é por isso que
 * tudo passa por get/set/list, e não por SQL direto no resto do app.
 *
 * Tipos de memória (conforme a missão):
 *  - system    -> identidade e regras da Andrômeda (não editável pelo usuário casualmente)
 *  - owner     -> informações que o proprietário autorizou guardar
 *  - project   -> contexto de cada projeto (chave = projectId)
 *  - working   -> contexto temporário da tarefa atual (pode ser limpo)
 *  - history   -> histórico de conversas e operações
 */

const DB_NAME = "andromeda_memory";
const DB_VERSION = 1;
const STORES = ["system", "owner", "project", "working", "history"];

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "key" });
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

class Memory {
  constructor() {
    this._db = null;
  }

  async _ready() {
    if (!this._db) this._db = await openDB();
    return this._db;
  }

  async set(storeName, key, value) {
    const db = await this._ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put({ key, value, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(storeName, key) {
    const db = await this._ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  }

  async list(storeName) {
    const db = await this._ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async delete(storeName, key) {
    const db = await this._ready();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // Atalhos de conveniência usados pelo Core
  async appendHistory(entry) {
    const key = `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return this.set("history", key, { ...entry, ts: Date.now() });
  }

  async recentHistory(limit = 20) {
    const all = await this.list("history");
    return all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit).map((r) => r.value);
  }
}

export const memory = new Memory();

/**
 * ZipExport.js — EXPORTA PROJETO SEM INCLUIR CHAVES
 * =================================================
 * ⚠️ REGRA DE SEGURANÇA AUTOMÁTICA:
 * Qualquer arquivo de configuração que contenha chave, token
 * ou credencial é AUTOMATICAMENTE EXCLUÍDO do ZIP exportado.
 * 
 * Os aplicativos fabricados saem LIMPOS e INDEPENDENTES.
 * Não herdam nenhuma credencial da Andrômeda.
 */

// Na função de montagem do ZIP:
const ARQUIVOS_PROIBIDOS = [
  /chave/i, /api[_-]?key/i, /token/i, /credencial/i,
  /\.env/i, /config\.secret/i, /secret/i
];

// Antes de adicionar um arquivo, verifica:
const temChave = ARQUIVOS_PROIBIDOS.some(padrao => padrao.test(nomeArquivo));
if (temChave) {
  console.log(`[ZIP Export] ⚠️ Arquivo ${nomeArquivo} ignorado — pode conter credencial`);
  return; // NÃO inclui no ZIP
}

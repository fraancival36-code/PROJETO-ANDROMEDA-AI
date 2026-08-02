// ==============================================
// 🎤 SISTEMA DE VOZ — ESCUTA E FALA
// ==============================================

const TEMPO_ESPERA = 1800; // 1,8 segundos após parar de falar

let ligada = false;
let reconhecimento = null;
let temporizador = null;
let textoAcumulado = "";
let sintese = window.speechSynthesis;

// Elementos da tela
const botao = document.getElementById('botao');
const resposta = document.getElementById('resposta');

// ======================================
// 🔘 CLICA = LIGA / CLICA DE NOVO = DESLIGA
// ======================================
botao.addEventListener('click', function() {
    if (!ligada) {
        ligar();
    } else {
        desligar();
    }
});

// ======================================
// 🟢 LIGAR — COMEÇA A OUVIR
// ======================================
function ligar() {
    ligada = true;
    textoAcumulado = "";

    botao.className = 'botao ligado';
    botao.innerHTML = '🟢<br>OUVINDO';
    resposta.innerText = "Estou ouvindo... Fale à vontade!";

    iniciarReconhecimento();
}

// ======================================
// 🔴 DESLIGAR — PARA TUDO
// ======================================
function desligar() {
    ligada = false;

    if (reconhecimento) {
        try { reconhecimento.stop(); } catch(e) {}
        reconhecimento = null;
    }
    if (temporizador) clearTimeout(temporizador);
    sintese.cancel();

    botao.className = 'botao desligado';
    botao.innerHTML = '🔘<br>LIGAR';
    resposta.innerText = "Aguardando seu comando...";
}

// ======================================
// 🎤 ESCUTA O QUE VOCÊ FALA
// ======================================
function iniciarReconhecimento() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("⚠️ Use o navegador Chrome para funcionar a voz!");
        desligar();
        return;
    }

    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    reconhecimento = new Rec();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.continuous = true;
    reconhecimento.interimResults = true;

    reconhecimento.onresult = function(e) {
        let texto = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
            texto += e.results[i][0].transcript;
        }
        textoAcumulado = texto;
        reiniciarContador();
    };

    reconhecimento.onend = function() {
        if (ligada) {
            try { reconhecimento.start(); } catch(e) {}
        }
    };

    reconhecimento.start();
}

// ======================================
// ⏱️ QUANDO PARA DE FALAR → ELA RESPONDE
// ======================================
function reiniciarContador() {
    if (temporizador) clearTimeout(temporizador);
    resposta.innerText = "Entendendo...";

    temporizador = setTimeout(async function() {
        if (textoAcumulado.trim() && ligada) {
            resposta.innerText = "Andrômeda está pensando...";
            const fala = textoAcumulado;
            const respostaTexto = await Andromeda.pensar(fala);
            resposta.innerText = respostaTexto;
            falaComVoz(respostaTexto);
        }
    }, TEMPO_ESPERA);
}

// ======================================
// 🔊 ELA FALA DE VOLTA PRA VOCÊ
// ======================================
function falaComVoz(texto) {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = AndromedaConfig.voz.lingua;
    fala.volume = 1;
    fala.rate = AndromedaConfig.voz.velocidade;
    fala.pitch = AndromedaConfig.voz.altura;

    fala.onend = () => {
        if (ligada) {
            resposta.innerText = "Continuo ouvindo... Fale o que precisar!";
        }
    };

    sintese.speak(fala);
}

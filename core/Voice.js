// Voice.js — 🎙️ Fala e Escuta — 100% Grátis, sem chave!
// Usa Web Speech API do navegador — não depende de ninguém!

export class VoiceSystem {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.ativado = true;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SR();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "pt-BR";
    }
  }

  falar(texto) {
    if (!this.ativado || !this.synth) return;
    this.synth.cancel();
    const ut = new SpeechSynthesisUtterance(texto);
    ut.lang = "pt-BR"; ut.rate = 1.0; ut.pitch = 1.0;
    this.synth.speak(ut);
  }

  alternar() {
    this.ativado = !this.ativado;
    if (!this.ativado && this.synth) this.synth.cancel();
    return this.ativado;
  }

  ouvir(inicio, resultado, fim) {
    if (!this.recognition) {
      alert("Seu navegador não suporta voz. Use Chrome ou Edge.");
      return;
    }
    this.recognition.onstart = () => inicio?.();
    this.recognition.onresult = (e) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      resultado?.(t.trim());
    };
    this.recognition.onend = () => fim?.();
    this.recognition.start();
  }

  parar() {
    if (this.synth) this.synth.cancel();
  }
}

export default VoiceSystem;

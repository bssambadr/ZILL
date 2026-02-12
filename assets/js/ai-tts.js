// assets/js/ai-tts.js
class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.arabicVoice = null;
    }

    init() {
        return new Promise((resolve) => {
            const voices = this.synth.getVoices();
            this.arabicVoice = voices.find(v => v.lang.includes('ar') || v.lang.includes('egy')) || voices[0];
            resolve(this.arabicVoice);
        });
    }

    speak(text) {
        if (this.isPlaying) this.stop();
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.voice = this.arabicVoice;
        this.utterance.lang = 'ar-EG';
        this.utterance.rate = 0.9;
        this.synth.speak(this.utterance);
        this.isPlaying = true;
        this.utterance.onend = () => this.isPlaying = false;
    }

    stop() {
        this.synth.cancel();
        this.isPlaying = false;
    }

    toggle(text) {
        if (this.isPlaying) this.stop();
        else this.speak(text);
    }
}

export const tts = new TTSManager();

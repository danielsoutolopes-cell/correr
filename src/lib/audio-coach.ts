"use client";

// Web Audio API Metronome & Web Speech Synthesis Coach
class AudioCoachService {
  private audioCtx: AudioContext | null = null;
  private isMetronomePlaying = false;
  private metronomeTimerId: any = null;
  private currentBpm = 178;

  private initAudio() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Play a crisp, high-precision acoustic metronome beep
  private playClick(isAccent = false) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn("Metronome sound error", e);
    }
  }

  // Start cadence metronome (spm = steps per minute)
  public startMetronome(spm: number) {
    this.initAudio();
    this.stopMetronome();

    this.currentBpm = spm;
    this.isMetronomePlaying = true;

    const intervalMs = (60 / spm) * 1000;
    let stepCount = 0;

    // Initial click
    this.playClick(true);

    this.metronomeTimerId = setInterval(() => {
      stepCount++;
      // Accentuate every 4th step
      this.playClick(stepCount % 4 === 0);
    }, intervalMs);
  }

  public stopMetronome() {
    if (this.metronomeTimerId) {
      clearInterval(this.metronomeTimerId);
      this.metronomeTimerId = null;
    }
    this.isMetronomePlaying = false;
  }

  public toggleMetronome(spm: number): boolean {
    if (this.isMetronomePlaying) {
      this.stopMetronome();
      return false;
    } else {
      this.startMetronome(spm);
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isMetronomePlaying;
  }

  public getBpm(): number {
    return this.currentBpm;
  }

  // Text-To-Speech Coach
  public speakCoachBriefing(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1.05; // Energetic, clear running cadence
      utterance.pitch = 1.0;

      // Find best Portuguese voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((v) => v.lang === "pt-BR" || v.lang.startsWith("pt"));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Error synthesizing speech", e);
    }
  }

  public stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioCoach = new AudioCoachService();

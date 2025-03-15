// VoiceHelper.js
class VoiceHelper {
    constructor() {
        this.synthesis = null;
        this.voices = [];
        this.preferredVoice = null;
        this.enabled = true;
        this.speakingCallbacks = {
            onStart: null,
            onEnd: null,
            onError: null
        };
        this.initialized = false;
    }

    // Initialize the voice helper
    async init() {
        return new Promise((resolve, reject) => {
            try {
                if (typeof window === 'undefined' || !window.speechSynthesis) {
                    console.warn('Speech synthesis not supported in this browser');
                    return resolve(false);
                }

                this.synthesis = window.speechSynthesis;

                // Try to load voices immediately (works in some browsers)
                this.loadVoices();

                // Set up voice changed event for browsers that load voices asynchronously
                if (this.synthesis.onvoiceschanged !== undefined) {
                    const voiceChangeTimeout = setTimeout(() => {
                        console.warn('Voice loading timeout - using default voice');
                        this.initialized = true;
                        resolve(true);
                    }, 3000);

                    this.synthesis.onvoiceschanged = () => {
                        clearTimeout(voiceChangeTimeout);
                        this.loadVoices();
                        this.initialized = true;
                        resolve(true);
                    };
                } else {
                    // For browsers without onvoiceschanged event
                    this.initialized = true;
                    resolve(true);
                }
            } catch (error) {
                console.error('Voice initialization error:', error);
                reject(error);
            }
        });
    }

    // Load and find preferred voice
    loadVoices() {
        if (!this.synthesis) return;

        this.voices = this.synthesis.getVoices();

        // Try to find a natural sounding voice
        this.preferredVoice = this.voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Natural') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Daniel')
        );

        // Fallback to first English voice
        if (!this.preferredVoice) {
            this.preferredVoice = this.voices.find(voice =>
                voice.lang.includes('en-')
            );
        }

        // Last resort: use first available voice
        if (!this.preferredVoice && this.voices.length > 0) {
            this.preferredVoice = this.voices[0];
        }

        if (this.preferredVoice) {
            console.log(`Selected voice: ${this.preferredVoice.name} (${this.preferredVoice.lang})`);
        } else {
            console.warn('No voices available');
        }
    }

    // Set callback for when speech starts
    onSpeakStart(callback) {
        if (typeof callback === 'function') {
            this.speakingCallbacks.onStart = callback;
        }
    }

    // Set callback for when speech ends
    onSpeakEnd(callback) {
        if (typeof callback === 'function') {
            this.speakingCallbacks.onEnd = callback;
        }
    }

    // Set callback for when speech errors
    onSpeakError(callback) {
        if (typeof callback === 'function') {
            this.speakingCallbacks.onError = callback;
        }
    }

    // Enable/disable voice
    setVoiceEnabled(enabled) {
        this.enabled = !!enabled;
        if (!this.enabled) {
            this.stopSpeaking();
        }
    }

    // Speak text
    speak(text) {
        if (!this.synthesis || !this.enabled || !text) return false;

        // Trim and clean text
        const cleanText = text.trim();
        if (!cleanText) return false;

        // Wait for initialization if needed
        if (!this.initialized) {
            console.warn('Voice helper not initialized yet, retrying in 500ms');
            setTimeout(() => this.speak(text), 500);
            return false;
        }

        try {
            // Cancel any ongoing speech
            this.stopSpeaking();

            const utterance = new SpeechSynthesisUtterance(cleanText);

            // Set voice if available
            if (this.preferredVoice) {
                utterance.voice = this.preferredVoice;
            }

            // Configure utterance
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Set up callbacks
            utterance.onstart = () => {
                if (this.speakingCallbacks.onStart) {
                    this.speakingCallbacks.onStart();
                }
            };

            utterance.onend = () => {
                if (this.speakingCallbacks.onEnd) {
                    this.speakingCallbacks.onEnd();
                }
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                if (this.speakingCallbacks.onError) {
                    this.speakingCallbacks.onError(event);
                }
            };

            // Start speaking
            this.synthesis.speak(utterance);
            return true;
        } catch (error) {
            console.error('Error speaking text:', error);
            if (this.speakingCallbacks.onError) {
                this.speakingCallbacks.onError(error);
            }
            return false;
        }
    }

    // Stop speaking
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    // Clean up
    cleanup() {
        this.stopSpeaking();
        this.speakingCallbacks = {
            onStart: null,
            onEnd: null,
            onError: null
        };
    }

    // Debug voice support
    debugVoiceSupport() {
        if (!this.synthesis) {
            return {
                supported: false,
                reason: 'Speech synthesis not available in this browser'
            };
        }

        return {
            supported: true,
            initialized: this.initialized,
            enabled: this.enabled,
            voicesAvailable: this.voices.length,
            selectedVoice: this.preferredVoice ?
                `${this.preferredVoice.name} (${this.preferredVoice.lang})` :
                'None',
            allVoices: this.voices.map(v => ({
                name: v.name,
                lang: v.lang,
                default: v.default
            }))
        };
    }
}

export default VoiceHelper;
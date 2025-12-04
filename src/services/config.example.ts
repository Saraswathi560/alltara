/**
 * Configuration Example
 * 
 * Copy this file to config.ts and fill in your actual values.
 * Never commit config.ts with real credentials to version control.
 */

export const config = {
  // Audio/Voice adapter configuration
  audio: {
    // URL for your voice service API (e.g., Vapi, Daily, Twilio)
    AUDIO_ADAPTER_URL: 'https://api.your-voice-service.com',
    
    // API key for the voice service
    AUDIO_API_KEY: 'your-api-key-here',
    
    // Sample rate for audio recording (24kHz recommended)
    SAMPLE_RATE: 24000,
    
    // Number of audio channels (1 for mono, 2 for stereo)
    CHANNELS: 1,
  },
  
  // HR System API configuration
  hr: {
    // Base URL for your HR system API
    HR_API_BASE: 'https://api.your-hr-system.com/v1',
    
    // API key for HR system
    HR_API_KEY: 'your-hr-api-key-here',
    
    // Data retention period in months
    RETENTION_MONTHS: 36,
  },
  
  // Session configuration
  session: {
    // Maximum session duration in minutes
    MAX_DURATION_MINUTES: 90,
    
    // Auto-save draft interval in seconds
    AUTOSAVE_INTERVAL_SECONDS: 30,
    
    // Reconnection timeout in seconds
    RECONNECT_TIMEOUT_SECONDS: 60,
  },
  
  // Scoring configuration
  scoring: {
    // Default weights for score calculation
    defaultWeights: {
      okr: 0.6,        // 60% weight for OKR achievement
      competency: 0.4, // 40% weight for competencies
    },
    
    // Rating scale
    ratingScale: {
      min: 1,
      max: 5,
      labels: {
        1: 'Needs Improvement',
        2: 'Partially Meets',
        3: 'Meets Expectations',
        4: 'Exceeds Expectations',
        5: 'Outstanding',
      },
    },
  },
  
  // Bias detection thresholds
  bias: {
    // Confidence threshold for flagging potential bias
    CONFIDENCE_THRESHOLD: 0.7,
    
    // Enable/disable bias detection
    ENABLED: true,
  },
};

export type AppConfig = typeof config;

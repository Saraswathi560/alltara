import { useState, useEffect, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_KEY = '3d010371-bfdb-4a74-9ac8-a45e035fa9d6';
const ASSISTANT_ID = '2261f63c-15b9-4d72-8386-e1c4cd6cd63b';

export type VapiStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error';

interface UseVapiReturn {
  status: VapiStatus;
  isSpeaking: boolean;
  isConnected: boolean;
  transcript: string[];
  start: () => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

export function useVapi(): UseVapiReturn {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<VapiStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      console.log('[Vapi] Call started');
      setStatus('connected');
    });

    vapi.on('call-end', () => {
      console.log('[Vapi] Call ended');
      setStatus('idle');
      setIsSpeaking(false);
    });

    vapi.on('speech-start', () => {
      console.log('[Vapi] Assistant speaking');
      setIsSpeaking(true);
      setStatus('speaking');
    });

    vapi.on('speech-end', () => {
      console.log('[Vapi] Assistant stopped speaking');
      setIsSpeaking(false);
      setStatus('listening');
    });

    vapi.on('message', (message) => {
      console.log('[Vapi] Message:', message);
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(prev => [...prev, `${message.role}: ${message.transcript}`]);
      }
    });

    vapi.on('error', (error) => {
      console.error('[Vapi] Error:', error);
      setStatus('error');
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const start = useCallback(async () => {
    if (!vapiRef.current) return;
    
    try {
      setStatus('connecting');
      await vapiRef.current.start(ASSISTANT_ID);
    } catch (error) {
      console.error('[Vapi] Failed to start:', error);
      setStatus('error');
    }
  }, []);

  const stop = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
    setStatus('idle');
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  return {
    status,
    isSpeaking,
    isConnected: status === 'connected' || status === 'speaking' || status === 'listening',
    transcript,
    start,
    stop,
    toggleMute,
    isMuted,
  };
}

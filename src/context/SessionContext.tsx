import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type {
  Session,
  Participant,
  ParticipantRole,
  Objective,
  Competency,
  BiasFlag,
  ActionItem,
  TranscriptEntry,
  ReviewDraft,
} from '@/types/review';

interface SessionState {
  session: Session | null;
  currentParticipant: Participant | null;
  objectives: Objective[];
  competencies: Competency[];
  biasFlags: BiasFlag[];
  actionItems: ActionItem[];
  transcript: TranscriptEntry[];
  assistantPrompt: string;
  isRecording: boolean;
  draft: ReviewDraft | null;
}

type SessionAction =
  | { type: 'SET_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Partial<Session> }
  | { type: 'SET_CURRENT_PARTICIPANT'; payload: Participant }
  | { type: 'UPDATE_PARTICIPANT'; payload: { id: string; updates: Partial<Participant> } }
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'SET_OBJECTIVES'; payload: Objective[] }
  | { type: 'UPDATE_OBJECTIVE'; payload: { id: string; updates: Partial<Objective> } }
  | { type: 'SET_COMPETENCIES'; payload: Competency[] }
  | { type: 'UPDATE_COMPETENCY'; payload: { id: string; updates: Partial<Competency> } }
  | { type: 'ADD_BIAS_FLAG'; payload: BiasFlag }
  | { type: 'UPDATE_BIAS_FLAG'; payload: { id: string; updates: Partial<BiasFlag> } }
  | { type: 'ADD_ACTION_ITEM'; payload: ActionItem }
  | { type: 'UPDATE_ACTION_ITEM'; payload: { id: string; updates: Partial<ActionItem> } }
  | { type: 'REMOVE_ACTION_ITEM'; payload: string }
  | { type: 'ADD_TRANSCRIPT_ENTRY'; payload: TranscriptEntry }
  | { type: 'SET_ASSISTANT_PROMPT'; payload: string }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'LOAD_DRAFT'; payload: ReviewDraft }
  | { type: 'CLEAR_SESSION' };

const initialState: SessionState = {
  session: null,
  currentParticipant: null,
  objectives: [],
  competencies: [],
  biasFlags: [],
  actionItems: [],
  transcript: [],
  assistantPrompt: '',
  isRecording: false,
  draft: null,
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    
    case 'UPDATE_SESSION':
      return state.session
        ? { ...state, session: { ...state.session, ...action.payload } }
        : state;
    
    case 'SET_CURRENT_PARTICIPANT':
      return { ...state, currentParticipant: action.payload };
    
    case 'UPDATE_PARTICIPANT':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          participants: state.session.participants.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
          ),
        },
      };
    
    case 'ADD_PARTICIPANT':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          participants: [...state.session.participants, action.payload],
        },
      };
    
    case 'REMOVE_PARTICIPANT':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          participants: state.session.participants.filter(p => p.id !== action.payload),
        },
      };
    
    case 'SET_OBJECTIVES':
      return { ...state, objectives: action.payload };
    
    case 'UPDATE_OBJECTIVE':
      return {
        ...state,
        objectives: state.objectives.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
        ),
      };
    
    case 'SET_COMPETENCIES':
      return { ...state, competencies: action.payload };
    
    case 'UPDATE_COMPETENCY':
      return {
        ...state,
        competencies: state.competencies.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    
    case 'ADD_BIAS_FLAG':
      return { ...state, biasFlags: [...state.biasFlags, action.payload] };
    
    case 'UPDATE_BIAS_FLAG':
      return {
        ...state,
        biasFlags: state.biasFlags.map(f =>
          f.id === action.payload.id ? { ...f, ...action.payload.updates } : f
        ),
      };
    
    case 'ADD_ACTION_ITEM':
      return { ...state, actionItems: [...state.actionItems, action.payload] };
    
    case 'UPDATE_ACTION_ITEM':
      return {
        ...state,
        actionItems: state.actionItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      };
    
    case 'REMOVE_ACTION_ITEM':
      return {
        ...state,
        actionItems: state.actionItems.filter(item => item.id !== action.payload),
      };
    
    case 'ADD_TRANSCRIPT_ENTRY':
      return { ...state, transcript: [...state.transcript, action.payload] };
    
    case 'SET_ASSISTANT_PROMPT':
      return { ...state, assistantPrompt: action.payload };
    
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    
    case 'LOAD_DRAFT':
      return {
        ...state,
        objectives: action.payload.objectives,
        competencies: action.payload.competencies,
        biasFlags: action.payload.biasFlags,
        actionItems: action.payload.actionItems,
        draft: action.payload,
      };
    
    case 'CLEAR_SESSION':
      return initialState;
    
    default:
      return state;
  }
}

interface SessionContextValue extends SessionState {
  dispatch: React.Dispatch<SessionAction>;
  joinSession: (sessionCode: string, participant: Omit<Participant, 'id' | 'status' | 'isSpeaking' | 'consentGiven'>) => void;
  giveConsent: () => void;
  updateRating: (itemId: string, itemType: 'okr' | 'competency', role: ParticipantRole, rating: number) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  
  const joinSession = useCallback((
    sessionCode: string,
    participant: Omit<Participant, 'id' | 'status' | 'isSpeaking' | 'consentGiven'>
  ) => {
    const newParticipant: Participant = {
      ...participant,
      id: `p_${Date.now()}`,
      status: 'pending',
      isSpeaking: false,
      consentGiven: false,
    };
    
    const newSession: Session = {
      id: `session_${Date.now()}`,
      code: sessionCode,
      status: 'pending',
      participants: [newParticipant],
    };
    
    dispatch({ type: 'SET_SESSION', payload: newSession });
    dispatch({ type: 'SET_CURRENT_PARTICIPANT', payload: newParticipant });
  }, []);
  
  const giveConsent = useCallback(() => {
    if (state.currentParticipant) {
      dispatch({
        type: 'UPDATE_PARTICIPANT',
        payload: {
          id: state.currentParticipant.id,
          updates: {
            consentGiven: true,
            consentTimestamp: new Date(),
          },
        },
      });
      dispatch({
        type: 'SET_CURRENT_PARTICIPANT',
        payload: {
          ...state.currentParticipant,
          consentGiven: true,
          consentTimestamp: new Date(),
        },
      });
    }
  }, [state.currentParticipant]);
  
  const updateRating = useCallback((
    itemId: string,
    itemType: 'okr' | 'competency',
    role: ParticipantRole,
    rating: number
  ) => {
    if (itemType === 'competency') {
      dispatch({
        type: 'UPDATE_COMPETENCY',
        payload: {
          id: itemId,
          updates: role === 'employee' ? { employeeRating: rating } : { managerRating: rating },
        },
      });
    }
    // For OKRs, we need to find the key result within objectives
    // This would require a more complex update logic
  }, []);
  
  const value: SessionContextValue = {
    ...state,
    dispatch,
    joinSession,
    giveConsent,
    updateRating,
  };
  
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

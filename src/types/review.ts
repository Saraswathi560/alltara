/**
 * Type definitions for the Tara Performance Review system
 */

export type ParticipantRole = 'employee' | 'manager' | 'hr';

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: ParticipantRole;
  status: 'pending' | 'connected' | 'disconnected' | 'muted';
  isSpeaking: boolean;
  consentGiven: boolean;
  consentTimestamp?: Date;
  joinedAt?: Date;
}

export interface Session {
  id: string;
  code: string;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'canceled';
  participants: Participant[];
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  recordingId?: string;
}

export interface KeyResult {
  id: string;
  title: string;
  description?: string;
  targetValue?: number;
  actualValue?: number;
  unit?: string;
  employeeRating: number | null;
  managerRating: number | null;
  employeeEvidence: string;
  managerEvidence: string;
  needsReview: boolean;
}

export interface Objective {
  id: string;
  title: string;
  weight: number;
  keyResults: KeyResult[];
}

export interface STARExample {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  submittedBy: ParticipantRole;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  employeeRating: number | null;
  managerRating: number | null;
  examples: STARExample[];
  needsReview: boolean;
}

export interface BiasFlag {
  id: string;
  timestamp: Date;
  originalText: string;
  biasType: 'recency' | 'halo' | 'horn' | 'similarity' | 'attribution' | 'contrast' | 'other';
  confidence: number;
  suggestedRephrase: string;
  speaker: ParticipantRole;
  acknowledged: boolean;
  reframed: boolean;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: ParticipantRole;
  metric: string;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ScoringResult {
  okrScore: number;
  competencyScore: number;
  overallScore: number;
  employeeAverage: number;
  managerAverage: number;
  discrepancies: {
    itemId: string;
    itemType: 'okr' | 'competency';
    difference: number;
  }[];
}

export interface ReviewDraft {
  id: string;
  sessionId: string;
  lastSaved: Date;
  objectives: Objective[];
  competencies: Competency[];
  biasFlags: BiasFlag[];
  actionItems: ActionItem[];
  scoring?: ScoringResult;
  rationale?: string;
}

export interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: string;
  role: ParticipantRole | 'assistant';
  text: string;
  isFinal: boolean;
}

export interface ExportArtifacts {
  audioUri: string;
  transcript: {
    sessionId: string;
    entries: TranscriptEntry[];
  };
  biasReport: {
    sessionId: string;
    flags: BiasFlag[];
    summary: string;
  };
  scoringWorksheet: {
    sessionId: string;
    objectives: Objective[];
    competencies: Competency[];
    result: ScoringResult;
  };
  rationale: string;
  auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: ParticipantRole | 'system';
  details: Record<string, unknown>;
}

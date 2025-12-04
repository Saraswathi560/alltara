/**
 * Scoring utilities for performance review calculations
 */

import type { Objective, Competency, ScoringResult, KeyResult } from '@/types/review';

export interface ScoringWeights {
  okr: number;
  competency: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  okr: 0.6,
  competency: 0.4,
};

/**
 * Calculate the average rating for a set of key results
 */
export function calculateKeyResultAverage(
  keyResults: KeyResult[],
  perspective: 'employee' | 'manager'
): number {
  const ratings = keyResults
    .map(kr => perspective === 'employee' ? kr.employeeRating : kr.managerRating)
    .filter((r): r is number => r !== null);
  
  if (ratings.length === 0) return 0;
  
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

/**
 * Calculate weighted OKR score across all objectives
 */
export function calculateOKRScore(
  objectives: Objective[],
  perspective: 'employee' | 'manager' | 'combined'
): number {
  if (objectives.length === 0) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  for (const objective of objectives) {
    const weight = objective.weight || 1;
    totalWeight += weight;
    
    if (perspective === 'combined') {
      const employeeAvg = calculateKeyResultAverage(objective.keyResults, 'employee');
      const managerAvg = calculateKeyResultAverage(objective.keyResults, 'manager');
      const combinedAvg = (employeeAvg + managerAvg) / 2;
      weightedSum += combinedAvg * weight;
    } else {
      const avg = calculateKeyResultAverage(objective.keyResults, perspective);
      weightedSum += avg * weight;
    }
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calculate average competency score
 */
export function calculateCompetencyScore(
  competencies: Competency[],
  perspective: 'employee' | 'manager' | 'combined'
): number {
  if (competencies.length === 0) return 0;
  
  const ratings = competencies.map(c => {
    if (perspective === 'combined') {
      const emp = c.employeeRating ?? 0;
      const mgr = c.managerRating ?? 0;
      const count = (c.employeeRating !== null ? 1 : 0) + (c.managerRating !== null ? 1 : 0);
      return count > 0 ? (emp + mgr) / count : 0;
    }
    return perspective === 'employee' ? c.employeeRating : c.managerRating;
  }).filter((r): r is number => r !== null && r !== 0);
  
  if (ratings.length === 0) return 0;
  
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

/**
 * Find rating discrepancies between employee and manager
 */
export function findDiscrepancies(
  objectives: Objective[],
  competencies: Competency[],
  threshold: number = 1.5
): ScoringResult['discrepancies'] {
  const discrepancies: ScoringResult['discrepancies'] = [];
  
  // Check OKR discrepancies
  for (const objective of objectives) {
    for (const kr of objective.keyResults) {
      if (kr.employeeRating !== null && kr.managerRating !== null) {
        const diff = Math.abs(kr.employeeRating - kr.managerRating);
        if (diff >= threshold) {
          discrepancies.push({
            itemId: kr.id,
            itemType: 'okr',
            difference: diff,
          });
        }
      }
    }
  }
  
  // Check competency discrepancies
  for (const competency of competencies) {
    if (competency.employeeRating !== null && competency.managerRating !== null) {
      const diff = Math.abs(competency.employeeRating - competency.managerRating);
      if (diff >= threshold) {
        discrepancies.push({
          itemId: competency.id,
          itemType: 'competency',
          difference: diff,
        });
      }
    }
  }
  
  return discrepancies.sort((a, b) => b.difference - a.difference);
}

/**
 * Calculate complete scoring result
 */
export function calculateScoringResult(
  objectives: Objective[],
  competencies: Competency[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScoringResult {
  const okrScore = calculateOKRScore(objectives, 'combined');
  const competencyScore = calculateCompetencyScore(competencies, 'combined');
  
  const overallScore = (okrScore * weights.okr) + (competencyScore * weights.competency);
  
  const employeeOKR = calculateOKRScore(objectives, 'employee');
  const employeeCompetency = calculateCompetencyScore(competencies, 'employee');
  const employeeAverage = (employeeOKR * weights.okr) + (employeeCompetency * weights.competency);
  
  const managerOKR = calculateOKRScore(objectives, 'manager');
  const managerCompetency = calculateCompetencyScore(competencies, 'manager');
  const managerAverage = (managerOKR * weights.okr) + (managerCompetency * weights.competency);
  
  const discrepancies = findDiscrepancies(objectives, competencies);
  
  return {
    okrScore,
    competencyScore,
    overallScore,
    employeeAverage,
    managerAverage,
    discrepancies,
  };
}

/**
 * Format score for display (e.g., 3.75 -> "3.8")
 */
export function formatScore(score: number, decimals: number = 1): string {
  return score.toFixed(decimals);
}

/**
 * Get rating label based on score
 */
export function getRatingLabel(score: number): string {
  if (score >= 4.5) return 'Outstanding';
  if (score >= 3.5) return 'Exceeds Expectations';
  if (score >= 2.5) return 'Meets Expectations';
  if (score >= 1.5) return 'Partially Meets';
  return 'Needs Improvement';
}

/**
 * Get color class based on score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 4) return 'text-success';
  if (score >= 3) return 'text-primary';
  if (score >= 2) return 'text-warning';
  return 'text-destructive';
}

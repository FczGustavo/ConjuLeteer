import { MILITARY_RANKS } from '../data/canonicalVerbs';
import type { MilitaryRank, UserVerbStat, DailyActivityLog, Mood, Tense } from '../types/verbs';

const STATS_STORAGE_KEY = 'conjuletter_user_verb_stats_v1';
const ACTIVITY_STORAGE_KEY = 'conjuletter_daily_activity_v1';
const SETTINGS_STORAGE_KEY = 'conjuletter_settings_v1';

export interface UserSettings {
  strictAccents: boolean;
  soundEffects: boolean;
  theme: 'dark';
  defaultBanca: string;
  openRouterApiKey?: string;
  aiModel?: string;
  tableColumns?: 1 | 2 | 3;
}

export function loadUserSettings(): UserSettings {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        strictAccents: true,
        soundEffects: true,
        theme: 'dark',
        defaultBanca: 'EsPCEx',
        aiModel: 'google/gemini-3.7-flash',
        tableColumns: 2,
        ...parsed
      };
    }
  } catch (e) {
    console.error('Error loading settings', e);
  }
  return {
    strictAccents: true,
    soundEffects: true,
    theme: 'dark',
    defaultBanca: 'EsPCEx',
    aiModel: 'google/gemini-3.7-flash',
    tableColumns: 2
  };
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function loadUserStats(): Record<string, UserVerbStat> {
  try {
    const data = localStorage.getItem(STATS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading stats', e);
  }
  return {};
}

export function saveUserStats(stats: Record<string, UserVerbStat>): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving stats', e);
  }
}

export function recordVerbAttempt(
  verbId: string,
  mood: Mood,
  tense: Tense,
  isCorrect: boolean
): { stat: UserVerbStat; currentRank: MilitaryRank } {
  const stats = loadUserStats();
  const key = `${verbId}_${mood}_${tense}`;
  const now = new Date().toISOString();

  let existing = stats[key];
  if (!existing || typeof existing.easeFactor !== 'number' || typeof existing.intervalDays !== 'number') {
    existing = {
      verbId: verbId || 'unknown',
      mood: mood || 'indicativo',
      tense: tense || 'presente',
      correctCount: 0,
      errorCount: 0,
      masteryScore: 0,
      lastPracticed: now,
      nextReviewDate: now,
      easeFactor: 2.5,
      intervalDays: 1
    };
  }

  existing.lastPracticed = now;

  if (isCorrect) {
    existing.correctCount = (existing.correctCount || 0) + 1;
    existing.easeFactor = Math.max(1.3, (existing.easeFactor || 2.5) + 0.1);
    const prevInterval = typeof existing.intervalDays === 'number' && !isNaN(existing.intervalDays) ? existing.intervalDays : 1;
    existing.intervalDays = Math.min(365, Math.max(1, Math.round(prevInterval * existing.easeFactor)));
    existing.masteryScore = Math.min(100, (existing.masteryScore || 0) + 15);
  } else {
    existing.errorCount = (existing.errorCount || 0) + 1;
    existing.easeFactor = Math.max(1.3, (existing.easeFactor || 2.5) - 0.2);
    existing.intervalDays = 1;
    existing.masteryScore = Math.max(0, (existing.masteryScore || 0) - 20);
  }

  const nextDate = new Date();
  const daysToAdd = typeof existing.intervalDays === 'number' && !isNaN(existing.intervalDays) ? existing.intervalDays : 1;
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  
  if (isNaN(nextDate.getTime())) {
    existing.nextReviewDate = now;
  } else {
    existing.nextReviewDate = nextDate.toISOString();
  }

  stats[key] = existing;
  saveUserStats(stats);

  // Record daily activity
  logDailyActivity(isCorrect);

  const currentRank = calculateUserRank(stats);
  return { stat: existing, currentRank };
}

export function calculateUserRank(stats: Record<string, UserVerbStat>): MilitaryRank {
  const entries = Object.values(stats);
  if (entries.length === 0) {
    return MILITARY_RANKS[0];
  }

  const totalScore = entries.reduce((acc, s) => acc + (s.masteryScore || 0), 0);
  const avgMastery = Math.min(100, Math.round(totalScore / Math.max(10, entries.length)));

  let currentRank = MILITARY_RANKS[0];
  for (const rank of MILITARY_RANKS) {
    if (avgMastery >= rank.minMasteryScore) {
      currentRank = rank;
    }
  }

  return currentRank;
}

export function getOverallMasteryScore(stats: Record<string, UserVerbStat>): number {
  const entries = Object.values(stats);
  if (entries.length === 0) return 0;
  const total = entries.reduce((acc, s) => acc + (s.masteryScore || 0), 0);
  return Math.min(100, Math.round(total / Math.max(10, entries.length)));
}

export function getWeakestVerbs(stats: Record<string, UserVerbStat>, limit: number = 5): { verbId: string; tenseKey: string; errorRate: number }[] {
  const entries = Object.values(stats);
  if (entries.length === 0) return [];

  const items = entries.map(item => {
    const total = (item.correctCount || 0) + (item.errorCount || 0);
    const errorRate = total > 0 ? ((item.errorCount || 0) / total) * 100 : 0;
    return {
      verbId: item.verbId,
      tenseKey: `${item.mood}_${item.tense}`,
      errorRate: Math.round(errorRate)
    };
  });

  return items.sort((a, b) => b.errorRate - a.errorRate).slice(0, limit);
}

function logDailyActivity(isCorrect: boolean): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const logs: Record<string, DailyActivityLog> = raw ? JSON.parse(raw) : {};

    const current = logs[today] || {
      date: today,
      cellsFilled: 0,
      questionsAnswered: 0,
      accuracy: 100
    };

    current.cellsFilled += 1;
    const total = current.cellsFilled;
    const currentAcc = typeof current.accuracy === 'number' && !isNaN(current.accuracy) ? current.accuracy : 100;
    const correctApproximation = Math.round((currentAcc / 100) * (total - 1)) + (isCorrect ? 1 : 0);
    current.accuracy = Math.round((correctApproximation / total) * 100);

    logs[today] = current;
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error logging activity', e);
  }
}

export function getDailyActivityLogs(): DailyActivityLog[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return [];
    const logs: Record<string, DailyActivityLog> = JSON.parse(raw);
    return Object.values(logs);
  } catch {
    return [];
  }
}

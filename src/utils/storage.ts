import { createInitialSampleState } from '../data/sampleData';
import { SCHEMA_VERSION, STORAGE_KEY, TravelPlannerState } from '../types/travel';

function isValidTravelPlannerState(value: unknown): value is TravelPlannerState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<TravelPlannerState>;
  return (
    candidate.schemaVersion === SCHEMA_VERSION &&
    Boolean(candidate.tripMeta && typeof candidate.tripMeta.title === 'string') &&
    Array.isArray(candidate.itinerary) &&
    Boolean(candidate.notice && typeof candidate.notice.title === 'string') &&
    Array.isArray(candidate.checklist) &&
    Array.isArray(candidate.vouchers) &&
    Array.isArray(candidate.reservations) &&
    Array.isArray(candidate.emergencyContacts)
  );
}

export function loadTravelState(): TravelPlannerState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialSampleState();
      saveTravelState(initial);
      return initial;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidTravelPlannerState(parsed)) {
      const fallback = createInitialSampleState();
      saveTravelState(fallback);
      return fallback;
    }

    return parsed;
  } catch {
    return createInitialSampleState();
  }
}

export function saveTravelState(state: TravelPlannerState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('LocalStorage 저장에 실패했습니다:', error);
  }
}

export function resetTravelState(): TravelPlannerState {
  const initial = createInitialSampleState();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (error) {
    console.warn('LocalStorage 초기화 중 오류가 발생했습니다:', error);
  }
  return initial;
}

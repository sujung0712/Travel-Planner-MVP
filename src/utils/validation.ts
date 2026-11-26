import {
  ChecklistItem,
  ItineraryCategory,
  ItineraryItem,
  ItineraryItemInput,
  NoticeItem,
  NoticeUpdateInput,
  TravelPlannerState,
  TripDay,
  TripMeta,
} from '../types/travel';

export const INPUT_LIMITS = {
  ITINERARY_ACTIVITY_MAX: 80,
  ITINERARY_LOCATION_MAX: 100,
  ITINERARY_MEMO_MAX: 300,
  NOTICE_TITLE_MAX: 80,
  NOTICE_CONTENT_MAX: 500,
} as const;

export interface SanitizeTextOptions {
  multiline?: boolean;
}

export interface NormalizeStoredStringOptions extends SanitizeTextOptions {
  fallback?: string;
}

export type ItineraryValidationField = 'time' | 'location' | 'activity' | 'memo';
export type ItineraryValidationErrors = Partial<Record<ItineraryValidationField, string>>;

export interface ItineraryValidationResult {
  valid: boolean;
  errors: ItineraryValidationErrors;
  sanitized: ItineraryItemInput;
}

export type NoticeValidationField = 'title' | 'content';
export type NoticeValidationErrors = Partial<Record<NoticeValidationField, string>>;

export interface NoticeValidationResult {
  valid: boolean;
  errors: NoticeValidationErrors;
  sanitized: NoticeUpdateInput;
}

const VALID_ITINERARY_CATEGORIES: ReadonlySet<ItineraryCategory> = new Set<ItineraryCategory>([
  '공항/교통',
  '숙소',
  '관광',
  '야경/식사',
  '맛집/카페',
  '쇼핑',
  '기타',
]);

function stripDangerousControlChars(value: string): string {
  let cleaned = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    const isDisallowedControl =
      code <= 0x08 ||
      code === 0x0b ||
      code === 0x0c ||
      (code >= 0x0e && code <= 0x1f) ||
      code === 0x7f;

    if (!isDisallowedControl) {
      cleaned += value[i];
    }
  }
  return cleaned;
}

/**
 * Safely normalizes user text without HTML-entity encoding so React JSX text
 * nodes escape HTML characters exactly once (preventing XSS without double-escaping).
 */
export function sanitizeTextInput(
  value: string,
  options: SanitizeTextOptions = {},
): string {
  const { multiline = false } = options;
  const withoutControls = stripDangerousControlChars(value);

  if (multiline) {
    return withoutControls.replace(/\r\n?/g, '\n').trim();
  }

  return withoutControls.replace(/[\r\n\t]+/g, ' ').trim();
}

/**
 * Safely normalizes untrusted strings loaded from LocalStorage.
 */
export function normalizeStoredString(
  value: unknown,
  maxLength: number,
  options: NormalizeStoredStringOptions = {},
): string {
  const { multiline = false, fallback = '' } = options;
  const normalizedFallback = sanitizeTextInput(fallback, { multiline }).slice(0, maxLength);

  if (typeof value !== 'string') {
    return normalizedFallback;
  }

  const sanitized = sanitizeTextInput(value, { multiline }).slice(0, maxLength).trim();
  if (!sanitized && normalizedFallback) {
    return normalizedFallback;
  }

  return sanitized;
}

function isValidTripDay(value: unknown): value is TripDay {
  return value === 1 || value === 2 || value === 3;
}

function isValidItineraryCategory(value: unknown): value is ItineraryCategory {
  return typeof value === 'string' && VALID_ITINERARY_CATEGORIES.has(value as ItineraryCategory);
}

function sanitizeSafeImageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = sanitizeTextInput(value);
  if (!trimmed) {
    return undefined;
  }
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  ) {
    return trimmed.slice(0, 300);
  }
  return undefined;
}

export function validateItineraryInput(input: ItineraryItemInput): ItineraryValidationResult {
  const sanitizedTime = sanitizeTextInput(typeof input.time === 'string' ? input.time : '');
  const sanitizedLocation = sanitizeTextInput(
    typeof input.location === 'string' ? input.location : '',
  );
  const sanitizedActivity = sanitizeTextInput(
    typeof input.activity === 'string' ? input.activity : '',
  );
  const sanitizedMemo = sanitizeTextInput(
    typeof input.memo === 'string' ? input.memo : '',
    { multiline: true },
  );

  const errors: ItineraryValidationErrors = {};

  if (!sanitizedTime) {
    errors.time = '시간을 입력해 주세요.';
  }

  if (!sanitizedLocation) {
    errors.location = '방문 장소를 입력해 주세요. (공백만 입력할 수 없습니다.)';
  } else if (sanitizedLocation.length > INPUT_LIMITS.ITINERARY_LOCATION_MAX) {
    errors.location = '방문 장소는 100자 이하로 입력해 주세요.';
  }

  if (!sanitizedActivity) {
    errors.activity = '일정 제목(주요 활동)을 입력해 주세요. (공백만 입력할 수 없습니다.)';
  } else if (sanitizedActivity.length > INPUT_LIMITS.ITINERARY_ACTIVITY_MAX) {
    errors.activity = '일정 제목은 80자 이하로 입력해 주세요.';
  }

  if (sanitizedMemo.length > INPUT_LIMITS.ITINERARY_MEMO_MAX) {
    errors.memo = '상세 메모는 300자 이하로 입력해 주세요.';
  }

  const sanitizedImageUrl = sanitizeSafeImageUrl(input.imageUrl);
  const sanitizedImageAlt =
    typeof input.imageAlt === 'string' ? sanitizeTextInput(input.imageAlt) : undefined;
  const sanitizedTransitHint =
    typeof input.transitHint === 'string' ? sanitizeTextInput(input.transitHint) : undefined;

  const sanitized: ItineraryItemInput = {
    day: isValidTripDay(input.day) ? input.day : 1,
    time: sanitizedTime,
    location: sanitizedLocation,
    activity: sanitizedActivity,
    memo: sanitizedMemo,
    ...(isValidItineraryCategory(input.category) ? { category: input.category } : {}),
    ...(sanitizedImageUrl ? { imageUrl: sanitizedImageUrl } : {}),
    ...(sanitizedImageAlt ? { imageAlt: sanitizedImageAlt } : {}),
    ...(sanitizedTransitHint ? { transitHint: sanitizedTransitHint } : {}),
  };

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export function validateNoticeInput(input: NoticeUpdateInput): NoticeValidationResult {
  const sanitizedTitle = sanitizeTextInput(typeof input.title === 'string' ? input.title : '');
  const sanitizedContent = sanitizeTextInput(
    typeof input.content === 'string' ? input.content : '',
    { multiline: true },
  );

  const errors: NoticeValidationErrors = {};

  if (!sanitizedTitle) {
    errors.title = '공지 제목을 입력해 주세요. (공백만 입력할 수 없습니다.)';
  } else if (sanitizedTitle.length > INPUT_LIMITS.NOTICE_TITLE_MAX) {
    errors.title = '공지 제목은 80자 이하로 입력해 주세요.';
  }

  if (!sanitizedContent) {
    errors.content = '공지 내용을 입력해 주세요. (공백만 입력할 수 없습니다.)';
  } else if (sanitizedContent.length > INPUT_LIMITS.NOTICE_CONTENT_MAX) {
    errors.content = '공지 내용은 500자 이하로 입력해 주세요.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      title: sanitizedTitle,
      content: sanitizedContent,
    },
  };
}

function sanitizeStoredItineraryItem(candidate: unknown): ItineraryItem | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const item = candidate as Partial<ItineraryItem>;
  const id = normalizeStoredString(item.id, 80);
  if (!id || !isValidTripDay(item.day)) {
    return null;
  }

  const time = normalizeStoredString(item.time, 20, { fallback: '00:00' });
  const location = normalizeStoredString(item.location, INPUT_LIMITS.ITINERARY_LOCATION_MAX);
  const activity = normalizeStoredString(item.activity, INPUT_LIMITS.ITINERARY_ACTIVITY_MAX);
  const memo = normalizeStoredString(item.memo, INPUT_LIMITS.ITINERARY_MEMO_MAX, {
    multiline: true,
  });

  const imageUrl = sanitizeSafeImageUrl(item.imageUrl);
  const imageAlt =
    typeof item.imageAlt === 'string' ? normalizeStoredString(item.imageAlt, 120) : undefined;
  const transitHint =
    typeof item.transitHint === 'string'
      ? normalizeStoredString(item.transitHint, 120)
      : undefined;

  return {
    id,
    day: item.day,
    time,
    location,
    activity,
    memo,
    ...(isValidItineraryCategory(item.category) ? { category: item.category } : {}),
    ...(imageUrl ? { imageUrl } : {}),
    ...(imageAlt ? { imageAlt } : {}),
    ...(transitHint ? { transitHint } : {}),
  };
}

function sanitizeStoredNotice(rawNotice: NoticeItem): NoticeItem {
  return {
    id: normalizeStoredString(rawNotice.id, 80, { fallback: 'notice-main' }),
    title: normalizeStoredString(rawNotice.title, INPUT_LIMITS.NOTICE_TITLE_MAX, {
      fallback: '공지사항',
    }),
    content: normalizeStoredString(rawNotice.content, INPUT_LIMITS.NOTICE_CONTENT_MAX, {
      multiline: true,
      fallback: '등록된 공지 내용이 없습니다.',
    }),
    updatedAt: normalizeStoredString(rawNotice.updatedAt, 64, {
      fallback: new Date().toISOString(),
    }),
  };
}

function sanitizeStoredChecklistItem(candidate: unknown): ChecklistItem | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const item = candidate as Partial<ChecklistItem>;
  const id = normalizeStoredString(item.id, 80);
  if (!id) {
    return null;
  }

  const label = normalizeStoredString(item.label, 120, { fallback: '준비물 항목' });
  const category =
    typeof item.category === 'string' ? normalizeStoredString(item.category, 40) : undefined;

  return {
    id,
    label,
    completed: Boolean(item.completed),
    ...(category ? { category } : {}),
  };
}

function sanitizeStoredTripMeta(rawMeta: TripMeta): TripMeta {
  return {
    title: normalizeStoredString(rawMeta.title, 100, { fallback: '여행 일정' }),
    destination: normalizeStoredString(rawMeta.destination, 100),
    durationLabel: normalizeStoredString(rawMeta.durationLabel, 40),
    startDate: normalizeStoredString(rawMeta.startDate, 30),
    endDate: normalizeStoredString(rawMeta.endDate, 30),
    dayLabels: {
      1: normalizeStoredString(rawMeta.dayLabels?.[1], 40, { fallback: 'Day 1' }),
      2: normalizeStoredString(rawMeta.dayLabels?.[2], 40, { fallback: 'Day 2' }),
      3: normalizeStoredString(rawMeta.dayLabels?.[3], 40, { fallback: 'Day 3' }),
    },
  };
}

export function sanitizeStoredState(raw: TravelPlannerState): TravelPlannerState {
  const sanitizedItinerary = raw.itinerary
    .map((item) => sanitizeStoredItineraryItem(item))
    .filter((item): item is ItineraryItem => item !== null);

  const sanitizedChecklist = raw.checklist
    .map((item) => sanitizeStoredChecklistItem(item))
    .filter((item): item is ChecklistItem => item !== null);

  return {
    ...raw,
    tripMeta: sanitizeStoredTripMeta(raw.tripMeta),
    itinerary: sanitizedItinerary,
    notice: sanitizeStoredNotice(raw.notice),
    checklist: sanitizedChecklist,
  };
}

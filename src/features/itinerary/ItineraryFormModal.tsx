import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  ItineraryCategory,
  ItineraryItem,
  ItineraryItemInput,
  TripDay,
} from '../../types/travel';

interface ItineraryFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialDay: TripDay;
  editingItem: ItineraryItem | null;
  onClose: () => void;
  onSubmit: (input: ItineraryItemInput) => void;
}

const TRIP_DAYS: readonly TripDay[] = [1, 2, 3];

const ITINERARY_CATEGORIES: readonly ItineraryCategory[] = [
  '공항/교통',
  '숙소',
  '관광',
  '야경/식사',
  '맛집/카페',
  '쇼핑',
  '기타',
];

export function ItineraryFormModal({
  isOpen,
  mode,
  initialDay,
  editingItem,
  onClose,
  onSubmit,
}: ItineraryFormModalProps) {
  const [day, setDay] = useState<TripDay>(initialDay);
  const [time, setTime] = useState('10:00');
  const [category, setCategory] = useState<ItineraryCategory>('관광');
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'edit' && editingItem) {
      setDay(editingItem.day);
      setTime(editingItem.time);
      setCategory(editingItem.category ?? '관광');
      setLocation(editingItem.location);
      setActivity(editingItem.activity);
      setMemo(editingItem.memo);
    } else {
      setDay(initialDay);
      setTime('10:00');
      setCategory('관광');
      setLocation('');
      setActivity('');
      setMemo('');
    }
  }, [isOpen, mode, editingItem, initialDay]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      day,
      time,
      category,
      location,
      activity,
      memo,
      ...(mode === 'edit' && editingItem?.imageUrl
        ? { imageUrl: editingItem.imageUrl }
        : {}),
      ...(mode === 'edit' && editingItem?.imageAlt
        ? { imageAlt: editingItem.imageAlt }
        : {}),
      ...(mode === 'edit' && editingItem?.transitHint
        ? { transitHint: editingItem.transitHint }
        : {}),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-sm sm:p-margin"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="itinerary-form-title"
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface-container-lowest p-space-lg pb-safe shadow-card-hover"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-surface-container-high">
          <h2
            id="itinerary-form-title"
            className="text-headline-sm text-primary font-bold"
          >
            {mode === 'add' ? '새 일정 등록' : '일정 수정'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl text-outline hover:text-primary hover:bg-surface-container-low transition-colors -mr-1.5"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <fieldset>
            <legend className="text-label-lg text-primary font-semibold mb-2">
              여행 일차
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {TRIP_DAYS.map((tripDay) => {
                const isSelected = day === tripDay;
                return (
                  <button
                    key={tripDay}
                    type="button"
                    onClick={() => setDay(tripDay)}
                    aria-pressed={isSelected}
                    className={`h-11 rounded-xl text-label-lg font-semibold transition-colors ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    }`}
                  >
                    Day {tripDay}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="itinerary-time"
                className="block text-label-lg text-primary font-semibold mb-1.5"
              >
                시간
              </label>
              <input
                id="itinerary-time"
                type="time"
                required
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full h-11 rounded-xl bg-surface-container-low border border-surface-container-high px-3.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="itinerary-category"
                className="block text-label-lg text-primary font-semibold mb-1.5"
              >
                분류 카테고리
              </label>
              <select
                id="itinerary-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ItineraryCategory)
                }
                className="w-full h-11 rounded-xl bg-surface-container-low border border-surface-container-high px-3.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
              >
                {ITINERARY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="itinerary-location"
              className="block text-label-lg text-primary font-semibold mb-1.5"
            >
              방문 장소
            </label>
            <input
              id="itinerary-location"
              type="text"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="예: 시부야 스카이"
              className="w-full h-11 rounded-xl bg-surface-container-low border border-surface-container-high px-3.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="itinerary-activity"
              className="block text-label-lg text-primary font-semibold mb-1.5"
            >
              주요 활동
            </label>
            <input
              id="itinerary-activity"
              type="text"
              required
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              placeholder="예: 도쿄 야경 감상 및 저녁 식사"
              className="w-full h-11 rounded-xl bg-surface-container-low border border-surface-container-high px-3.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="itinerary-memo"
              className="block text-label-lg text-primary font-semibold mb-1.5"
            >
              상세 메모
            </label>
            <textarea
              id="itinerary-memo"
              rows={3}
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="예약 QR 코드, 준비물, 이동 팁 등을 기록하세요"
              className="w-full rounded-xl bg-surface-container-low border border-surface-container-high p-3.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-colors resize-none"
            />
          </div>

          <div className="pt-2 pb-1 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-label-lg font-semibold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary text-label-lg font-semibold shadow-sm transition-colors"
            >
              {mode === 'add' ? '일정 등록' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

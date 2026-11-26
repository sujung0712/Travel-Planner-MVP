import { useMemo } from 'react';
import { CalendarPlus, Plus, Route } from 'lucide-react';
import { ItineraryItem, TripDay } from '../../types/travel';
import { ItineraryCard } from './ItineraryCard';

interface ItineraryTimelineProps {
  day: TripDay;
  items: ItineraryItem[];
  onAddClick: () => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (id: string) => void;
}

export function ItineraryTimeline({
  day,
  items,
  onAddClick,
  onEditItem,
  onDeleteItem,
}: ItineraryTimelineProps) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.time.localeCompare(b.time)),
    [items],
  );

  return (
    <section aria-labelledby="timeline-section-heading">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-secondary shrink-0" aria-hidden="true" />
          <h2
            id="timeline-section-heading"
            className="text-headline-sm text-primary font-bold"
          >
            오늘의 여정
          </h2>
        </div>

        <span className="inline-flex items-center rounded-full bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-1 text-label-md font-semibold">
          {sortedItems.length}개 장소
        </span>
      </div>

      {sortedItems.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-card text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-secondary flex items-center justify-center mb-3">
            <CalendarPlus className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-label-lg text-primary font-bold">
            Day {day}에 등록된 일정이 없습니다
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1 mb-4">
            새로운 장소를 추가해 오늘의 여행 동선을 채워보세요.
          </p>
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl h-11 px-4 text-label-lg font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>일정 추가</span>
          </button>
        </div>
      ) : (
        <ol className="space-y-4">
          {sortedItems.map((item, index) => {
            const isLast = index === sortedItems.length - 1;

            return (
              <li key={item.id} className="relative flex items-stretch gap-3">
                <div className="w-[56px] shrink-0 flex flex-col items-center pt-1">
                  <time className="text-headline-sm text-primary font-bold tabular-nums leading-tight">
                    {item.time}
                  </time>
                  <span
                    className="relative z-10 mt-2 w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary-fixed shrink-0"
                    aria-hidden="true"
                  />
                  {!isLast && (
                    <span
                      className="w-0.5 flex-1 bg-surface-container-high mt-1.5 -mb-5 min-h-[24px]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <ItineraryCard
                  item={item}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

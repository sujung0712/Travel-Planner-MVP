import { TripDay } from '../../types/travel';

interface DayTabsProps {
  selectedDay: TripDay;
  dayLabels: Record<TripDay, string>;
  onSelectDay: (day: TripDay) => void;
}

const TRIP_DAYS: readonly TripDay[] = [1, 2, 3];

export function DayTabs({
  selectedDay,
  dayLabels,
  onSelectDay,
}: DayTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="여행 일차 선택"
      className="grid grid-cols-3 gap-2 bg-surface-container p-1 rounded-xl"
    >
      {TRIP_DAYS.map((day) => {
        const isSelected = selectedDay === day;

        return (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectDay(day)}
            className={`min-h-[48px] rounded-lg px-2 py-2 text-center transition-all ${
              isSelected
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest/60'
            }`}
          >
            <span className="block text-label-lg font-bold leading-tight">
              Day {day}
            </span>
            <span
              className={`block text-label-sm mt-0.5 leading-tight ${
                isSelected ? 'text-on-primary/80' : 'text-outline'
              }`}
            >
              {dayLabels[day]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

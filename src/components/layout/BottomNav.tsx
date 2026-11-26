import { CalendarDays, ListChecks, Ticket, type LucideIcon } from 'lucide-react';
import { useTravelPlanner } from '../../context/TravelPlannerContext';
import { AppTab } from '../../types/travel';

interface NavTabItem {
  id: AppTab;
  label: string;
  icon: LucideIcon;
}

const NAV_TABS: readonly NavTabItem[] = [
  { id: 'itinerary', label: '일정', icon: CalendarDays },
  { id: 'notice-checklist', label: '공지·체크', icon: ListChecks },
  { id: 'voucher-sos', label: '바우처·SOS', icon: Ticket },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTravelPlanner();

  return (
    <nav
      aria-label="하단 내비게이션"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-bottom-nav"
    >
      <div className="max-w-xl md:max-w-2xl mx-auto h-16 px-margin grid grid-cols-3 items-center">
        {NAV_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-secondary font-semibold'
                  : 'text-outline hover:text-primary font-medium'
              }`}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.3 : 1.9}
                aria-hidden="true"
              />
              <span className="text-label-sm leading-none">{label}</span>
              <span
                className={`w-1 h-1 rounded-full ${
                  isActive ? 'bg-secondary' : 'bg-transparent'
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

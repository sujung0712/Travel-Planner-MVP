import { useState } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { useTravelPlanner } from '../../context/TravelPlannerContext';
import { ResetConfirmModal } from './ResetConfirmModal';

export function TopHeader() {
  const { resetToSampleData } = useTravelPlanner();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-surface-container-lowest/85 backdrop-blur-xl shadow-header">
        <div className="max-w-xl md:max-w-2xl mx-auto h-full px-margin flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Compass
              className="w-6 h-6 text-secondary shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span className="text-headline-md text-primary font-bold tracking-tight truncate">
              Travel Planner
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors shrink-0"
            aria-label="샘플 데이터 초기화"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>초기화</span>
          </button>
        </div>
      </header>

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetToSampleData}
      />
    </>
  );
}

import { useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useTravelPlanner } from '../../context/TravelPlannerContext';
import type { NoticeUpdateInput } from '../../types/travel';
import { calculateChecklistProgress } from './checklistUtils';
import { ChecklistList } from './ChecklistList';
import { ChecklistProgressCard } from './ChecklistProgressCard';
import { NoticeCard } from './NoticeCard';
import { NoticeEditModal } from './NoticeEditModal';

export function NoticeChecklistPage() {
  const { state, updateNotice, toggleChecklistItem } = useTravelPlanner();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const progress = useMemo(
    () => calculateChecklistProgress(state.checklist),
    [state.checklist],
  );

  const handleSaveNotice = (input: NoticeUpdateInput) => {
    updateNotice(input);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <header className="pt-1">
        <h1 className="text-headline-lg text-primary font-bold">공지 및 체크리스트</h1>
        <p className="text-body-sm text-outline mt-1">도쿄 2박 3일 여행 준비 현황</p>
      </header>

      <NoticeCard
        notice={state.notice}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <ChecklistProgressCard progress={progress} />

      <ChecklistList items={state.checklist} onToggle={toggleChecklistItem} />

      <aside
        aria-label="체크리스트 팁"
        className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-secondary-container/15 text-secondary flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-label-lg text-primary font-semibold">체크리스트 팁</h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            출국 전 여권·항공권·Visit Japan Web QR 등록 상태를 한 번 더 점검해 주세요.
          </p>
        </div>
      </aside>

      <NoticeEditModal
        isOpen={isEditModalOpen}
        notice={state.notice}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveNotice}
      />
    </div>
  );
}

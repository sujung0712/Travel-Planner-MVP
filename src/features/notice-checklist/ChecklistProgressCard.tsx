import type { ChecklistProgress } from '../../types/travel';

interface ChecklistProgressCardProps {
  progress: ChecklistProgress;
}

export function ChecklistProgressCard({ progress }: ChecklistProgressCardProps) {
  const { completedCount, totalCount, remainingCount, percentage } = progress;

  return (
    <section
      aria-label="체크리스트 진행 현황"
      className="bg-surface-container-lowest rounded-xl p-4 shadow-card"
    >
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-headline-sm text-primary font-bold">여행 준비물 체크리스트</h2>
          <p className="text-body-sm text-outline mt-0.5">
            총 {totalCount}개 중 {completedCount}개 완료
          </p>
        </div>

        <div className="flex items-baseline shrink-0">
          <span className="text-headline-xl text-secondary font-bold">{percentage}</span>
          <span className="text-label-lg text-secondary font-semibold ml-0.5">%</span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-label="체크리스트 완료율"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${percentage}%` }}
          className="h-full bg-secondary rounded-full transition-all duration-500"
        />
      </div>

      <div className="flex items-center gap-4 mt-3 text-body-sm text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary shrink-0" aria-hidden="true" />
          <span>완료 {completedCount}건</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-outline-variant shrink-0" aria-hidden="true" />
          <span>남음 {remainingCount}건</span>
        </span>
      </div>
    </section>
  );
}

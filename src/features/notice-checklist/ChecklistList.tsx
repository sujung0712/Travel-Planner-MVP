import type { ChecklistItem } from '../../types/travel';
import { ChecklistItemRow } from './ChecklistItemRow';

interface ChecklistListProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export function ChecklistList({ items, onToggle }: ChecklistListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 text-center shadow-card">
        <p className="text-body-md text-outline">등록된 준비물 항목이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5" aria-label="여행 준비물 목록">
      {items.map((item) => (
        <li key={item.id}>
          <ChecklistItemRow item={item} onToggle={onToggle} />
        </li>
      ))}
    </ul>
  );
}

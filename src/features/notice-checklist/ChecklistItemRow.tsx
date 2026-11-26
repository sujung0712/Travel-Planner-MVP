import { Check } from 'lucide-react';
import type { ChecklistItem } from '../../types/travel';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={item.completed}
      onClick={() => onToggle(item.id)}
      className="w-full min-h-[56px] flex items-center justify-between gap-3 text-left bg-surface-container-lowest rounded-xl p-4 shadow-card hover:shadow-card-hover active:scale-[0.99] transition-all"
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            item.completed
              ? 'bg-secondary text-on-secondary'
              : 'bg-surface-container-high border border-outline-variant/40 text-transparent'
          }`}
          aria-hidden="true"
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </span>

        <span
          className={`text-body-md transition-colors break-words ${
            item.completed ? 'line-through text-outline' : 'text-primary font-medium'
          }`}
        >
          {item.label}
        </span>
      </span>

      {item.category ? (
        <span
          className={`shrink-0 text-label-sm rounded-full px-2.5 py-1 transition-colors ${
            item.completed
              ? 'bg-surface-container text-on-surface-variant'
              : 'bg-surface-container-high text-primary'
          }`}
        >
          {item.category}
        </span>
      ) : null}
    </button>
  );
}

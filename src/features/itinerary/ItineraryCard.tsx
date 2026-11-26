import { useEffect, useState } from 'react';
import { Pencil, StickyNote, Train, Trash2 } from 'lucide-react';
import { ItineraryItem } from '../../types/travel';

interface ItineraryCardProps {
  item: ItineraryItem;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (id: string) => void;
}

export function ItineraryCard({ item, onEdit, onDelete }: ItineraryCardProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item.imageUrl]);

  const showImage = Boolean(item.imageUrl) && !imageError;

  return (
    <div className="flex-1 min-w-0">
      <article className="bg-surface-container-lowest rounded-xl p-space-md shadow-card hover:shadow-card-hover transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {item.category && (
              <span className="inline-flex items-center rounded-md bg-surface-container-high text-primary px-2 py-0.5 text-label-sm font-semibold mb-1.5">
                {item.category}
              </span>
            )}
            <h3 className="text-label-lg text-primary font-bold leading-snug break-words">
              {item.location}
            </h3>
          </div>

          <div className="flex items-center gap-0.5 shrink-0 -mr-1.5 -mt-1">
            <button
              type="button"
              onClick={() => onEdit(item)}
              aria-label="일정 수정"
              title="수정"
              className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-outline hover:text-secondary hover:bg-surface-container-low transition-colors"
            >
              <Pencil className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              aria-label="일정 삭제"
              title="삭제"
              className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-outline hover:text-error hover:bg-error-container/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="text-body-md text-primary font-semibold mt-1 mb-2.5 break-words">
          {item.activity}
        </p>

        {showImage && (
          <div className="h-32 sm:h-40 w-full rounded-lg overflow-hidden mb-2.5 bg-surface-container-low">
            <img
              src={item.imageUrl}
              alt={item.imageAlt ?? item.location}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {item.memo && (
          <div className="bg-surface-container-low rounded-lg p-2.5 flex items-start gap-2">
            <StickyNote
              className="w-4 h-4 text-secondary shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-body-sm text-on-surface-variant break-words">
              {item.memo}
            </p>
          </div>
        )}
      </article>

      {item.transitHint && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container-low border border-surface-container-high px-3 py-1 text-label-sm text-on-surface-variant">
          <Train className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
          <span>{item.transitHint}</span>
        </div>
      )}
    </div>
  );
}

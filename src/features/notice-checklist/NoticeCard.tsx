import { Clock, Megaphone, Pencil } from 'lucide-react';
import type { NoticeItem } from '../../types/travel';
import { formatNoticeTimestamp } from './checklistUtils';

interface NoticeCardProps {
  notice: NoticeItem;
  onEditClick: () => void;
}

export function NoticeCard({ notice, onEditClick }: NoticeCardProps) {
  const formattedTime = formatNoticeTimestamp(notice.updatedAt);

  return (
    <section
      aria-label="여행 공지"
      className="bg-surface-container-low rounded-xl p-4 shadow-card"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 bg-secondary-container/15 text-secondary text-label-md rounded-full px-2.5 py-1">
          <Megaphone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>여행 공지</span>
        </span>

        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 bg-surface-container-lowest text-on-surface-variant hover:text-primary text-label-md rounded-lg px-3 py-1.5 shadow-sm transition-colors"
        >
          <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>공지 수정</span>
        </button>
      </div>

      <h2 className="text-headline-sm text-primary font-bold mb-1.5">{notice.title}</h2>
      <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-line mb-3">
        {notice.content}
      </p>

      <div className="flex items-center gap-1.5 text-label-sm text-outline">
        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>최근 수정: {formattedTime}</span>
      </div>
    </section>
  );
}

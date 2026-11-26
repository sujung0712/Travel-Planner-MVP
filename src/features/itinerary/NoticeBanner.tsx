import { ChevronRight, Megaphone } from 'lucide-react';
import { NoticeItem } from '../../types/travel';

interface NoticeBannerProps {
  notice: NoticeItem;
  onClick: () => void;
}

export function NoticeBanner({ notice, onClick }: NoticeBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`공지사항 보기: ${notice.title}`}
      className="w-full text-left bg-surface-container-low hover:bg-surface-container rounded-xl p-space-sm sm:p-3 shadow-card transition-colors flex items-start gap-2.5 group"
    >
      <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-surface-container-highest text-secondary px-2.5 py-1 text-label-sm font-semibold mt-0.5">
        <Megaphone className="w-3.5 h-3.5" aria-hidden="true" />
        <span>공지</span>
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-body-sm text-on-surface line-clamp-2 leading-relaxed">
          {notice.content}
        </p>
      </div>

      <ChevronRight
        className="w-4 h-4 text-outline group-hover:text-secondary shrink-0 mt-1 transition-colors"
        aria-hidden="true"
      />
    </button>
  );
}

import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { NoticeItem, NoticeUpdateInput } from '../../types/travel';

interface NoticeEditModalProps {
  isOpen: boolean;
  notice: NoticeItem;
  onClose: () => void;
  onSave: (input: NoticeUpdateInput) => void;
}

export function NoticeEditModal({
  isOpen,
  notice,
  onClose,
  onSave,
}: NoticeEditModalProps) {
  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content);

  useEffect(() => {
    if (isOpen) {
      setTitle(notice.title);
      setContent(notice.content);
    }
  }, [isOpen, notice.title, notice.content]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ title, content });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-edit-modal-title"
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-surface-container-lowest p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="notice-edit-modal-title" className="text-headline-sm text-primary font-bold">
            공지 수정
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="notice-title-input"
              className="block text-label-md text-on-surface-variant mb-1.5"
            >
              공지 제목
            </label>
            <input
              id="notice-title-input"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="공지 제목을 입력하세요"
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="notice-content-input"
              className="block text-label-md text-on-surface-variant mb-1.5"
            >
              공지 내용
            </label>
            <textarea
              id="notice-content-input"
              rows={4}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="공지 내용을 입력하세요"
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container text-label-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container text-label-lg transition-colors shadow-sm"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

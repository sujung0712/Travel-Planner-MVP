import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { NoticeItem, NoticeUpdateInput } from '../../types/travel';
import {
  INPUT_LIMITS,
  NoticeValidationErrors,
  NoticeValidationField,
  sanitizeTextInput,
  validateNoticeInput,
} from '../../utils/validation';

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
  const [errors, setErrors] = useState<NoticeValidationErrors>({});

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      return;
    }

    setErrors({});
    setTitle(notice.title);
    setContent(notice.content);
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

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const clearFieldError = (field: NoticeValidationField) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const titleLength = sanitizeTextInput(title).length;
  const contentLength = sanitizeTextInput(content, { multiline: true }).length;

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateNoticeInput({ title, content });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSave(result.sanitized);
  };

  const getFieldBorderClass = (hasError: boolean): string =>
    hasError
      ? 'border-error focus:border-error focus:ring-error/25'
      : 'border-outline-variant/60 focus:border-secondary focus:ring-secondary/20';

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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="notice-title-input"
                className="block text-label-md text-on-surface-variant"
              >
                공지 제목
              </label>
              <span
                className={`text-label-sm tabular-nums ${
                  titleLength > INPUT_LIMITS.NOTICE_TITLE_MAX
                    ? 'text-error font-semibold'
                    : 'text-outline'
                }`}
              >
                {titleLength} / {INPUT_LIMITS.NOTICE_TITLE_MAX}자
              </span>
            </div>
            <input
              id="notice-title-input"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                clearFieldError('title');
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'notice-title-error' : undefined}
              placeholder="공지 제목을 입력하세요"
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-colors ${getFieldBorderClass(Boolean(errors.title))}`}
            />
            {errors.title && (
              <p
                id="notice-title-error"
                role="alert"
                className="mt-1.5 text-label-sm text-error"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="notice-content-input"
                className="block text-label-md text-on-surface-variant"
              >
                공지 내용
              </label>
              <span
                className={`text-label-sm tabular-nums ${
                  contentLength > INPUT_LIMITS.NOTICE_CONTENT_MAX
                    ? 'text-error font-semibold'
                    : 'text-outline'
                }`}
              >
                {contentLength} / {INPUT_LIMITS.NOTICE_CONTENT_MAX}자
              </span>
            </div>
            <textarea
              id="notice-content-input"
              rows={4}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                clearFieldError('content');
              }}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? 'notice-content-error' : undefined}
              placeholder="공지 내용을 입력하세요"
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 transition-colors resize-none ${getFieldBorderClass(Boolean(errors.content))}`}
            />
            {errors.content && (
              <p
                id="notice-content-error"
                role="alert"
                className="mt-1.5 text-label-sm text-error"
              >
                {errors.content}
              </p>
            )}
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

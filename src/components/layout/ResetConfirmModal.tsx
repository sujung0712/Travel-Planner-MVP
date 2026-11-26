import { useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) {
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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-margin"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-confirm-title"
        aria-describedby="reset-confirm-description"
        className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-card-hover"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-xl bg-error-container/70 text-error flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl text-outline hover:text-primary hover:bg-surface-container-low transition-colors -mr-1.5 -mt-1.5"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <h2
          id="reset-confirm-title"
          className="text-headline-sm text-primary font-bold mt-3"
        >
          샘플 데이터를 초기화할까요?
        </h2>
        <p
          id="reset-confirm-description"
          className="text-body-md text-on-surface-variant mt-2"
        >
          추가하거나 수정한 일정, 공지사항, 체크리스트 진행 상태가 기본 도쿄 2박
          3일 샘플 데이터로 되돌아갑니다.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-label-lg font-semibold transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 rounded-xl bg-error hover:bg-error/90 text-on-error text-label-lg font-semibold transition-colors"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

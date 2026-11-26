import { useEffect } from 'react';
import { FileText, MapPin, Sun, X } from 'lucide-react';
import { VoucherItem } from '../../types/travel';
import { QrCodeSvg } from './QrCodeSvg';

interface VoucherQrModalProps {
  voucher: VoucherItem | null;
  onClose: () => void;
}

export function VoucherQrModal({ voucher, onClose }: VoucherQrModalProps) {
  useEffect(() => {
    if (!voucher) {
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
  }, [voucher, onClose]);

  if (!voucher) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voucher-qr-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div
          className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mb-4"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="QR 바우처 모달 닫기"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="text-center mb-5 pr-4 pl-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold mb-2.5">
            디지털 탑승·입장권
          </span>

          <h2
            id="voucher-qr-modal-title"
            className="text-headline-md text-primary font-bold leading-snug mb-1.5"
          >
            {voucher.title}
          </h2>

          <p className="text-body-sm text-on-surface-variant">
            예약 번호:{' '}
            <span className="font-mono font-semibold text-primary select-all">
              {voucher.reservationCode}
            </span>
          </p>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center justify-center mb-4">
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-card mb-3.5">
            <QrCodeSvg payload={voucher.qrPayload} size={184} />
          </div>

          <div className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant">
            <Sun className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
            <span>화면 밝기를 최대로 설정하세요</span>
          </div>
        </div>

        <div className="bg-surface-container-low/70 rounded-xl p-3.5 space-y-2 mb-5">
          <div className="flex items-start gap-2.5">
            <MapPin
              className="w-4 h-4 text-secondary shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-label-sm text-on-surface-variant">장소</p>
              <p className="text-body-sm text-primary font-medium break-words">
                {voucher.location}
              </p>
            </div>
          </div>

          {voucher.notes ? (
            <div className="flex items-start gap-2.5 pt-1 border-t border-surface-container">
              <FileText
                className="w-4 h-4 text-secondary shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-label-sm text-on-surface-variant">이용 안내</p>
                <p className="text-body-sm text-on-surface break-words">{voucher.notes}</p>
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary-container text-on-primary h-12 rounded-xl text-label-lg font-semibold transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

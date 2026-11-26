import { useEffect, useRef, useState } from 'react';
import { CarTaxiFront, Check, Copy, MapPin, Sun, X } from 'lucide-react';
import { TaxiCardHotelInfo } from '../../types/travel';

interface TaxiCardModalProps {
  isOpen: boolean;
  hotel: TaxiCardHotelInfo;
  onClose: () => void;
}

export function TaxiCardModal({ isOpen, hotel, onClose }: TaxiCardModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  const copyTimerRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = null;
      }
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  const handleCopyAddress = async () => {
    const fullAddress = `${hotel.postalCode} ${hotel.japaneseAddress}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullAddress);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullAddress;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2000);
    } catch {
      // Clipboard API may be unavailable or denied in restricted environments.
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/70 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="taxi-card-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[430px] bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4">
        <div
          className="w-12 h-1.5 bg-outline-variant/60 rounded-full mx-auto"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-2xl bg-primary text-[#ffcc00] flex items-center justify-center shrink-0 shadow-card"
              aria-hidden="true"
            >
              <CarTaxiFront className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-1">
              <h2
                id="taxi-card-modal-title"
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-on-primary text-label-md font-bold"
              >
                현지어 택시 카드
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                기사님께 이 화면을 직접 보여주세요
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-primary-container text-on-primary rounded-2xl p-4 border-l-4 border-secondary-container space-y-1.5">
          <p
            lang="ja"
            className="text-[18px] sm:text-[19px] font-bold leading-snug break-keep"
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            {hotel.driverPhraseJapanese}
          </p>
          <p className="text-body-sm text-primary-fixed-dim">{hotel.driverPhraseKorean}</p>
        </div>

        <section
          aria-label="목적지 숙소 정보"
          className="bg-surface-container-lowest rounded-2xl border-2 border-surface-dim p-4 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-label-md text-secondary font-bold">목적지 / 目的地</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold">
              투숙 예정 숙소
            </span>
          </div>

          <p
            lang="ja"
            className="text-[30px] sm:text-[32px] font-black leading-tight text-primary break-keep pt-0.5"
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            {hotel.japaneseName}
          </p>

          <p className="text-[19px] font-bold text-secondary leading-snug">
            {hotel.englishName}
          </p>

          <p className="text-body-md text-on-surface-variant">{hotel.koreanName}</p>
        </section>

        <section
          aria-label="숙소 주소"
          className="bg-surface-container-low rounded-2xl border border-surface-dim p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-label-md text-primary font-bold">住所 (일본어 주소)</span>
            <button
              type="button"
              onClick={() => {
                void handleCopyAddress();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-secondary border border-surface-container-high text-label-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>주소 복사</span>
                </>
              )}
            </button>
          </div>

          <p
            lang="ja"
            className="text-[20px] sm:text-[22px] font-extrabold leading-snug text-primary bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high break-keep select-all"
            style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
          >
            {hotel.postalCode}
            <br />
            {hotel.japaneseAddress}
          </p>

          <div className="space-y-1">
            <p className="text-label-sm text-on-surface-variant font-semibold">
              English Address
            </p>
            <p className="text-[15px] font-semibold text-on-surface leading-snug break-words">
              {hotel.englishAddress}
            </p>
          </div>

          <div className="bg-surface-container-lowest px-3 py-2 rounded-xl border border-surface-container-high text-label-md text-on-surface flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
            <span>{hotel.landmarkNote}</span>
          </div>
        </section>

        <div className="flex items-center justify-center gap-1.5 text-label-md text-on-surface-variant px-2">
          <Sun className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
          <span>야간이나 어두운 차내에서는 화면 밝기를 최대로 올려주세요</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-[52px] rounded-2xl bg-primary hover:bg-primary-container text-on-primary text-label-lg font-semibold transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          확인 후 카드 닫기
        </button>
      </div>
    </div>
  );
}

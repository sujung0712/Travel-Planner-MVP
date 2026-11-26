import { useEffect, useRef } from 'react';
import { Headphones, Info, Phone, PhoneOff, Siren, X } from 'lucide-react';
import { SosEmergencyData } from '../../types/travel';

interface EmergencySosModalProps {
  isOpen: boolean;
  sosData: SosEmergencyData;
  onClose: () => void;
}

export function EmergencySosModal({ isOpen, sosData, onClose }: EmergencySosModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
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
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-primary/70 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
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
              className="w-11 h-11 rounded-2xl bg-error-container text-error flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Siren className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2
                id="sos-modal-title"
                className="text-headline-md text-primary font-bold leading-snug"
              >
                긴급 SOS
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                긴급 상황 시 아래 버튼을 눌러 바로 전화하세요
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

        {/* Card 1: Travel Guide (SAMPLE — strictly disabled, never a tel: link) */}
        <section
          aria-label="담당 여행 가이드 연락처"
          className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container text-on-primary-fixed-variant text-label-sm font-semibold">
              샘플 번호
            </span>
            <span className="text-label-sm text-on-surface-variant font-medium">
              가이드 연락처
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-headline-sm text-primary font-bold">{sosData.guide.name}</h3>
            <p className="text-headline-md text-on-surface-variant font-bold tabular-nums">
              {sosData.guide.phone}
            </p>
          </div>

          <p className="text-body-sm text-on-surface-variant bg-surface-container-lowest/80 rounded-xl px-3 py-2 border border-surface-container">
            ※ {sosData.guide.note}
          </p>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full h-[52px] rounded-xl bg-surface-container text-outline cursor-not-allowed flex items-center justify-center gap-2 text-label-lg font-semibold px-4"
          >
            <PhoneOff className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>가이드 전화 (샘플 번호 · 발신 비활성화)</span>
          </button>
        </section>

        {/* Card 2: Japanese Police (OFFICIAL — tel:110) */}
        <section
          aria-label="일본 현지 경찰 신고"
          className="bg-surface-container-lowest rounded-2xl p-4 border-2 border-error-container shadow-card space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-semibold">
              공식 긴급번호
            </span>
            <span className="text-label-sm text-error font-semibold">24시간 긴급출동</span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <h3 className="text-headline-sm text-primary font-bold">
                {sosData.police.name}
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {sosData.police.description}
              </p>
            </div>
            <span className="text-headline-xl text-error font-bold tabular-nums shrink-0 leading-none">
              {sosData.police.phone}
            </span>
          </div>

          <a
            href={sosData.police.telHref}
            className="w-full h-[52px] rounded-xl bg-error hover:opacity-95 text-on-error flex items-center justify-center gap-2 text-label-lg font-bold shadow-card transition-opacity active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
          >
            <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>110 바로 전화</span>
          </a>
        </section>

        {/* Card 3: Embassy of the Republic of Korea in Japan (OFFICIAL) */}
        <section
          aria-label="주일본 대한민국 대사관 연락처"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high shadow-card space-y-3"
        >
          <div className="space-y-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">
              외교부 공식 연락처
            </span>
            <h3 className="text-headline-sm text-primary font-bold">
              {sosData.embassy.name}
            </h3>
          </div>

          <div className="space-y-2.5">
            {sosData.embassy.numbers.map((line) => (
              <div
                key={line.id}
                className={`rounded-xl p-3 flex items-center justify-between gap-3 ${
                  line.isUrgent
                    ? 'bg-error-container/50 border border-error-container'
                    : 'bg-surface-container-low'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-label-lg text-primary font-bold leading-snug">
                    {line.label}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">{line.subLabel}</p>
                  <p
                    className={`text-label-lg font-bold tabular-nums mt-0.5 ${
                      line.isUrgent ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {line.phone}
                  </p>
                </div>

                <a
                  href={line.telHref}
                  aria-label={`${sosData.embassy.name} ${line.label} ${line.phone} 전화 연결`}
                  className={`min-h-[44px] min-w-[44px] px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-label-md font-bold shrink-0 transition-opacity active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    line.isUrgent
                      ? 'bg-error text-on-error hover:opacity-95 focus-visible:ring-error'
                      : 'bg-secondary text-on-secondary hover:bg-secondary-container focus-visible:ring-secondary'
                  }`}
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>전화</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Card 4: MOFA Consular Call Center 24h (OFFICIAL) */}
        <section
          aria-label="외교부 영사콜센터"
          className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high shadow-card space-y-3"
        >
          <div className="space-y-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold">
              24시간 한국어 상담
            </span>
            <h3 className="text-headline-sm text-primary font-bold">
              {sosData.consularCallCenter.name}
            </h3>
            <p className="text-headline-md text-secondary font-bold tabular-nums">
              {sosData.consularCallCenter.phone}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              {sosData.consularCallCenter.description}
            </p>
          </div>

          <a
            href={sosData.consularCallCenter.telHref}
            className="w-full h-[52px] rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary flex items-center justify-center gap-2 text-label-lg font-bold transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <Headphones className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>영사콜센터 바로 전화</span>
          </a>
        </section>

        <div className="bg-surface-container-low rounded-xl p-3 flex items-start gap-2 text-label-sm text-on-surface-variant leading-relaxed">
          <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            경찰·대사관 번호는 일본 경찰청 및 외교부(mofa.go.kr) 공식 출처 기준이며,
            가이드 번호는 샘플입니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-[52px] rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-lg font-semibold transition-colors active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

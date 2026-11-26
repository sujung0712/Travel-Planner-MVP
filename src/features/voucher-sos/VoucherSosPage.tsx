import { useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useTravelPlanner } from '../../context/TravelPlannerContext';
import { VoucherItem } from '../../types/travel';
import { EmergencyContactList } from './EmergencyContactList';
import { ReservationSummarySection } from './ReservationSummarySection';
import { VoucherCard } from './VoucherCard';
import { VoucherQrModal } from './VoucherQrModal';

export function VoucherSosPage() {
  const { state } = useTravelPlanner();
  const { vouchers, reservations, emergencyContacts } = state;
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(null);

  return (
    <div className="space-y-6 pb-6">
      <header className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-headline-lg text-primary font-bold">바우처 및 긴급정보</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
            동기화 완료
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          도쿄 2박 3일 예약 증빙 및 기본 연락처
        </p>
      </header>

      <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl bg-surface-container-lowest text-secondary flex items-center justify-center shadow-card shrink-0"
          aria-hidden="true"
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-label-md text-primary font-bold">오프라인 저장 완료</p>
          <p className="text-body-sm text-on-surface-variant">
            인터넷 연결 없이도 QR 바우처 조회가 가능합니다
          </p>
        </div>
      </div>

      <section aria-labelledby="voucher-list-heading" className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 id="voucher-list-heading" className="text-headline-sm text-primary font-bold">
            내 예약 바우처
          </h2>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-label-sm font-semibold">
            {vouchers.length}건
          </span>
        </div>

        <div className="space-y-3">
          {vouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              onOpenQr={setSelectedVoucher}
            />
          ))}
        </div>
      </section>

      <ReservationSummarySection reservations={reservations} />

      <EmergencyContactList contacts={emergencyContacts} />

      <footer className="bg-surface-container-low/80 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-body-sm text-on-surface-variant leading-relaxed">
          공항 탑승 수속 및 호텔 체크인 시 여권 원본과 예약 번호를 함께 제시해 주세요.
          분실에 대비해 여권 사본과 주요 바우처 캡처를 기기에 보관하면 더욱 안전합니다.
        </p>
      </footer>

      <VoucherQrModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </div>
  );
}

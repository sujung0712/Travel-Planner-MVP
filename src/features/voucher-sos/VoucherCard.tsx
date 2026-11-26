import { Building2, Plane, QrCode, Ticket, TrainFront } from 'lucide-react';
import { VoucherCategory, VoucherItem } from '../../types/travel';

interface VoucherCardProps {
  voucher: VoucherItem;
  onOpenQr: (voucher: VoucherItem) => void;
}

function getCategoryIcon(category: VoucherCategory) {
  switch (category) {
    case 'FLIGHT':
      return Plane;
    case 'HOTEL':
      return Building2;
    case 'TRANSPORT':
      return TrainFront;
    case 'TICKET':
      return Ticket;
  }
}

export function VoucherCard({ voucher, onOpenQr }: VoucherCardProps) {
  const CategoryIcon = getCategoryIcon(voucher.category);

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary text-label-sm font-semibold">
          <CategoryIcon className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
          {voucher.categoryLabel}
        </span>

        <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
          {voucher.statusLabel}
        </span>
      </div>

      <h3 className="text-headline-sm text-primary font-bold mb-1 leading-snug">
        {voucher.title}
      </h3>
      <p className="text-body-sm text-on-surface-variant mb-3">{voucher.provider}</p>

      <dl className="bg-surface-container-low p-3.5 rounded-xl space-y-2 mb-3.5">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-label-md text-on-surface-variant shrink-0">예약 번호</dt>
          <dd className="text-body-sm font-mono font-semibold text-primary select-all text-right">
            {voucher.reservationCode}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-3">
          <dt className="text-label-md text-on-surface-variant shrink-0">이용 정보</dt>
          <dd className="text-body-sm text-on-surface text-right">{voucher.validDate}</dd>
        </div>

        <div className="flex items-start justify-between gap-3">
          <dt className="text-label-md text-on-surface-variant shrink-0">장소</dt>
          <dd className="text-body-sm text-on-surface text-right">{voucher.location}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onOpenQr(voucher)}
        aria-label={`${voucher.title} QR 코드 확인`}
        className="w-full bg-primary hover:bg-primary-container text-on-primary h-11 rounded-xl text-label-md font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
      >
        <QrCode className="w-4 h-4" aria-hidden="true" />
        <span>QR 코드 확인</span>
      </button>
    </article>
  );
}

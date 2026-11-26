import { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, Plane, Ticket } from 'lucide-react';
import { ReservationInfo, ReservationType } from '../../types/travel';

interface ReservationSummarySectionProps {
  reservations: ReservationInfo[];
}

function getReservationMeta(type: ReservationType) {
  switch (type) {
    case 'FLIGHT':
      return { Icon: Plane, label: '항공' };
    case 'ACCOMMODATION':
      return { Icon: Building2, label: '숙소' };
    case 'OTHER':
      return { Icon: Ticket, label: '기타' };
  }
}

export function ReservationSummarySection({ reservations }: ReservationSummarySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (reservations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="reservation-summary-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2
            id="reservation-summary-heading"
            className="text-headline-sm text-primary font-bold"
          >
            예약 상세 정보
          </h2>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-surface-container text-primary text-label-sm font-semibold">
            {reservations.length}건
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-label-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
        >
          <span>{isOpen ? '접기' : '펼치기'}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
          {reservations.map((reservation) => {
            const { Icon, label } = getReservationMeta(reservation.type);
            return (
              <article
                key={reservation.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-card"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-label-sm font-semibold text-secondary">
                        {label}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-low text-primary font-mono text-label-sm font-semibold select-all">
                        {reservation.reservationNumber}
                      </span>
                    </div>

                    <h3 className="text-label-lg text-primary font-bold leading-snug">
                      {reservation.title}
                    </h3>

                    <p className="text-body-sm text-on-surface font-medium">
                      {reservation.schedule}
                    </p>

                    <p className="text-body-sm text-on-surface-variant">
                      {reservation.detail}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

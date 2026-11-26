import {
  Headphones,
  HeartPulse,
  Landmark,
  Phone,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import { EmergencyCategory, EmergencyContact } from '../../types/travel';

interface EmergencyContactListProps {
  contacts: EmergencyContact[];
}

function getContactBadgeStyle(category: EmergencyCategory) {
  switch (category) {
    case 'POLICE':
      return {
        Icon: ShieldAlert,
        containerClass: 'bg-surface-container text-primary',
      };
    case 'MEDICAL':
      return {
        Icon: HeartPulse,
        containerClass: 'bg-error-container/50 text-error',
      };
    case 'EMBASSY':
      return {
        Icon: Landmark,
        containerClass: 'bg-secondary-fixed/70 text-on-secondary-fixed-variant',
      };
    case 'SUPPORT':
      return {
        Icon: Headphones,
        containerClass: 'bg-surface-container-low text-primary',
      };
  }
}

function formatTelHref(phone: string): string {
  const normalized = phone.replace(/[^+\d]/g, '');
  return `tel:${normalized}`;
}

export function EmergencyContactList({ contacts }: EmergencyContactListProps) {
  if (contacts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="emergency-contacts-heading" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="emergency-contacts-heading"
            className="text-headline-sm text-primary font-bold"
          >
            기본 비상연락처
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            터치 시 바로 음성 통화로 연결됩니다
          </p>
        </div>

        <div
          className="w-9 h-9 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <PhoneCall className="w-4 h-4" />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden divide-y divide-surface-container-low">
        {contacts.map((contact) => {
          const { Icon, containerClass } = getContactBadgeStyle(contact.category);

          return (
            <a
              key={contact.id}
              href={formatTelHref(contact.phone)}
              aria-label={`${contact.name} ${contact.phone} 전화 연결`}
              className="group flex items-center gap-3.5 p-4 hover:bg-surface-container-low/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${containerClass}`}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-label-lg text-primary font-bold">
                    {contact.name}
                  </span>
                  {contact.badgeText ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-medium">
                      {contact.badgeText}
                    </span>
                  ) : null}
                </div>

                <p className="text-body-sm text-on-surface-variant truncate mt-0.5">
                  {contact.description}
                </p>

                <p className="text-label-lg text-secondary font-semibold tabular-nums mt-1">
                  {contact.phone}
                </p>
              </div>

              <div
                className="w-10 h-10 rounded-full bg-surface-container-low text-secondary group-hover:bg-secondary group-hover:text-on-secondary flex items-center justify-center shrink-0 transition-colors"
                aria-hidden="true"
              >
                <Phone className="w-4 h-4" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

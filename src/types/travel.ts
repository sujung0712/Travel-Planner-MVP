export const STORAGE_KEY = 'travel-planner-mvp:v1';
export const SCHEMA_VERSION = 1;

export type AppTab = 'itinerary' | 'notice-checklist' | 'voucher-sos';
export type TripDay = 1 | 2 | 3;

export interface TripMeta {
  title: string;
  destination: string;
  durationLabel: string;
  startDate: string;
  endDate: string;
  dayLabels: Record<TripDay, string>;
}

export type ItineraryCategory =
  | '공항/교통'
  | '숙소'
  | '관광'
  | '야경/식사'
  | '맛집/카페'
  | '쇼핑'
  | '기타';

export interface ItineraryItem {
  id: string;
  day: TripDay;
  time: string;
  location: string;
  activity: string;
  memo: string;
  category?: ItineraryCategory;
  imageUrl?: string;
  imageAlt?: string;
  transitHint?: string;
}

export type ItineraryItemInput = Omit<ItineraryItem, 'id'>;

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface NoticeUpdateInput {
  title: string;
  content: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category?: string;
}

export interface ChecklistProgress {
  completedCount: number;
  totalCount: number;
  remainingCount: number;
  percentage: number;
}

export type VoucherCategory = 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'TICKET';

export interface VoucherItem {
  id: string;
  title: string;
  provider: string;
  category: VoucherCategory;
  categoryLabel: string;
  statusLabel: string;
  reservationCode: string;
  validDate: string;
  location: string;
  qrPayload: string;
  notes?: string;
}

export type ReservationType = 'FLIGHT' | 'ACCOMMODATION' | 'OTHER';

export interface ReservationInfo {
  id: string;
  type: ReservationType;
  title: string;
  reservationNumber: string;
  schedule: string;
  detail: string;
}

export type EmergencyCategory = 'POLICE' | 'MEDICAL' | 'EMBASSY' | 'SUPPORT';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string;
  badgeText?: string;
  category: EmergencyCategory;
}

export interface TravelPlannerState {
  schemaVersion: number;
  tripMeta: TripMeta;
  itinerary: ItineraryItem[];
  notice: NoticeItem;
  checklist: ChecklistItem[];
  vouchers: VoucherItem[];
  reservations: ReservationInfo[];
  emergencyContacts: EmergencyContact[];
}

export interface TravelPlannerContextValue {
  state: TravelPlannerState;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  addItineraryItem: (input: ItineraryItemInput) => void;
  updateItineraryItem: (id: string, input: ItineraryItemInput) => void;
  deleteItineraryItem: (id: string) => void;
  updateNotice: (input: NoticeUpdateInput) => void;
  toggleChecklistItem: (id: string) => void;
  resetToSampleData: () => void;
}

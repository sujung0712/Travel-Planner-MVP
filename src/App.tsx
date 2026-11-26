import { AppLayout } from './components/layout/AppLayout';
import { useTravelPlanner } from './context/TravelPlannerContext';
import { TravelPlannerProvider } from './context/TravelPlannerProvider';
import { ItineraryPage } from './features/itinerary';
import { NoticeChecklistPage } from './features/notice-checklist';
import { VoucherSosPage } from './features/voucher-sos';

function AppShell() {
  const { activeTab } = useTravelPlanner();

  return (
    <AppLayout>
      {activeTab === 'itinerary' && <ItineraryPage />}
      {activeTab === 'notice-checklist' && <NoticeChecklistPage />}
      {activeTab === 'voucher-sos' && <VoucherSosPage />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <TravelPlannerProvider>
      <AppShell />
    </TravelPlannerProvider>
  );
}

import { useMemo, useState } from 'react';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { useTravelPlanner } from '../../context/TravelPlannerContext';
import {
  ItineraryItem,
  ItineraryItemInput,
  TripDay,
} from '../../types/travel';
import { DayTabs } from './DayTabs';
import { ItineraryFormModal } from './ItineraryFormModal';
import { ItineraryTimeline } from './ItineraryTimeline';
import { NoticeBanner } from './NoticeBanner';

export function ItineraryPage() {
  const {
    state,
    setActiveTab,
    addItineraryItem,
    updateItineraryItem,
    deleteItineraryItem,
  } = useTravelPlanner();

  const [selectedDay, setSelectedDay] = useState<TripDay>(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  const dayItems = useMemo(
    () => state.itinerary.filter((item) => item.day === selectedDay),
    [state.itinerary, selectedDay],
  );

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: ItineraryItem) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmitForm = (input: ItineraryItemInput) => {
    if (editingItem) {
      updateItineraryItem(editingItem.id, input);
    } else {
      addItineraryItem(input);
    }
    setSelectedDay(input.day);
    handleCloseFormModal();
  };

  return (
    <div className="space-y-space-md">
      <section className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-headline-lg text-primary font-bold tracking-tight break-words">
            {state.tripMeta.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1">
              <MapPin
                className="w-3.5 h-3.5 text-secondary shrink-0"
                aria-hidden="true"
              />
              <span>{state.tripMeta.destination}</span>
            </span>
            <span aria-hidden="true" className="text-outline">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar
                className="w-3.5 h-3.5 text-secondary shrink-0"
                aria-hidden="true"
              />
              <span>{state.tripMeta.durationLabel}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="shrink-0 inline-flex items-center gap-1 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl h-11 px-4 text-label-lg font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>일정 추가</span>
        </button>
      </section>

      <NoticeBanner
        notice={state.notice}
        onClick={() => setActiveTab('notice-checklist')}
      />

      <DayTabs
        selectedDay={selectedDay}
        dayLabels={state.tripMeta.dayLabels}
        onSelectDay={setSelectedDay}
      />

      <ItineraryTimeline
        day={selectedDay}
        items={dayItems}
        onAddClick={handleOpenAddModal}
        onEditItem={handleOpenEditModal}
        onDeleteItem={deleteItineraryItem}
      />

      <ItineraryFormModal
        isOpen={isFormModalOpen}
        mode={editingItem ? 'edit' : 'add'}
        initialDay={selectedDay}
        editingItem={editingItem}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
}

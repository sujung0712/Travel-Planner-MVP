import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppTab,
  ItineraryItemInput,
  NoticeUpdateInput,
  TravelPlannerState,
} from '../types/travel';
import { loadTravelState, resetTravelState, saveTravelState } from '../utils/storage';
import { TravelPlannerContext } from './TravelPlannerContext';

interface TravelPlannerProviderProps {
  children: ReactNode;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function TravelPlannerProvider({ children }: TravelPlannerProviderProps) {
  const [state, setState] = useState<TravelPlannerState>(() => loadTravelState());
  const [activeTab, setActiveTab] = useState<AppTab>('itinerary');

  useEffect(() => {
    saveTravelState(state);
  }, [state]);

  const addItineraryItem = useCallback((input: ItineraryItemInput) => {
    setState((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          ...input,
          id: createId('itn'),
        },
      ],
    }));
  }, []);

  const updateItineraryItem = useCallback((id: string, input: ItineraryItemInput) => {
    setState((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item) =>
        item.id === id ? { ...item, ...input, id } : item,
      ),
    }));
  }, []);

  const deleteItineraryItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((item) => item.id !== id),
    }));
  }, []);

  const updateNotice = useCallback((input: NoticeUpdateInput) => {
    setState((prev) => ({
      ...prev,
      notice: {
        ...prev.notice,
        title: input.title,
        content: input.content,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const toggleChecklistItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    }));
  }, []);

  const resetToSampleData = useCallback(() => {
    const fresh = resetTravelState();
    setState(fresh);
  }, []);

  const value = useMemo(
    () => ({
      state,
      activeTab,
      setActiveTab,
      addItineraryItem,
      updateItineraryItem,
      deleteItineraryItem,
      updateNotice,
      toggleChecklistItem,
      resetToSampleData,
    }),
    [
      state,
      activeTab,
      addItineraryItem,
      updateItineraryItem,
      deleteItineraryItem,
      updateNotice,
      toggleChecklistItem,
      resetToSampleData,
    ],
  );

  return (
    <TravelPlannerContext.Provider value={value}>
      {children}
    </TravelPlannerContext.Provider>
  );
}

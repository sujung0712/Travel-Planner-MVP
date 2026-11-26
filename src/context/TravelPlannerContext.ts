import { createContext, useContext } from 'react';
import { TravelPlannerContextValue } from '../types/travel';

export const TravelPlannerContext = createContext<TravelPlannerContextValue | null>(null);

export function useTravelPlanner(): TravelPlannerContextValue {
  const context = useContext(TravelPlannerContext);
  if (!context) {
    throw new Error('useTravelPlanner must be used within a TravelPlannerProvider');
  }
  return context;
}

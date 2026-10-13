import { createContext, useContext } from 'react';

export const EventClock = createContext(null);

// A shared snapshot keeps build HTML and the first hydration render identical.
export function useEventDate () {
  return useContext(EventClock) || new Date();
}

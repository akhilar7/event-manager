import { writable } from 'svelte/store';

// Define the Event type
export type Event = {
  id: number;          // Add an ID property for API interactions
  name: string;
  date: string;
  time: string;        // Added time property
  country: string;     // Added country property
  state: string;       // Added state property
  description: string;
  done: boolean;       // Property to track if an event is done
};

// Create a writable store to hold the events
export const events = writable<Event[]>([]);

// Function to fetch events from the API
export const fetchEvents = async () => {
  const response = await fetch('http://localhost:3000/events');
  const data: Event[] = await response.json();
  events.set(data);
};

// Function to add an event
export const addEvent = async (newEvent: Omit<Event, 'id'>) => {
  const response = await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...newEvent, done: false }), // Set done to false for new events
  });

  if (response.ok) {
    const addedEvent: Event = await response.json();
    events.update((currentEvents) => [...currentEvents, addedEvent]);
  }
};

// Function to update an event
export const updateEvent = async (updatedEvent: Event) => {
  const response = await fetch(`http://localhost:3000/events/${updatedEvent.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedEvent),
  });

  if (response.ok) {
    events.update((currentEvents) => {
      return currentEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
    });
  }
};

// Function to delete an event
export const deleteEvent = async (id: number) => {
  await fetch(`http://localhost:3000/events/${id}`, {
    method: 'DELETE',
  });

  events.update((currentEvents) => {
    return currentEvents.filter(event => event.id !== id);
  });
};

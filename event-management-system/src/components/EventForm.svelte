<script lang="ts">
  import { addEvent } from '../stores/eventStore';
  import type { Event } from '../stores/eventStore';

  let name: string = '';
  let date: string = '';
  let time: string = '';        // Add time binding
  let country: string = '';     // Add country binding
  let state: string = '';       // Add state binding
  let description: string = '';

  const submitEvent = () => {
    const newEvent: Omit<Event, 'id'> & { done: boolean } = { 
      name, 
      date, 
      time, 
      country, 
      state, 
      description, 
      done: false // Set done to false for new events
    };
    addEvent(newEvent);

    // Clear the form
    name = '';
    date = '';
    time = '';
    country = '';
    state = '';
    description = '';
  };
</script>

<form on:submit|preventDefault={submitEvent}>
  <input type="text" placeholder="Event Name" bind:value={name} required />
  <input type="date" bind:value={date} required />
  <input type="time" bind:value={time} required /> <!-- Add time input -->
  <input type="text" placeholder="Country" bind:value={country} required /> <!-- Add country input -->
  <input type="text" placeholder="State" bind:value={state} required /> <!-- Add state input -->
  <textarea placeholder="Description" bind:value={description} required></textarea>
  <button type="submit">Add Event</button>
</form>

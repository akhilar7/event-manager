<script lang="ts">
  import { events, fetchEvents, deleteEvent, updateEvent } from '../stores/eventStore'; // Import the event store functions
  import { get } from 'svelte/store';
  import type { Event } from '../stores/eventStore';  // Import Event type
  import { onMount } from 'svelte';  // For component lifecycle methods

  let eventList = get(events);
  let editingIndex: number | null = null;
  let editedEvent: Event = { id: 0, name: '', date: '', time: '', country: '', state: '', description: '', done: false }; // Include id

  // Define countries and their states
  const countries: { [key: string]: string[] } = {
    USA: ['California', 'Texas', 'Florida', 'New York'],
    Canada: ['Ontario', 'Quebec', 'British Columbia'],
    India: ['Maharashtra', 'Tamil Nadu', 'Karnataka'],
  };

  let selectedCountry: string = '';  // Store the selected country
  let selectedState: string = '';  // Store the selected state
  let states: string[] = [];  // Initialize the states array

  // When a country is selected, update the states dropdown
  function updateStates() {
    if (selectedCountry) {
      states = countries[selectedCountry] || [];
    } else {
      states = [];
    }
    selectedState = '';  // Reset state selection when country changes
  }

  // Mark an event as done
  function toggleDone(index: number) {
    events.update((currentEvents: Event[]) => {
      currentEvents[index].done = !currentEvents[index].done;
      return currentEvents;
    });
  }

  // Remove an event
  async function removeEvent(index: number) {
    const eventToDelete = eventList[index];
    await deleteEvent(eventToDelete.id);  // Call the delete function
  }

  // Set the event to be edited
  function editEvent(index: number) {
    editingIndex = index;
    editedEvent = { ...$events[index] };  // Spread operator to copy event data
    selectedCountry = editedEvent.country;  // Set selected country
    selectedState = editedEvent.state;      // Set selected state
    updateStates();                         // Update states based on selected country
  }

  // Save the edited event
  async function saveEditedEvent() {
    if (editingIndex !== null) {
      await updateEvent({ ...editedEvent, country: selectedCountry, state: selectedState }); // Update with selected country and state
      editingIndex = null;  // Clear editing index
    }
  }

  // Cancel the edit operation
  function cancelEdit() {
    editingIndex = null;
    selectedCountry = '';  // Clear selection
    selectedState = '';    // Clear selection
  }

  // Fetch events on component mount
  onMount(fetchEvents); // Fetch events when component mounts
</script>

<!-- Display the list of events -->
<ul>
  {#each $events as event, index}
    {#if editingIndex === index}
      <!-- Edit form for the event -->
      <li>
        <input type="text" bind:value={editedEvent.name} placeholder="Event Name" />
        <input type="date" bind:value={editedEvent.date} />
        <input type="time" bind:value={editedEvent.time} />

        <!-- Country dropdown -->
        <select bind:value={selectedCountry} on:change={updateStates}>
          <option value="">Select Country</option>
          {#each Object.keys(countries) as country}
            <option value={country}>{country}</option>
          {/each}
        </select>

        <!-- State dropdown (populated based on selected country) -->
        <select bind:value={selectedState}>
          <option value="">Select State</option>
          {#each states as state}
            <option value={state}>{state}</option>
          {/each}
        </select>

        <textarea bind:value={editedEvent.description} placeholder="Event Description"></textarea>

        <button on:click={saveEditedEvent}>Save</button>
        <button on:click={cancelEdit}>Cancel</button>
      </li>
    {:else}
      <!-- Regular display of the event -->
      <li class="{event.done ? 'done' : ''}">
        <strong>{event.name}</strong> - {event.date} at {event.time} in {event.country}, {event.state}
        <p>{event.description}</p>
        <button on:click={() => toggleDone(index)}>
          {event.done ? 'Mark as Not Done' : 'Mark as Done'}
        </button>
        <button on:click={() => editEvent(index)}>Edit</button>
        <button on:click={() => removeEvent(index)}>Remove</button>
      </li>
    {/if}
  {/each}
</ul>

<!-- Styles -->
<style>
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  li.done {
    text-decoration: line-through;
    color: #888;
  }

  button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  input, textarea, select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
</style>

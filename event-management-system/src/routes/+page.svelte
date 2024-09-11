<script lang="ts">
  import EventList from '../components/EventList.svelte';  // Import EventList component
  import { events } from '../stores/eventStore';  // Import events store
  import Confetti from 'canvas-confetti';  // Confetti animation
  import type { Event } from '../stores/eventStore';  // Import Event type
  import { onMount } from 'svelte';  // To fetch events on page load

  // Form input variables
  let eventName = '';
  let eventDate = '';
  let eventTime = '';  // New time input
  let eventDescription = '';

  // Countries and their states
  const countries: { [key: string]: string[] } = {
    USA: ['California', 'Texas', 'Florida', 'New York'],
    Canada: ['Ontario', 'Quebec', 'British Columbia'],
    India: ['Maharashtra', 'Tamil Nadu', 'Karnataka'],
  };

  let selectedCountry: string = '';  // Store selected country
  let selectedState: string = '';  // Store selected state
  let states: string[] = [];  // Initialize states array

  // Update the states when a country is selected
  function updateStates() {
    if (selectedCountry) {
      states = countries[selectedCountry] || [];
    } else {
      states = [];
    }
    selectedState = '';  // Reset state selection when the country changes
  }

  // Fetch events from API on page load
  onMount(async () => {
    const response = await fetch('http://localhost:3000/events');
    const data = await response.json();
    events.set(data);  // Update the event store with fetched data
  });

  // Confetti effect on event addition
  function triggerConfetti() {
    Confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  // Add a new event (also send the event to the API)
  async function addEvent() {
    if (eventName && eventDate && eventTime && selectedCountry && selectedState && eventDescription) {
      const newEvent = {
        name: eventName,
        date: eventDate,
        time: eventTime,  // Include time in event
        country: selectedCountry,  // Include selected country
        state: selectedState,  // Include selected state
        description: eventDescription,
        done: false  // Default event status as not completed
      };

      // Send the new event to the API
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        events.update((currentEvents: Event[]) => [...currentEvents, addedEvent]);

        // Clear the form after event addition
        eventName = '';
        eventDate = '';
        eventTime = '';  // Clear time field
        selectedCountry = '';  // Clear country selection
        selectedState = '';  // Clear state selection
        eventDescription = '';

        // Trigger confetti
        triggerConfetti();
      } else {
        console.error('Failed to add event:', response.statusText);
      }
    }
  }
</script>

<!-- Header Section -->
<header class="header">
  <div class="logo">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi4lHP28WmlJTSb290Aw8AGB0XitmuGyMQajgkOgvpDlW5zWhPPvwLPeKRCGZ1_xbeoNc&usqp=CAU" alt="Event Manager Logo" />
  </div>
  <div class="title-container">
    <h1>Event Manager</h1>
    <p>Your one-stop solution for managing all your events!</p>
  </div>
</header>

<!-- Main Form Section -->
<main>
  <form on:submit|preventDefault={addEvent}>
    <input type="text" bind:value={eventName} placeholder="Event Name" required />
    <input type="date" bind:value={eventDate} required />

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

    <!-- Time input -->
    <input type="time" bind:value={eventTime} required />

    <textarea bind:value={eventDescription} placeholder="Event Description" required></textarea>
    <button type="submit" class="add-event-button">Add Event</button>
  </form>

  <!-- Event List Component -->
  <EventList />
</main>

<!-- Footer Section -->
<footer class="footer">
  <p>&copy; 2024 Event Manager. All rights reserved.</p>
</footer>

<!-- Styles -->
<style>
  header {
    background-color: #f8f9fa;
    padding: 10px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .event-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  input, textarea, select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .logo img {
    width: 100px;
    margin-left: 20px;
  }

  .title-container {
    text-align: center;
    flex-grow: 1;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  p {
    margin: 0;
    color: #666;
  }

  main {
    max-width: 800px;
    margin: 20px auto;
  }

  form {
    margin-bottom: 20px;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .add-event-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .add-event-button:hover {
    background-color: #0056b3;
  }
</style>

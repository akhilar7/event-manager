<!-- src/App.svelte -->
<script lang="ts">
    import EventForm from './components/EventForm.svelte';
    import EventList from './components/EventList.svelte';
    
  </script>
  
  <main>
    <h1>Event Manager</h1>
    <EventForm />
    <EventList />
  </main>
  
  <style>
    /* Add your styles here */
    main {
      padding: 1em;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
  
    h1 {
      color: #333;
    }
  </style>
  
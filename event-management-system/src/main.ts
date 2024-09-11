// src/main.ts
import App from './App.svelte';
import './global.css'; // Ensure this line is present

const app = new App({
  target: document.getElementById('app')!,
});

export default app;

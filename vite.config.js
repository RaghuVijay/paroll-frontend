import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular'; // Only if using AnalogJS

export default defineConfig({
  plugins: [
    angular(), // Add Angular plugin if needed
  ],
  server: {
    allowedHosts: [
      '1b0a-103-211-17-143.ngrok-free.app', // Add your ngrok host here
    ],
    host: '0.0.0.0', // Allow connections from any host
    port: 4200, // Default port
  },
});
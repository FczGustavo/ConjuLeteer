import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      // PDF.js worker/canvas behavior is covered by browser integration tests;
      // jsdom cannot execute a real worker or rasterize a PDF page.
      exclude: ['src/services/pdfArtifacts.ts', 'src/services/questionMediaService.ts'],
      thresholds: { branches: 45, functions: 65, lines: 65, statements: 60 }
    }
  }
});

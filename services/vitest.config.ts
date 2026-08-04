import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths({root:"./"})
  ],
  resolve:{tsconfigPaths:true},
  test: {
    globals: true,
    environment: 'node',
    projects: [
      {
        extends: true,
        test: {
          name: 'local-container',
          include: ['test/local/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'cloud-e2e',
          include: ['test/e2e/**/*.ts'],
          environment: 'node',
          // Prevent hitting live cloud endpoints in parallel if tests depend on shared data state
          fileParallelism: false,
        },
      },
    ],
  },
});

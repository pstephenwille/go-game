import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths'
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv('dev', process.cwd(), ['AWS_', 'VITE_']);
console.log('%c...env', 'color:gold',  mode, env);

  return {
    resolve:
      { tsconfigPaths: true },
    test: {
      envFiles:['env.dev.local'],
      globals: true,
      environment: 'node',
      env:env,
      projects:
        [
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
    }
    ,
  }
});

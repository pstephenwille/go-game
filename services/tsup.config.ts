import { defineConfig } from 'tsup';

export default defineConfig({
  // 1. Entry point of your application
  entry: ['src/server.ts'],

  // 2. Output configurations
  outDir: 'dist',
  format: ['esm'],         // Modern ECMAScript modules format
  target: 'node23',        // Target your specific active Node.js version
  clean: true,             // Completely wipes old /dist folder before compiling

  // 3. Bundling mechanics
  bundle: true,            // Compiles internal code files into a single output file
  minify: true,            // Strips whitespace and shrinks variables for production
  sourcemap: true,         // Generates maps so stack traces map back to your raw .ts files

  // 4. Critical Backend Rule: Protect node_modules
  // Automatically excludes dependencies listed in package.json from being mangled inside the bundle
  external: [
    '@fastify/autoload',   // Must be external if you use dynamic directory scanning
    'fsevents',            // Prevents OS-specific optional dependency crashes
  ],

  // Alternative fallback to mark ALL third-party dependencies as external:
  skipNodeModulesBundle: true,
  noExternal: [/^@\//],
});

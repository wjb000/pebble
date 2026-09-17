import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const pages = process.env.GITHUB_PAGES === 'true'
const root = dirname(fileURLToPath(import.meta.url))

/** GitHub Pages only serves files that exist. Copy the SPA shell onto
 *  404.html and each client route so /pebble/sim is a real 200, not a
 *  404.html + sessionStorage hop that link checkers treat as missing. */
const PAGES_ROUTES = ['sim', 'model', 'bom', 'docs', 'specs'] as const

function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(root, 'dist')
      const index = resolve(outDir, 'index.html')
      copyFileSync(index, resolve(outDir, '404.html'))
      for (const route of PAGES_ROUTES) {
        const dir = resolve(outDir, route)
        mkdirSync(dir, { recursive: true })
        copyFileSync(index, resolve(dir, 'index.html'))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  base: pages ? '/pebble/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		frappeui(),
		vue({
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		}),

		VitePWA({
		  injectRegister: 'auto',
		  strategies: 'injectManifest',
		  srcDir: 'src',
		  filename: 'sw.ts',
		  start_url: "/",
		  scope: "/",
		  display: "fullscreen",
		  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
		  manifest: {
			name: 'Invictus LMS',
			short_name: 'LMS',
			description: 'One lms to rule them all',
			theme_color: '#ffffff',
			icons: [
			  {
				src: 'pwa-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			  },
			  {
				src: 'pwa-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			  }
			]
		  },
		  registerType: 'autoUpdate',
		  workbox: {
			globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
			runtimeCaching: [{
				  handler: 'NetworkOnly',
				  urlPattern: /\/api\/.*\/*.*/,
				  method: 'POST',
				  options: {
					backgroundSync: {
					  name: 'myQueueName',
					  options: {
						maxRetentionTime: 24 * 60
					  }
					}
				  }
				}]
		  },
		  devOptions: {
			  enabled: true,
			  type: 'module',
		  }

		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: `../lms/public/frontend`,
		emptyOutDir: true,
		commonjsOptions: {
			include: [/tailwind.config.js/, /node_modules/],
		},
		sourcemap: true,
		target: 'es2015',
		rollupOptions: {
			output: {
				manualChunks: {
					'frappe-ui': ['frappe-ui'],
				},
			},
		},
	},
	optimizeDeps: {
		include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client'],
	},
    server: {
		host: 'invictus.localhost',
		port: 8080
	}
})

import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'
import {
    VitePWA
} from 'vite-plugin-pwa'

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

			  // strategies: 'injectManifest',
			  // srcDir: 'src',
			  // filename: 'sw2.js',


            workbox: {
                runtimeCaching: [{
                    urlPattern: ({ url }) => { return true; },
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'fetch-cache',
						cacheableResponse: {
						  statuses: [0, 200], // Cache responses with status 0 (opaque) or 200 (OK)
						},
                    },
                },
				{
					urlPattern: ({ url }) => url.pathname ===  "/api/method/lms.lms.utils.get_lesson",
					handler: 'NetworkFirst',
					method: 'POST', // Specify POST requests
					options: {
					  cacheName: 'motherfuckingcache', // Cache name for POST requests
					  plugins: [
						{
						  cacheKeyWillBeUsed: async ({ request }) => {
							  console.log("[KYEGEN]: key generation goes brrr...");
							  const clonedRequest = request.clone();
							  const body = await clonedRequest.text();
							  return `${request.url}-${body}`;
						  },
						},
						{
						  fetchDidSucceed: async ({ response }) => {
							console.log("[fetch success]: idk whatsgoingon");
							const clonedResponse = response.clone();
							const headers = new Headers(clonedResponse.headers);
							headers.set('Cache-Control', 'max-age=360000'); // Custom cache duration (1 hour)
							return new Response(clonedResponse.body, {
							  status: clonedResponse.status,
							  statusText: clonedResponse.statusText,
							  headers,
							});
						  },
						},
					  ],
					},
				  },

				{
                    urlPattern: ({ url }) => { return true; },
					handler: 'NetworkFirst',
					method: 'POST', // Specify POST requests
					options: {
					  cacheName: 'post-cache-v2', // Cache name for POST requests
					  plugins: [
						{
						  cacheKeyWillBeUsed: async ({ request }) => {
							// Generate unique cache key based on URL and body
							if (request.method === 'POST') {
							  const clonedRequest = request.clone();
							  const body = await clonedRequest.text();
							  return `${request.url}-${body}`;
							}
							return request.url;
						  },
						},
						{
						  fetchDidSucceed: async ({ response }) => {
							const clonedResponse = response.clone();
							const headers = new Headers(clonedResponse.headers);
							headers.set('Cache-Control', 'max-age=360000'); // Custom cache duration (1 hour)
							return new Response(clonedResponse.body, {
							  status: clonedResponse.status,
							  statusText: clonedResponse.statusText,
							  headers,
							});
						  },
						},
					  ],
					},
				  },
				],
            },

			manifest: {
                name: 'Invictus LMS',
                short_name: 'LMS',
                description: 'One lms to rule them all',
                theme_color: '#ffffff',
                icons: [{
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                }, {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }]
            },
            registerType: 'autoUpdate',
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

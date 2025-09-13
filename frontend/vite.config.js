import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "PassOP App",          // Full name (install hone ke baad)
        short_name: "PassOP",     
        description: "Password Manager Application",
        theme_color: "#ffffff",      // Top bar white
        background_color: "#ffffff", // Splash screen bhi white
        display: "standalone",
        start_url: "./",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    host: true,
  }
})

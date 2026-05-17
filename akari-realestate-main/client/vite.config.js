import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <-- تمت إزالة الأقواس
import { VitePWA } from 'vite-plugin-pwa' // <-- صحيح

export default defineConfig({
  plugins: [
    react(),
    
    // <-- 2. إعدادات الـ PWA (مدمجة مع الـ Plugins) -->
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'ADAR - العقارية', // اسم التطبيق (يظهر لل用户 عند التثبيت)
        short_name: 'ADAR',       // الاسم القصير
        description: 'منصة البحث عن العقارات في الجزائر',
        theme_color: '#161c24',  // لون شريط الحالة في الهاتف (مناسب ثيمك الداكن)
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // تأكد من وضع هذه الصور في مجلد public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // مهم جداً لأشكال الأيقونات في أندرويد
          }
        ]
      },
      workbox: {
        // الملفات التي سيتم تخزينها مؤقتاً لتسريع الموقع
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'], 
        runtimeCaching: {
          // تخزين طلبات الـ API مؤقتاً ليعمل الموقع أسرع عند ضعف النت
          urlPattern: /^https:\/\/api\./i,
          handler: 'NetworkFirst'
        }
      }
    })
  ],

  // <-- 3. إعدادات الـ Proxy للباك إند (تبقى كما هي بدون تغيير)
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
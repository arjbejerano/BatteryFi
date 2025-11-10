/// <reference types="vite/client" />

// Global constants defined at build time
declare const __ROUTE_MESSAGING_ENABLED__: boolean;

// Environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_STRIPE_PUBLIC_KEY?: string
  readonly CDN_IMG_PREFIX?: string
  readonly VITE_ENABLE_ROUTE_MESSAGING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

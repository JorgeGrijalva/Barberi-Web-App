export {};

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface ProcessEnv {
      NEXT_PUBLIC_PROJECT_NAME: string;
      NEXT_PUBLIC_GOOGLE_MAPS_KEY: string;
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_IMAGE_URL: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_API_KEY: string;
      NEXT_PUBLIC_AUTH_DOMAIN: string;
      NEXT_PUBLIC_DEFAULT_LOCATION: string;
      NEXT_PUBLIC_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_STORAGE_BUCKET: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_MEASUREMENT_ID: string;
      NEXT_PUBLIC_APP_ID: string;
      NEXT_PUBLIC_WEBSITE_URL: string;
      NEXT_PUBLIC_UI_TYPE: string;
    }
  }
}

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  app: {
    baseURL: "/somewhere-between/",
    buildAssetsDir: "/_nuxt/",

    head: {
      title: "Somewhere Between",

      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        {
          name: "description",
          content:
            "A quiet space for moments, memories, and the gentle presence that makes ordinary days feel a little calmer.",
        },

        { name: "format-detection", content: "telephone=no" },

        // Theme color for mobile browser UI
        { name: "theme-color", content: "#0f172a" },

        // Open Graph (WhatsApp / FB preview)
        { property: "og:title", content: "Somewhere Between" },
        {
          property: "og:description",
          content:
            "A quiet space for moments, memories, and the gentle presence that makes ordinary days feel a little calmer.",
        },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: "https://kraftsman1.github.io/somewhere-between/",
        },
        {
          property: "og:image",
          content:
            "https://kraftsman1.github.io/somewhere-between/preview.jpg",
        },

        // Twitter card (used by some messengers too)
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Somewhere Between" },
        {
          name: "twitter:description",
          content:
            "A quiet space for moments, memories, and the gentle presence that makes ordinary days feel a little calmer.",
        },
        {
          name: "twitter:image",
          content:
            "https://kraftsman1.github.io/somewhere-between/preview.jpg",
        },
      ],

      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Josefin+Sans:wght@300;400;600&display=swap",
        },

        // Favicon (optional but nice)
        { rel: "icon", type: "image/png", href: "/somewhere-between/favicon.png" },
      ],
    },
  },

  nitro: {
    preset: "github-pages",
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
});

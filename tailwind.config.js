/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "infinite-scroll-2": "infinite-scroll 35s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "auth-pattern": "url(/img/login.png)",
        "curve-pattern": "url(/img/curve.png)",
        "ui-1-bg": "url(/img/ui-1-bg.webp)",
        "ui-2-bg": "url(/img/ui-2-bg.png)",
        "stories-bg": "url(/img/stories-bg.webp)",
        gift_card_bg_1: "url(/img/gift_card_bg_1.png)",
        gift_card_bg_2: "url(/img/gift_card_bg_2.png)",
        gift_card_bg_3: "url(/img/gift_card_bg_3.png)",
        gift_card_bg_4: "url(/img/gift_card_bg_4.png)",
        gift_card_bg_5: "url(/img/gift_card_bg_5.png)",
        membership_bg: "url(/img/membership_bg.png)",
        noise: "url(/img/noise.png)",
      },
      fontSize: {
        head: "26px",
      },
      colors: {
        black: "#222628",
        gray: {
          field: "#A0A09C",
          border: "#F3F3F3",
          button: "#F8F8F8",
          placeholder: "#939393",
          inputBorder: "rgba(177, 177, 177, 0.30)",
          card: "#F6F6F6",
          segment: "#F4F4F4",
          float: "#F1F1F1",
          layout: "#E2E2E2",
          orderCard: "#E8E8E8",
          bold: "#707070",
          faq: "#F7F7F5",
          progress: "#E9E9E9",
          disabledTab: "#B3B3B3",
          darkSegment: "#33393F",
          ad: "#EFEFEF",
          link: "#EAEAEA",
          bright: "#F4F4F7",
          ui4bg: "#F0EEEF",
          bg: "#F7F7F9",
        },
        dark: "#000",
        darkBg: "#18191D",
        darkBgUi3: "#383838",
        primary: {
          DEFAULT: "#BB9B6A",
          ui4OpacityBg: "#FE72004D",
          ui3OpacityBg: "#E34F260D",
          ui4PrimaryBoldBg: "#5C2F08",
        },
        blue: {
          link: "#289AB3",
        },
        yellow: {
          DEFAULT: "#FFA826",
        },
        green: {
          DEFAULT: "#16AA16",
        },
        amber: {
          button: "#F2F2E8",
        },
        red: {
          DEFAULT: "#FF2640",
        },
        footerBg: "#080210",
        giantsOrange: "#FF6016",
      },
      dropShadow: {
        "3xl": "0px 20px 40px rgba(227, 79, 38, 0.66)",
        green: "0px 11px 30px rgba(0, 142, 0, 0.18)",
        gray: "0px 12px 50px rgba(138, 138, 138, 0.25)",
        search: "0px 4px 10px rgba(160, 160, 160, 0.20)",
      },
      maxWidth: {
        compareWidth: "200px",
      },
      boxShadow: {
        select: "0px 20px 60px 0px rgba(168, 168, 169, 0.24)",
        bottom: "0 4px 2px -2px rgba(0, 0, 0, 0.3)",
        storeCard: "0px 2px 8px 0px rgba(200, 200, 200, 0.20)",
        fixedBooking: "0px 0px 30px 0px rgba(109, 109, 109, 0.32)",
        membership:
          "0px 4px 4px 0px #FFFFFF26 inset,-2px -2px 4px 0px #0000000A inset, 0px 92px 136px 0px #00000026",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      borderRadius: {
        button: "10px",
        "4xl": "30px",
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        adminpanel: {
          primary: '#5C0F8B',           // Warm orange for primary actions
          secondary: '#FF5100',         // Deep neutral gray for secondary elements
          accent: '#9d4edd',            // Elegant purple for accents
          neutral: '#6D6F70',           // Rich charcoal for neutral elements
          'base-100': '#f3f4f6',        // Soft white for base backgrounds
          info: '#16bac5',              // Fresh teal for informational elements
          success: '#4caf50',           // Classic green for success
          warning: '#f7b500',           // Golden yellow for warnings
          error: '#ff4f4f',             // Bright coral red for errors
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        'primary-hover': '#e07a3f',    // Richer orange for hover interactions
        'secondary-hover': '#374151',  // Darker gray for secondary hover
        'accent-hover': '#7c3aad',     // Darker purple for accent hover
        'neutral-hover': '#141424',    // Deeper charcoal for hover effects
        'info-hover': '#13a1ac',       // Deep teal for hover interactions
        'success-hover': '#388e3c',    // Rich green for success hover
        'warning-hover': '#d89d00',    // Deep yellow for warning hover
        'error-hover': '#e03b3b',      // Deeper coral for error hover
        'sidebar-bg': '#15151f',       // Dark charcoal for sidebar background
        'header-bg': '#232334',        // Slightly lighter charcoal for headers
        'card-bg': '#ffffff',          // Clean white for cards
        'table-header': '#e5e7eb',     // Light gray for table headers
        'table-row-hover': '#f9fafb',  // Subtle hover effect for table rows
        'border': '#d1d5db',           // Soft gray for borders
        'text-main': '#1e293b',        // Dark gray for main text
        'text-secondary': '#6b7280',   // Cool muted text for secondary info
      },
      fontFamily: {
        sans: ['Nunito', 'Arial', 'sans-serif'], // Rounded, modern sans-serif font
        mono: ['Courier New', 'monospace'],      // Monospaced font for developer tools
      },
     
    },
  },
  plugins: [require("daisyui")],
};

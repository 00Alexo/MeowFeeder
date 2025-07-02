/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MeowFeeder Custom Color Palette
        'meow': {
          'pink': '#F4B6C2',        // Pink pastel - primary brand color
          'pink-hover': '#F29CB3',  // Darker pink for hover states
          'mint': '#A3D2CA',        // Minty blue - secondary color
          'mint-hover': '#8BC7BE',  // Darker mint for hover states
          'beige': '#FFE8D6',       // Light beige - accent color
          'beige-hover': '#F5D5B8', // Darker beige for hover states
          'light-gray': '#D3D3D3',  // Light gray for neutral buttons
          'gray-hover': '#C0C0C0',  // Darker gray for hover states
        },
        // Background colors
        'bg': {
          'page': '#F8F9FA',        // Page background
          'navbar': '#F1F5F9',      // Navbar background
          'card': '#FFFFFF',        // Card/content background
          'input': '#F8FAFC',       // Input background
          'input-focus': '#FFFFFF', // Input focus background
        },
        // Text colors
        'text': {
          'primary': '#374151',     // Main headings
          'secondary': '#4B5563',   // Subheadings
          'tertiary': '#6B7280',    // Body text
          'muted': '#9CA3AF',       // Muted/footer text
          'placeholder': '#94A3B8', // Placeholder text
        },
        // Border colors
        'border': {
          'light': '#E2E8F0',       // Light borders
          'default': '#E5E7EB',     // Default borders
          'input': '#E2E8F0',       // Input borders
          'input-focus': '#F4B6C2', // Input focus borders (meow-pink)
        }
      },
      // Custom component classes
      components: {
        '.input-meow': {
          '@apply w-full px-4 py-3 bg-bg-input border border-border-input rounded-xl text-text-primary placeholder-text-placeholder transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-meow-pink/20 focus:border-meow-pink focus:bg-bg-input-focus': {},
        },
        '.input-meow-error': {
          '@apply border-red-300 focus:border-red-500 focus:ring-red-500/20': {},
        }
      },
      keyframes: {
        'input-focus': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'input-focus': 'input-focus 0.3s ease-in-out',
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
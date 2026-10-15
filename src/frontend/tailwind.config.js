/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        'surface-2': '#F1F5F9',
        border: '#E2E8F0',
        text: '#0F172A',
        muted: '#64748B',
        'muted-2': '#94A3B8',
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          soft: '#EEF2FF',
          ink: '#3730A3'
        },
        success: {
          DEFAULT: '#059669',
          soft: '#D1FAE5'
        },
        danger: {
          DEFAULT: '#E11D48',
          soft: '#FFE4E6'
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FEF3C7'
        }
      },
      borderRadius: {
        card: '14px',
        DEFAULT: '10px',
        sm: '8px'
      },
      boxShadow: {
        DEFAULT: '0 1px 2px rgba(15,23,42,.05), 0 8px 24px -12px rgba(15,23,42,.15)',
        lg: '0 24px 48px -16px rgba(15,23,42,.25)'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    
    fontFamily: {
      'logo': ['Baloo\\ Bhai\\ 2'],
      'sans': [ 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' ],
      'serif': [ 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      'mono':	[ 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier-New', 'monospace' ],
      'roboto': ['Roboto', 'Consolas']
    },
    extend: {
      colors: {
        'transparent': 'transparent',
        'white': '#ffffff',
        'black': '#000000',
        'blue': '#50c1e9',
        'purple' : '#aa55ff',
        'gray': '#f5f7fa',
        'selected-gray': '#e1e1e1',
        'selected-gray-2': '#cbcbcb', 
        'loadinggray': '#e4e7eb',
        'darkgray': '#172342',
        'transparentgray': 'rgba(0, 0, 0, 0.2)',
        'darkergray': '#6b6b6b',
        'green': '#5be7c4',
        'green-valid': '#489F2A'
      },
      animation: {
        shake: 'shake 2s 1s ease-in-out infinite'
      },
      keyframes: {
        shake: {
          '0%, 25%, 100%': { transform: 'translate(0, 0)'},
          '5%, 15%': { transform: 'translate(-3px, 0)'},
          '10%, 20%': { transform: 'translate(3px, 0)'},
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

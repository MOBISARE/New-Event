module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'black': '#000000',
      'blue': '#50c1e9',
      'purple' : '#7a57d1',
      'purple_gradient' : '#aa55ff',
      'gray': '#f5f7fa'
    },
    fontFamily: {
      'logo' : ['Baloo\\ Bhai\\ 2'],
      'sans'	: [ 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' ],
      'serif': [ 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      'mono' :	[ 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier-New', 'monospace' ],
      'roboto': ['Roboto', 'Consolas']
    },
    extend: {
    },
  },
  plugins: [],
}

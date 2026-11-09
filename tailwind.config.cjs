module.exports = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Cormorant Garamond', 'Georgia', 'serif']
          },
          colors: {
            ivory: '#FAF8F5',
            cream: '#F3EFE6',
            sage: {
              50: '#F4F7F4',
              100: '#E3EBE3',
              200: '#C5D6C6',
              500: '#5C7A60',
              600: '#49634D',
              700: '#384D3B',
              800: '#2A3A2C'
            },
            champagne: '#E8DEC8',
            gold: {
              400: '#C5A059',
              500: '#B08A43',
              600: '#8F6D2E'
            }
          }
        }
      }
    , content: ["./site/*.html", "./site/*.js"] };

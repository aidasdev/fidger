import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    purple: {
      500: '#d42aff',
      600: '#b40adf',
    },
    black: '#000',
    white: '#fff',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'Quicksand',
    body: 'Quicksand',
  },
  styles: {
    global: {},
  },
})

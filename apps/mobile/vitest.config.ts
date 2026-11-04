import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './app'),
      'react-native-svg': path.resolve(__dirname, './test/nahrady/react-native-svg.tsx'),
      'react-native': 'react-native-web',
    },
  },
})

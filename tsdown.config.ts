import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'parsers/stw/index': 'src/parsers/stw/index.ts',
  },
  dts: true,
  format: ['esm', 'cjs'],
  minify: true,
  nodeProtocol: true,
})

import typescript from '@rollup/plugin-typescript'

const OUTPUT_FOLDER = 'dist'

export default {
  input: 'src/index.ts',
  output: {
    dir: OUTPUT_FOLDER,
    format: 'cjs',
  },
  external: [],
  plugins: [typescript()],
}

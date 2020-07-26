import typescript from '@rollup/plugin-typescript'

const OUTPUT_FOLDER = 'dist'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.ts',
  output: {
    dir: OUTPUT_FOLDER,
    format: 'cjs',
  },
  external: [],
  plugins: [typescript()],
}

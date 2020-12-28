import typescript from '@rollup/plugin-typescript'

const OUTPUT_FOLDER = 'dist'

const inputFiles = ['src/index.ts', 'src/internal.ts']

// eslint-disable-next-line import/no-anonymous-default-export
export default inputFiles.map((input) => ({
  input,
  output: {
    dir: OUTPUT_FOLDER,
    format: 'cjs',
  },
  external: [],
  plugins: [typescript()],
}))

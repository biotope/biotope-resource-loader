import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';


export default [
  {
    input: 'src/ResourceLoader.ts',
    output: {
      name: 'index.cjs',
      file: 'lib/index.cjs.js',
      format: 'cjs'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.module.json' }),
      visualizer()
    ]
  },
  {
    input: 'src/ResourceLoader.ts',
    output: {
      name: 'index.esm',
      file: 'lib/index.esm.js',
      format: 'esm'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.module.json' })
    ]
  },
  // browser-friendly UMD build
  {
    input: 'src/legacy/index.ts',
    output: {
      name: 'legacy',
      file: 'dist/resourceLoader.min.js',
      format: 'umd'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.legacy.json' }),
      terser()
    ],
    watch: {
      chokidar: {},
      exclude: ['node_modules/**']
    }
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'module',
      file: 'dist/resourceLoader.module.min.js',
      format: 'umd'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.module.json' }),
      terser()
    ]
  }
];

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';


export default [
  // browser-friendly UMD build
  {
    input: 'src/ResourceLoader.ts',
    output: {
      name: 'index.cjs',
      file: 'dist/index.cjs.js',
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
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.module.json' })
    ]
  },
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
      chokidar: {
        // if the chokidar option is given, rollup-watch will
        // use it instead of fs.watch. You will need to install
        // chokidar separately.
        //
        // this options object is passed to chokidar. if you
        // don't have any options, just pass `chokidar: true`
      },
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

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';


export default [
  // browser-friendly UMD build
  {
    input: 'src/ResourceLoader.ts',
    output: {
      name: 'resourceLoader',
      file: 'dist/resourceLoader.min.js',
      format: 'umd'
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json' }),
      uglify(),
      visualizer()
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
  }
];

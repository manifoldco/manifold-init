import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'components.ts',

  external: ['@manifoldco/manifold-init', '@manifoldco/manifold-init/loader', 'react', 'react-dom'],

  plugins: [resolve(), typescript({ lib: ['es5', 'es6', 'dom'] })],

  output: [
    {
      sourcemap: 'inline',
      format: 'cjs',
      dir: 'dist',
    },
  ],
};

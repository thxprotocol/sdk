import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './dist/index.js',
  plugins: [typescript()],
  output: {
    dir: 'dist',
  },
});

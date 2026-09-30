import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const config = [
  { ignores: ['.next/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  // eslint-plugin-react's 'detect' path uses an API ESLint 10 dropped; pin it instead
  { settings: { react: { version: '19.3' } } },
];

export default config;

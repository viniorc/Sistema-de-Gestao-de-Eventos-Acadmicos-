import nextVitals from 'eslint-config-next/core-web-vitals';
const config = [
  ...nextVitals,
  { ignores: ['.next/**', 'dist/**', 'coverage/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
];
export default config;

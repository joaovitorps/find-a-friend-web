// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...tailwindcss.configs.recommended,
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/index.css',
      },
    },
  },
  {
    rules: {
      // Tailwind classes are already sorted by Biome
      'tailwindcss/classnames-order': 'off',
      // Allow custom class names used in sonner and clsx parameter
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: ['toaster', 'inputs'],
        },
      ],
      // Allow empty interfaces for RouterAppContext (used as generic constraint)
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
    },
  },
);

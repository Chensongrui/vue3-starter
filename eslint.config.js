import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/**
 * ESLint 扁平配置（flat config）
 * 文档：https://eslint.org/docs/latest/use/configure/configuration-files
 *
 * 分层：JS 基础 → TypeScript → Vue3 → 团队自定义 → Prettier（最后，关闭冲突规则）
 */
export default tseslint.config(
  // 1. 忽略目录 / 文件
  {
    ignores: [
      'dist/**',
      'public/**',
      'node_modules/**',
      '.idea/**',
      '.vscode/**',
      '.workbuddy/**',
      '**/*.min.js',
      '**/*.d.ts'
    ]
  },

  // 2. 基础 JS 规则
  js.configs.recommended,

  // 3. TypeScript 规则（非类型感知，类型检查交给 vue-tsc）
  ...tseslint.configs.recommended,

  // 4. Vue3 规则
  ...pluginVue.configs['flat/recommended'],

  // 5. 团队统一规则
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // 格式化交给 Prettier，作为 ESLint 规则报错并支持 --fix
      'prettier/prettier': 'error',

      // 通用
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },

  // 6. Vue 单文件组件：用 TS 解析器，并补齐 <script setup> 宏
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineOptions: 'readonly',
        defineModel: 'readonly',
        defineSlots: 'readonly',
        withDefaults: 'readonly'
      }
    },
    rules: {
      // index.vue / 404.vue 这类命名是合理的，不强求多单词
      'vue/multi-word-component-names': 'off',
      // 属性换行与空行由 Prettier 决定，这里让位
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'never', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: true }
      ]
    }
  },

  // 7. 构建 / 配置文件放宽限制
  {
    files: ['vite.config.ts', 'eslint.config.js', '*.config.{js,mjs,cjs,ts}'],
    rules: {
      'no-console': 'off'
    }
  },

  // 8. 必须放最后：关闭所有与 Prettier 冲突的格式化规则
  prettierConfig
)

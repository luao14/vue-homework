// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // 如果你用的是 Vue 2，请改成 'plugin:vue/essential'
    'prettier', // 必须放最后！
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    // 可选：自定义规则
    // 'vue/multi-word-component-names': 'off', // 如果你有单单词组件名（如 App.vue），可关掉
  },
};
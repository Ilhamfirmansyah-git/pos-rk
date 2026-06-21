/** @type {import('lint-staged').Config} */
module.exports = {
  '*.{ts,tsx}': (files) => {
    const nonDeclaration = files.filter((f) => !f.endsWith('.d.ts'))
    if (nonDeclaration.length === 0) return []
    return [
      `eslint --fix --max-warnings 0 ${nonDeclaration.join(' ')}`,
      `prettier --write ${nonDeclaration.join(' ')}`,
    ]
  },
  '*.{css,json,md}': ['prettier --write'],
}

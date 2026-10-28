/**
 * Keep the production application identifiers stable while giving internal
 * builds their own identifiers so they can be installed side by side.
 */
module.exports = ({ config }) => {
  const variant = process.env.APP_VARIANT ?? 'production'

  const variants = {
    development: {
      name: '爱赶集Dev',
      identifierSuffix: '.dev'
    },
    preview: {
      name: '爱赶集',
      identifierSuffix: ''
    },
    production: {
      name: '爱赶集',
      identifierSuffix: ''
    }
  }

  const selected = variants[variant] ?? variants.production
  const baseIdentifier = 'com.aiganji.app'
  const identifier = `${baseIdentifier}${selected.identifierSuffix}`

  return {
    ...config,
    name: selected.name,
    ios: {
      ...config.ios,
      bundleIdentifier: identifier
    },
    android: {
      ...config.android,
      package: identifier
    }
  }
}

const files = require.context('./apis', false, /\.json/)

export default files.keys().reduce((map, key) => {
  const [, name] = key.match(/[/\\]([^/\\]+)\.json/) || []
  map[`POST /${name}.do`] = files(key)
  return map
}, {})

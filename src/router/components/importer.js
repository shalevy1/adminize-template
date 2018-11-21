/**
 * @description create a object including all async components.
 * @param {Array} components Components path based on `/src`
 */
export default function createImporters (components) {
  const importers = {}
  components.forEach(path => {
    const chunkName = createChunkName(path)
    if (!importers[chunkName]) {
      importers[chunkName] = () => import(
        /* webpackChunkName: 'async/[request][index]' */
        `SOURCE/${createCamelPath(path.replace(/^\//, ''), 1)}`
      )
    }
  })
  return importers
}

/**
 * @description lowerCase prefix letter and uppercase every words excluded
 * first word
 * @param {String} path vue component path, based on `/src`
 * @return {String} A name used to import vue component
 */
export function createChunkName (path) {
  const normalizePathSection = path.split('/').map((pathSection, index) => {
    return index === 0
      ? pathSection.replace(/^[A-Z]/, matchKey => matchKey.toLowerCase())
      : pathSection.replace(/^[a-z]/, matchKey => matchKey.toUpperCase())
  })
  return normalizePathSection.join('')
}

/**
 * @description convert path to  camelCase path, eg. /aa/bb ---> /Aa/Bb
 * @param {String} path original path
 * @param {Number} startIndex reduce should start convert when startIndex equal
 * to current index, including prefix slash character.
 * eg. createCamelPath('aaa/bbb/ccc', 1) ==> "/aaa/Bbb/Ccc"
 * eg. createCamelPath('/aaa/bbb/ccc', 2) ==> "/aaa/Bbb/Ccc"
 */
export function createCamelPath (path, startIndex) {
  return path.split('/')
    .reduce((result, cur, currentIndex) => {
      if (!cur) return result.concat('')
      if (cur && currentIndex >= startIndex) {
        return result.concat(cur.replace(/^[a-z]/, key => key.toUpperCase()))
      }
      return result.concat(cur)
    }, [])
    .join('/')
}

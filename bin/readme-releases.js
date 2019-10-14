const fs = require('fs')
const path = require('path')

const pkg = require(path.join(process.cwd(), 'package.json'))

const readmePath = path.join(process.cwd(), 'README.md')
let readme = fs.readFileSync(readmePath).toString()
const latestRelease = `[v${pkg.version}](https://github.com/${pkg.repository}/releases/tag/v${pkg.version})`
readme = readme.replace(
  /Latest Release: .*?,/,
  `Latest Release: ${latestRelease},`
)
const majorVersion = pkg.version.split('.')[0]
const latestMajorRelease = `[v${majorVersion}.0.0](https://github.com/${pkg.repository}/releases/tag/v${majorVersion}.0.0)`
readme = readme.replace(
  /Latest Major Release: .*?,/,
  `Latest Major Release: ${latestMajorRelease},`
)
fs.writeFileSync(readmePath, readme)

console.log('Updated README.md:')
console.log(`Latest Release: ${latestRelease}`)
console.log(`Latest Major Release: ${latestMajorRelease}`)

const fs = require('node:fs')
fs.rmSync('src/_lib/', { recursive: true, force: true })
fs.cpSync('../shared/lib/', 'src/_lib/', { force: true, recursive: true })

const fs = require('fs')
fs.cpSync(`../shared/lib/`, 'src/_lib/', { force: true, recursive: true })

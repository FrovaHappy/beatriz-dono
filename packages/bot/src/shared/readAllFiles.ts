import fs from 'node:fs'

export default async function readAllFiles(path: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(path)
  for (const file of files) {
    const stat = fs.statSync(`${path}/${file}`)
    if (stat.isDirectory()) {
      readAllFiles(`${path}/${file}`, arrayOfFiles)
    } else {
      arrayOfFiles.push(`${path}/${file}`)
    }
  }
  return arrayOfFiles
}

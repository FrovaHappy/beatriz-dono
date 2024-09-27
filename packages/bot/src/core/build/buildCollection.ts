import { readdirSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Collection } from 'discord.js'
import pc from 'picocolors'

interface Base<B> {
  name: B
}
const ignoredFolders = ['.gitkeep', 'shared', '.js', '.ts']

interface BuildCollectionProps<G, T extends Base<G>> {
  srcFolder: string
  subFolders?: string
  Constructor: new (...args: any[]) => T
}
const containIgnoredFolders = new Set<string>()
function getFiles(path: string): string[] {
  try {
    const files = readdirSync(path)
    const filesFiltered = files.filter(f => ignoredFolders.every(ex => !f.endsWith(ex)))
    files.filter(f => ignoredFolders.includes(f)).forEach(f => containIgnoredFolders.add(f))
    return filesFiltered
  } catch (error) {
    return []
  }
}

/**
 * This function is used to build a collection of Builder from a specified folder.
 *
 * @template G - The type of the key in the collection.
 * @template T - The type of the values in the collection.
 */
export default async function BuildCollection<G, T extends Base<G>>(props: BuildCollectionProps<G, T>) {
  const { srcFolder, subFolders, Constructor } = props
  const collection = new Collection<G, T>()
  const mainFoldersPath = path.join(process.cwd(), 'src', srcFolder)
  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  const errorFiles: Array<{ folder: string; message: string }> = []

  console.log(`Scanning '/${pc.green(`${subFolders ? `${srcFolder}/*/${subFolders}` : srcFolder}`)}' folders:`)

  const mainFolders = getFiles(mainFoldersPath)
  if (mainFolders.length === 0) return collection

  const insertToCollection = (dir: string) => {
    try {
      const service = require(dir).default
      if (service instanceof Constructor) {
        collection.set(service.name, service)
      } else {
        throw new Error('The folder/file does not instance of Construct.')
      }
    } catch (error: any) {
      errorFiles.push({ folder: dir, message: error.message })
    }
  }
  // scan the /src/events/<event>/index.ts folder if not /src/events/<groupEvent>/<event>/<event>/index.ts
  if (!subFolders) {
    mainFolders.forEach(filename => insertToCollection(path.join(mainFoldersPath, filename)))
  } else {
    const subFoldersPath: string[] = []
    mainFolders.forEach(mainFolder => subFoldersPath.push(path.join(mainFoldersPath, mainFolder, subFolders)))

    subFoldersPath.forEach(subPath => {
      const subFoldersFiles = getFiles(subPath)
      subFoldersFiles.forEach(file => {
        const filePath = path.join(subPath, file)
        insertToCollection(filePath)
      })
    })
  }
  if (containIgnoredFolders.size > 0) {
    console.log(
      `· ${pc.yellow('[‼ warn]')} The files/folders has been ignored: ${pc.yellow(
        [...containIgnoredFolders].join(', ')
      )}.`
    )
  }
  console.log(`· ${collection.size} ${subFolders ?? srcFolder} correctly scanned.`)
  if (errorFiles.length > 0) {
    const destructuredErrorFiles = (path: string) => {
      const paths = path.split(/[\\/]+/)
      if (subFolders) return `${subFolders} → ${paths.at(-3)} → ${paths.at(-1)}`
      return paths.at(-1)
    }
    console.log(
      `· ${errorFiles.length} ${subFolders ?? srcFolder} with invalid structure:\n`,
      errorFiles
        .map(
          f =>
            `  ∷ ${pc.bold(destructuredErrorFiles(f.folder))}:\n     · folder: ${f.folder} ${pc.red(
              f.message.replaceAll('\n', '\n     ')
            )}`
        )
        .join('\n ')
    )
  }

  return collection
}

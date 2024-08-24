import { Collection } from 'discord.js'
import path from 'node:path'
import process from 'node:process'
import { readdirSync } from 'node:fs'
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

function getFiles(path: string): string[] {
  try {
    return readdirSync(path).filter(f => ignoredFolders.every(ex => !f.endsWith(ex)))
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
  console.log(pc.yellow(`· ◬ The files/folders ${ignoredFolders.join(', ')} that are in the root will be ignored.`))
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

  console.log(`· ${collection.size} ${subFolders ?? srcFolder} correctly scanned.`)
  if (errorFiles.length > 0) {
    console.log(
      `· ${errorFiles.length} ${subFolders ?? srcFolder} with invalid structure:\n`,
      errorFiles.map(f => `  ∷ ${pc.bold(f.folder)}: ${pc.red(f.message.replaceAll('\n', '\n     '))}`).join('\n ')
    )
  }

  return collection
}

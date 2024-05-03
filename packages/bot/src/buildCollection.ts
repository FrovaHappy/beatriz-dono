import { Collection } from 'discord.js'
import path from 'node:path'
import { readdirSync } from 'node:fs'

interface Base<B> {
  name: B
}

/**
 * This function is used to build a collection of Builder from a specified folder.
 *
 * @template G - The type of the key in the collection.
 * @template T - The type of the values in the collection.
 */
export default async function BuildCollection<G, T extends Base<G>>(
  pointFolder: string,
  Constructor: new (...args: any[]) => T
): Promise<Collection<G, T>> {
  const collection = new Collection<G, T>()
  const foldersPath = path.join(__dirname, pointFolder)
  const folders = ((): string[] | null => {
    try {
      return readdirSync(foldersPath)
    } catch (error) {
      return null
    }
  })()
  if (!folders) return collection

  const folderError = []
  const commandsError = []
  for (const folder of folders) {
    try {
      const command = require(path.join(foldersPath, folder)).default
      if (command instanceof Constructor) {
        collection.set(command.name, command)
      } else {
        commandsError.push(command)
      }
    } catch (error: any) {
      folderError.push({ folder, message: error.message as string })
    }
  }
  console.log(`Scanned ${pointFolder} folders:`)
  console.log(`· ${collection.size} subfolders correctly scanned.`)
  if (folderError.length > 0) {
    console.log(
      `· ${folderError.length} commands with invalid structure:\n`,
      folderError.map(f => `  ∷ ${f.folder}: ${f.message.replaceAll('\n', '\n     ')}.`).join(', ')
    )
  }
  if (commandsError.length > 0) {
    console.log(`· [WARNING] The [${commandsError.join(', ')}] commands must be an instance of Constructor.`)
  }

  return collection
}

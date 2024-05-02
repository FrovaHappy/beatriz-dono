import { Collection } from 'discord.js'
import path from 'node:path'
import { readdirSync } from 'node:fs'
import type BuildCommand from './shared/BuildCommand'
import type BuildButton from './shared/BuildButtons'
import type BuildEvent from './shared/BuildEvent'
export default async function BuildCollection<G, T>(
  pointFolder: string,
  Constructor: typeof BuildCommand | typeof BuildButton | typeof BuildEvent
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
        collection.set(command.name as G, command as T)
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
    console.log(
      `· [WARNING] The [${commandsError.join(', ')}] commands must be an instance of ${Constructor.className}.`
    )
  }

  return collection
}

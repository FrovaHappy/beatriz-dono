import { Collection } from 'discord.js'
import path from 'node:path'
import { readdirSync } from 'node:fs'
import config from './config'
export default async function BuildCollection<G, T>(pointFolder: string): Promise<Collection<G, T>> {
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
      if (config.validateCommand(command)) {
        collection.set(command.name, command)
      } else {
        commandsError.push(command)
      }
    } catch (error) {
      folderError.push(folder)
    }
  }
  console.log(`Scanned ${pointFolder} folders:`)
  console.log(`· ${collection.size} subfolders correctly scanned.`)
  if (folderError.length > 0) {
    console.log(`· [${folderError.join(', ')}] no valid command structure.`)
  }
  if (commandsError.length > 0) {
    console.log(
      `· [WARNING] The [${commandsError.join(', ')}] commands require the following ${config.commandKeys} properties.`
    )
  }

  return collection
}

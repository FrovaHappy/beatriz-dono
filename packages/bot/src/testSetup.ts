import './config'
import { syncCli } from './database/clientSQL'

export default async function setup() {
  try {
    await syncCli()
  } catch (error) {
    console.error('Database setup error:', error)
    throw error
  }
}

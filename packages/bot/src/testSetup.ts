import './config'
import { syncCli } from './database/clientSQL'
export default async function setup() {
  await syncCli()
}

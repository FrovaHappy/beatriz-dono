import './paths'
import './core/config'
import startClient from './core/client'
import { setSetting } from './core/db'

const run = async () => {
  //await setSetting({})
  await startClient()
}
run()

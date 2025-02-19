import './paths'
import './config'
import startClient from './core/client'
import getGuilds from './getGuilds'

const run = async () => {
  await getGuilds()
  await startClient()
}
run()

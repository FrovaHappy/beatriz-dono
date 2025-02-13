import './paths'
import './core/config'
import startClient from './core/client'

const run = async () => {
  //await setSetting({})
  await startClient()
}
run()

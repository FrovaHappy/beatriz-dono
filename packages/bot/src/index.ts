import './paths'
import './core/config'
import startClient from './core/client'
import { upsertSetting } from './core/setting'
;(async () => {
  await upsertSetting({})
  await startClient()
})()

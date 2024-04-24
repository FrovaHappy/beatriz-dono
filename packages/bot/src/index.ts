import startClient from './client'
import { upsertSetting } from './setting'
;(async () => {
  await upsertSetting({})
  await startClient()
})()

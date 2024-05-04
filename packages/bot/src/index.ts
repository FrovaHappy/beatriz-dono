import startClient from './client'
import { upsertSetting } from './setting'
import './paths'
;(async () => {
  await upsertSetting({})
  await startClient()
})()

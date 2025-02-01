import type { Client, ResultSet } from '@libsql/client'
const { createClient } = require('@libsql/client')

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function formatResponse<T = Record<string, any>>(response: ResultSet): Array<T> {
  const { rows, columns } = response
  const data: Array<T> = []
  for (const row of rows) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rowData: Record<string, any> = {}
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i]
    }
    data.push(rowData as T)
  }
  return data
}

const client = createClient({
  url: config.env.sql.url,
  authToken: config.env.sql.token,
  syncUrl: config.env.sql.syncUrl,
  syncInterval: 60
}) as Client

export default client

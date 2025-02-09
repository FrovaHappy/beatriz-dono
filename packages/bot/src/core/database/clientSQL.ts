import type { Client, ResultSet as Res } from '@libsql/client'
const { createClient } = require('@libsql/client')

export interface ResultSet extends Res {}
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

const Cli = createClient({
  url: config.env.sql.url,
  authToken: config.env.sql.token,
  syncUrl: config.env.sql.syncUrl,
  syncInterval: 60
}) as Client

type Value = null | string | number | bigint | ArrayBuffer | boolean
interface Execute {
  queries: string
  args?: Record<string, Value>
}

interface ErrorQuery {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any
  args: Record<string, Value>
  query: string
  fail: boolean
}

async function execute({ queries, args = {} }: Execute) {
  const arrQueries = queries.split(';')
  try {
    let result: ResultSet | undefined
    for (let i = 0; i < arrQueries.length; i++) {
      const query = arrQueries[i]
      if (query.trim() === '') continue
      result = await Cli.execute({ sql: query, args }).catch(error => {
        throw { args, query, error, fail: true, index: i }
      })
    }
    return result as ResultSet
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    if (error?.fail) throw error

    throw {
      error: error.error,
      args: error.args,
      query: error.query,
      fail: true,
      index: null
    }
  }
}
export default {
  execute
}

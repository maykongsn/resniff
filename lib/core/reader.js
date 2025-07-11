import { promises as fs } from 'fs'
import path from 'path'

const isBuildFile = (name) => name.endsWith(".bs.js")

export const readCompiledFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  const results = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name)
      return entry.isDirectory() && entry.name !== "node_modules"
        ? readCompiledFiles(fullPath)
        : entry.isFile() && isBuildFile(entry.name)
        ? fs.readFile(fullPath, 'utf-8').then((content) => [{ path: fullPath, content }])
        : []
    })
  )

  return results.flat()
}
import { promisify } from 'util'
import { exec } from 'child_process'

const exeAsync = promisify(exec)

export const build = (cwd) =>
  exeAsync('npx rescript build', { cwd }).then(() => cwd)

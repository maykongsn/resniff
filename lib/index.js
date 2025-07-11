import path from 'path';
import { findValidConfig, updateConfig } from './core/config.js';
import { build } from './core/build.js';
import { readCompiledFiles } from './core/reader.js';
import { analyzeFiles } from './analyze.js';

export const analyzeProject = (input) => {
  const projectPath = path.resolve(input)

  return findValidConfig(projectPath)
    .then((config) =>
      config
        ? updateConfig(config).then(() => projectPath)
        : Promise.reject(new Error('No valid configuration file found.'))
    )
    .then(build)
    .then((cwd) => {
      return readCompiledFiles(path.join(cwd, 'lib', 'es6'))
    })
    .then(analyzeFiles)
}
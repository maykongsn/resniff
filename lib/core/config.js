import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILES = ['rescript.json', 'bsconfig.json']
const REQUIRED_CONFIG = {
  'package-specs': {
    module: 'es6',
    'in-source': false
  },
  suffix: '.bs.js'
}

const readJson = ((path) =>
  fs.readFile(path, 'utf-8').then(JSON.parse).catch(() => null))

const writeJson = (path, data) =>
  fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8')

export const findValidConfig = async (projectPath) => {
  const attempts = await Promise.all(
    CONFIG_FILES.map(async (file) => {
      const fullPath = path.join(projectPath, file);
      const json = await readJson(fullPath);
      return json ? { configPath: fullPath, json } : null;
    })
  );
  return attempts.find(Boolean);
};

export const updateConfig = async ({ configPath, json }) => {
  const updated = {
    ...json,
    'package-specs': REQUIRED_CONFIG['package-specs'],
    suffix: REQUIRED_CONFIG.suffix
  }

  const needsUpdate = 
    JSON.stringify(json['package-specs']) !== JSON.stringify(updated['package-specs']) ||
    json.suffix !== updated.suffix

  return needsUpdate ? writeJson(configPath, updated).then(() => configPath) : configPath
}
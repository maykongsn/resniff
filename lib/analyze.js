import { parse } from "./core/parser.js"
import { analyzeFile } from "./smells/detectors.js"

export const analyzeFiles = (files) =>
  files
    .map((file) => {
      try {
        return analyzeFile(file, parse(file.content))
      } catch {
        return null
      }
    }).filter(Boolean)
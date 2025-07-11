import { detectDirectDomManipulation } from "./direct-dom-manipulation.js"
import { detectForceUpdate } from "./force-update.js"

const detectors = {
  directDomManipulation: detectDirectDomManipulation,
  forceUpdate: detectForceUpdate
}

export const analyzeFile = (file, ast) => {
  return {
    [file.path]: Object.fromEntries(
      Object.entries(detectors).map(([key, detector]) => [key, detector(file.path, ast)])
    )
  }
}
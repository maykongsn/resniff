import { detectDirectDomManipulation } from "./direct-dom-manipulation.js"
import { detectForceUpdate } from "./force-update.js"
import { detectTooManyProps } from "./too-many-props.js"

const detectors = {
  directDomManipulation: detectDirectDomManipulation,
  forceUpdate: detectForceUpdate,
  tooManyProps: detectTooManyProps
}

export const analyzeFile = (file, ast) => {
  return {
    [file.path]: Object.fromEntries(
      Object.entries(detectors).map(([key, detector]) => [key, detector(file.path, ast)])
    )
  }
}
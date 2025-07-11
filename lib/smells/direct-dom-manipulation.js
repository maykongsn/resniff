import _traverse from '@babel/traverse';
const traverse = _traverse.default;

const domBindings = {
  globalObjects: ["document", "window", "navigator", "location", "history"],
  selectors: ["getElementById", "querySelector", "querySelectorAll", "getElementsByClassName", "getElementsByTagName"],
  manipulators: ["createElement", "appendChild", "removeChild", "insertBefore", "replaceChild", "remove"],
  properties: ["innerHTML", "outerHTML", "textContent", "innerText", "style", "className", "classList"],
  eventMethods: ["addEventListener", "removeEventListener", "dispatchEvent"],
  interactionMethods: ["focus", "blur", "click", "submit", "reset"]
}

const isDomPattern = (object, property) => {
  return domBindings.globalObjects.includes(object) ||
         domBindings.selectors.includes(property) ||
         domBindings.manipulators.includes(property) ||
         domBindings.properties.includes(property) ||
         domBindings.eventMethods.includes(property) ||
         domBindings.interactionMethods.includes(property)
}

export const detectDirectDomManipulation = (filePath, ast) => {
  const results = []

  console.log(ast)
  traverse(ast, {
    MemberExpression(path) {
      const { object, property } = path.node

      if (
        object?.name && 
        property?.name && 
        isDomPattern(object.name, property.name)
      ) {
        results.push({ path: filePath })
      }
    },

    CallExpression(path) {
      const { callee } = path.node
      if (
        callee?.type === "MemberExpression" && 
        callee.object?.name && 
        callee.property?.name &&
        isDomPattern(callee.object.name, callee.property.name)
      ) {
        console.log(filePath)
        results.push({ path: filePath })
      }
    },

    AssignmentExpression(path) {
      const { left } = path.node

      if (
        left?.type === "MemberExpression" && 
        left.property?.name &&
        domBindings.properties.includes(left.property.name)
      ) {
        results.push({ path: filePath })
      }
    }
  })

  return results
}
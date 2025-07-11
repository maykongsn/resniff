
import _traverse from '@babel/traverse'
const traverse = _traverse.default

const forceUpdatePatterns = {
  methods: ["forceUpdate", "reload", "refresh"],
  locationProps: ["href", "assign", "replace"],
  objects: ["window", "location"]
}

const isForceUpdateCall = (callee) => {
  if (callee?.type !== "MemberExpression") return false

  const { object, property } = callee
  
  if (
    object?.name === "location" && 
    forceUpdatePatterns.methods.includes(property?.name)
  ) return true

  if (object?.name === 'window' && property?.name === 'location') {
    return true
  }

  if (
    callee.type === "MemberExpression" && 
    object?.object?.name === "window" &&
    property?.name === "reload"
  ) {
    return true
  }

  return false
}

const isForceUpdateAssignment = (left) => {
  if (left?.type !== "MemberExpression") return false

  const { object, property } = left

  return (object?.name === "location" && property?.name === "href") ||
         (object?.name === "window" && property?.name === "location")
}

export const detectForceUpdate = (filePath, ast) => {
  const results = []

  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node

      if (isForceUpdateCall(callee)) {
        console.log(filePath)
        results.push({ path: filePath })
      }
    },
    AssignmentExpression(path) {
      const { left } = path.node

      if (isForceUpdateAssignment(left)) {
        console.log(filePath)
        results.push({ path: filePath })
      }
    }
  })

  return results
}
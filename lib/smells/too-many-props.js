import _traverse from '@babel/traverse'
const traverse = _traverse.default

export const detectTooManyProps = (filePath, ast, threshold = 13) => {
  const hasPropsParameter = (functionNode) => {
    const [firstParam] = functionNode.params
    return firstParam?.type === 'Identifier' && firstParam.name === 'props'
  }

  const getComponentName = (path) => {
    const { parent } = path
    const nameMappers = {
      'VariableDeclarator': () => parent.id?.name,
      'AssignmentExpression': () => parent.left?.name
    }
    return nameMappers[parent.type]?.() || 'anonymous'
  }

  const collectUniqueProps = (path) => {
    const uniqueProps = new Set()
    
    path.traverse({
      MemberExpression(memberPath) {
        const { object, property } = memberPath.node
        
        if (object.type === 'Identifier' && 
            object.name === 'props' &&
            property.type === 'Identifier') {
          uniqueProps.add(property.name)
        }
      }
    })
    
    return uniqueProps
  }

  const analyzeComponent = (path, componentName) => {
    const uniqueProps = collectUniqueProps(path)
    console.log()
    return uniqueProps.size > threshold ? true : false
  }

  const checkFunction = (path, getName = () => path.node.id?.name || 'anonymous') => {
    return hasPropsParameter(path.node) 
      ? analyzeComponent(path, getName())
      : false
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      if (checkFunction(path)) {
        return { path: filePath }
      }
    },
    
    FunctionExpression(path) {
      if (checkFunction(path, () => getComponentName(path))) {
        return { path: filePath }
      }
    },

    ArrowFunctionExpression(path) {
      if (checkFunction(path, () => getComponentName(path))) {
        return { path: filePath }
      }
    }
  })
  
  return {}
}
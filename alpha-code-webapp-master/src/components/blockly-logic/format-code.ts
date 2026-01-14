import { simple as walkSimple } from 'acorn-walk'
import { parse, Node } from 'acorn'
import { generate } from 'astring'

// Define proper types for AST nodes we need to handle
interface BaseNode extends Node {
  type: string
  body?: Node | Node[]
}

interface LoopNode extends BaseNode {
  body?: Node
}

interface FunctionNode extends BaseNode {
  body?: Node
}

interface BlockStatementNode extends BaseNode {
  type: 'BlockStatement'
  body?: Node[] | Node
}

interface ExpressionStatementNode extends BaseNode {
  type: 'ExpressionStatement'
  expression: CallExpressionNode
}

interface CallExpressionNode extends BaseNode {
  type: 'CallExpression'
  callee: IdentifierNode
  arguments: Node[]
}

interface IdentifierNode extends BaseNode {
  type: 'Identifier'
  name: string
}

interface ReturnStatementNode extends BaseNode {
  type: 'ReturnStatement'
  argument: Node
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function injectLoopCheck(code: string): { result: string, checkFnName: string } {
  try {
    console.log('Injecting loop check into code:', code)
    const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' }) as Node

    const checkFnName = '_loop_check_' + randomSuffix()

    // Helper function to create a check function call node
    function createCheckCall(): ExpressionStatementNode {
      return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: checkFnName
            } as IdentifierNode,
            arguments: []
        } as unknown as CallExpressionNode
      } as unknown as ExpressionStatementNode
    }

    // Helper function to insert check at start of loop body
    function insertCheckCall(loopNode: LoopNode): void {
      if (!loopNode?.body) return

      const checkCall = createCheckCall()

      // Check if body is already a block statement
      const body = loopNode.body as BlockStatementNode
      if (body.type === 'BlockStatement' && Array.isArray(body.body)) {
        body.body.unshift(checkCall)
      } else {
        // Convert single statement body into block with check call + original statement
        loopNode.body = {
          type: 'BlockStatement',
          body: [checkCall, loopNode.body]
        } as unknown as Node
      }
    }

    // Helper function to insert check at start of function body
    function insertFunctionCheck(fnNode: FunctionNode): void {
      if (!fnNode?.body) return

      const checkCall = createCheckCall()

      // Check if function body is a block statement
      const body = fnNode.body as BlockStatementNode
      if (body.type === 'BlockStatement' && Array.isArray(body.body)) {
        body.body.unshift(checkCall)
      } else {
        // For arrow functions with expression bodies: convert to block with return statement
        const returnStatement: ReturnStatementNode = {
          type: 'ReturnStatement',
          argument: fnNode.body
        } as unknown as ReturnStatementNode
        
        fnNode.body = {
          type: 'BlockStatement',
          body: [checkCall, returnStatement]
        } as unknown as Node
      }
    }

    // Visitor to handle different types of nodes
    const visitor = {
      ForStatement(node: Node) { insertCheckCall(node as LoopNode) },
      WhileStatement(node: Node) { insertCheckCall(node as LoopNode) },
      DoWhileStatement(node: Node) { insertCheckCall(node as LoopNode) },
      ForInStatement(node: Node) { insertCheckCall(node as LoopNode) },
      ForOfStatement(node: Node) { insertCheckCall(node as LoopNode) },
      FunctionDeclaration(node: Node) { insertFunctionCheck(node as FunctionNode) },
      FunctionExpression(node: Node) { insertFunctionCheck(node as FunctionNode) },
      ArrowFunctionExpression(node: Node) { insertFunctionCheck(node as FunctionNode) }
    }

    walkSimple(ast, visitor)

    const result = generate(ast)
    console.log('Injected code with loop check:', result)
    return { result, checkFnName }
  } catch (e) {
    console.warn('injectLoopCheck fallback due to error', e)
    const fallbackName = '_loop_check_fallback'
    return { result: code, checkFnName: fallbackName }
  }
}
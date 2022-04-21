// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as server from './lib'
const open = require('open')

const PORT = 5622

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  server.init('./node_modules')

  let preview = vscode.commands.registerCommand(
    'liascript-preview.liascript-preview',
    () => {
      const file = vscode.window.activeTextEditor?.document.uri.fsPath?.replace(
        vscode.workspace.rootPath || '',
        ''
      )
      try {
        server.run(
          PORT,
          'localhost',
          vscode.workspace.rootPath,
          undefined,
          true,
          false,
          false
        )
        console.warn('Server starting')
      } catch (e: any) {
        console.warn('Server already started: ', e.message)
      }

      if (file) {
        open(
          `http://localhost:${PORT}/liascript/index.html?http://localhost:${PORT}/${file}`
        )
      } else {
        open(`http://localhost:${PORT}`)
      }
    }
  )

  context.subscriptions.push(preview)

  let test = vscode.commands.registerCommand(
    'liascript-preview.liascript-test',
    () => {
      const file = vscode.window.activeTextEditor?.document.uri.fsPath?.replace(
        vscode.workspace.rootPath || '',
        ''
      )
      try {
        server.run(
          PORT,
          'localhost',
          vscode.workspace.rootPath,
          undefined,
          true,
          false,
          true
        )
      } catch (e) {}

      if (file) {
        open(
          `https://liascript.github.io/course/?http://localhost:${PORT}/${file}`
        )
      } else {
        open(`http://localhost:${PORT}`)
      }
    }
  )

  context.subscriptions.push(test)
}

// this method is called when your extension is deactivated
export function deactivate() {
  //server.stop()
}
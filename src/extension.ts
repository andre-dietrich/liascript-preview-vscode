// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as cp from 'child_process'
const open = require('open')

const PORT = 5601

var server: cp.ChildProcess | undefined

const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    console.log('Execute:', cmd)
    server = cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err)
      }
      return resolve(out)
    })
  })

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let preview = vscode.commands.registerCommand(
    'liascript-preview.liascript-preview',
    () => {
      execShell(
        `node node_modules/@liascript/devserver/dist/index.js --live --node_modules ./node_modules -p ${PORT} -i ${vscode.workspace.rootPath}`
      ).then((output) => {
        console.warn(output)
      })

      const file = vscode.window.activeTextEditor?.document.uri.fsPath?.replace(
        vscode.workspace.rootPath || '',
        ''
      )

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
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (server) {
    process.kill(server.pid)
  }
}

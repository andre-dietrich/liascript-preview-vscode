// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as server from './lib'
const open = require('open')
const portfinder = require('portfinder')

var PORT = 8080

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  server.init('./node_modules')

  portfinder.getPort(function (err: any, port: number) {
    console.log('found free port: ', port)
    PORT = port
  })

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'liascript-preview.liascript-preview',
      () => {
        startPreview(true, false)
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'liascript-preview.liascript-preview-live',
      () => {
        startPreview(true, true)
      }
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('liascript-preview.liascript-test', () => {
      startPreview(false, false)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('liascript-preview.liascript-stop', () => {
      deactivate()
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {
  server.stop()
  vscode.window.showInformationMessage(`LiaScript-DevServer terminated`)
}

function startPreview(previewMode: boolean, liveMode: boolean) {
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
      liveMode,
      false,
      false
    )

    vscode.window.showInformationMessage(
      `Started LiaScript-DevServer ${
        liveMode ? '(in live mode)' : ''
      } at: http://localhost:${PORT}`
    )
  } catch (e: any) {
    console.log('Server already started: ', e.message)
  }

  if (file) {
    if (previewMode) {
      open(
        `http://localhost:${PORT}/liascript/index.html?http://localhost:${PORT}/${file}`
      )
    } else {
      open(
        `https://liascript.github.io/course/?http://localhost:${PORT}/${file}`
      )
    }
  } else {
    open(`http://localhost:${PORT}`)
  }
}

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path'

const open = require('open')
const portfinder = require('portfinder')
import server = require('@liascript/devserver/dist/lib.js')

var PORT = 8080

var workspace = ''

function lineGoto(line: number, filename: string) {
  let editor = vscode.window.activeTextEditor
  if (editor) {
    if (workspace + filename == editor.document.fileName) {
      let range = editor.document.lineAt(line).range
      editor.selection = new vscode.Selection(range.start, range.end)
      editor.revealRange(range)
    }
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const base =
    vscode.extensions.getExtension('liascript.liascript-preview')
      ?.extensionPath || '.'

  server.init(
    path.join(base, 'node_modules/@liascript/devserver'),
    path.join(base, 'node_modules')
  )

  portfinder.getPort(function (err: any, port: number) {
    console.log('found free port: ', port)
    PORT = port
  })

  getWorkspace()

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

  vscode.languages.registerCodeActionsProvider('markdown', {
    provideCodeActions(doc, pos, tok) {
      const filename = doc.uri.fsPath
        ? path.relative(workspace, doc.uri.fsPath).replace(workspace, '')
        : ''

      if (filename) {
        const line = pos.start.line

        if (line) {
          try {
            server.gotoLine(line + 1, '/' + filename)
          } catch (e) {}
        }
      }

      return undefined
    },
  })
}

// this method is called when your extension is deactivated
export function deactivate() {
  server.stop()
  vscode.window.showInformationMessage(`LiaScript: Terminated DevServer`)
}

function startPreview(previewMode: boolean, liveMode: boolean) {
  if (!workspace) {
    getWorkspace()

    if (!workspace) {
      vscode.window.showInformationMessage(
        `LiaScript: No Workspace identified, cannot start DevServer`
      )
      return
    }
  }

  const file = vscode.window.activeTextEditor?.document.uri.fsPath
    ? path.relative(
        workspace,
        vscode.window.activeTextEditor?.document.uri.fsPath
      )
    : ''

  try {
    server.start(
      PORT,
      'localhost',
      workspace,
      undefined,
      liveMode,
      false,
      false,
      lineGoto
    )

    vscode.window.showInformationMessage(
      `LiaScript: Started DevServer ${
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

function getWorkspace() {
  if (!workspace) {
    if (vscode.workspace.workspaceFolders) {
      workspace = vscode.workspace.workspaceFolders[0].uri.path
      workspace = path.normalize(workspace)

      if (workspace.startsWith('\\')) {
        workspace = workspace.slice(1)
      }
    }
  }
}

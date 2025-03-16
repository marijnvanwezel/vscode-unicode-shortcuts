import * as vscode from 'vscode';

function getShortcuts() {
  return vscode
    .workspace
    .getConfiguration('extension.unicode-shortcuts')
    .get<{ [key: string]: string }>('shortcuts') || {};
}

export function activate(context: vscode.ExtensionContext) {
  let shortcuts = getShortcuts();

  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('extension.unicode-shortcuts.shortcuts')) {
      shortcuts = getShortcuts();
    }
  });

  const replaceShortcut = vscode.commands.registerTextEditorCommand('extension.unicode-shortcuts.replaceShortcut', (editor, edit) => {
    const position = editor.selection.active;
    const wordRange = editor.document.getWordRangeAtPosition(position, /\\[a-zA-Z0-9]+/);

    if (wordRange) {
      const word = editor.document.getText(wordRange);
      const replacement = shortcuts[word];

      if (replacement) {
        edit.replace(wordRange, replacement);
      }
    }
  });

  context.subscriptions.push(replaceShortcut);
}

export function deactivate() {}

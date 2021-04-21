// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "new-ts-file" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "new-ts-file.newTsFile",
    () => {
      // The code you place here will be executed every time your command is executed

      vscode.window
        .showInputBox({ placeHolder: "Enter a file name" })
        .then((filename) => {
          if (!filename) {
            return vscode.window.showErrorMessage(
              "You need to enter the filename you want to create"
            );
          }

          if (vscode.workspace.workspaceFolders?.length === 0) {
            return vscode.window.showErrorMessage(
              "You need to open some directory"
            );
          }

          // Get current working directory
          const basePath = vscode.workspace.workspaceFolders![0].uri.fsPath;

          // Append .ts extension
          if (!/\.tsx?$/.test(filename)) {
            filename += ".ts";
          }

          // If filename contains '/', separate filename by them and create these directories
          if (filename.includes("/")) {
            const directories = filename.split("/");
            directories.pop(); // Remove filename (the last element)

            fs.mkdirSync(path.join(basePath, directories.join("/")), {
              recursive: true,
            });
          }

          const filePath = path.join(basePath, filename);

          vscode.workspace.fs.writeFile(
            vscode.Uri.parse(filePath),
            Buffer.from("", "utf-8")
          );
        });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

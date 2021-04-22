import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "new-ts-file.newTsFile",
    async () => {
      if (vscode.workspace.workspaceFolders?.length === 0) {
        return vscode.window.showErrorMessage(
          "You need to open some directory"
        );
      }

      let pathToCreate = await vscode.window.showInputBox({
        placeHolder: "Enter a file name",
      });

      if (!pathToCreate) {
        return vscode.window.showErrorMessage(
          "You need to enter the filename you want to create"
        );
      }

      const basePath = vscode.workspace.workspaceFolders![0].uri.fsPath;
      const fileExt = path.extname(pathToCreate);

      // Append .ts extension is user didn't specify the extension
      if (!fileExt) {
        pathToCreate += ".ts";
      }

      // If filename contains '/', it has directories in it, create them
      if (pathToCreate.includes("/")) {
        const directories = pathToCreate.split("/");
        directories.pop(); // Remove filename (the last element)
        const fullPath = vscode.Uri.parse(
          path.join(basePath, directories.join("/"))
        );

        await vscode.workspace.fs.createDirectory(fullPath);
      }

      // Create file
      const filePath = vscode.Uri.parse(path.join(basePath, pathToCreate));
      await vscode.workspace.fs.writeFile(filePath, Buffer.from("", "utf-8"));

      // Open file
      const file = await vscode.workspace.openTextDocument(filePath);
      vscode.window.showTextDocument(file);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

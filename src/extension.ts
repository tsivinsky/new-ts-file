import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

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

      if (pathToCreate.includes(";")) {
        // User wants to create several files
        const files = pathToCreate.split(";");

        for (const file of files) {
          await createFile(file);
        }
      } else {
        await createFile(pathToCreate);
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function createFile(pathToCreate: string) {
  let basePath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const fileExt = path.extname(pathToCreate);

  // Check if file on this path already exists
  const pathToCheckExisting = fileExt
    ? path.join(basePath, pathToCreate)
    : path.join(basePath, pathToCreate + ".ts");
  if (fs.existsSync(pathToCheckExisting)) {
    return vscode.window.showErrorMessage(
      `File ${pathToCreate} already exists`
    );
  }

  // Append .ts extension if user didn't specify the extension
  if (!fileExt) {
    pathToCreate += ".ts";
  }

  // User wants to create a new file relative to the opened file
  if (pathToCreate.startsWith("./")) {
    if (!vscode.window.activeTextEditor) {
      return vscode.window.showErrorMessage(
        "You need to open some file so extension create a new file next to it"
      );
    }

    const activeFilePath =
      vscode.window.activeTextEditor!.document.uri.fsPath.split("/");
    activeFilePath.pop();

    basePath = activeFilePath.join("/");
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

export function deactivate() {}

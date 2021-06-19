# new-ts-file vscode extension

## Install

### Via Extensions tab

Go to Extensions tab in vscode `Ctrl+Shift+X` or `Cmd+Shift+X`, type `new-ts-file` and install extension

### Via ext command

Open command palette `Ctrl+P` or `Cmd+P`, enter `ext install tsivinsky.new-ts-file` and hit Enter

## Usage

Open command palette and run command `newTsFile`. It will ask you the name of the file you want to create.

### Alternative way

You also can use keyboard shortcut `Ctrl+alt+n`.

## Create several files

You can create several files but you need to separate them by semicolon `';'`

## Create a new file next to active file

If you put a `'./'` before file path, extension will use path to active opened file as base path for a new file

For example, if you have `'index.ts'` file inside `'src'` directory opened in vscode, you can enter something like `'./helpers/index'` and extension will create `'index.ts'` file under `'src/helpers'` path in your workspace folder.

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/***************************************
 *                 Utils               *
 ***************************************/
// FindLine in document where the first occurence of toFind is detected
const findLine = (document: vscode.TextDocument, toFind: string): number => {
  const input = document.getText();
  const char = '\n';
  let i = 0;
  let j = 0;

  let lineNumber = 0;
  let found = -1;

  while ((j = input.indexOf(char, i)) !== -1) {
    if (input.substring(i, j).substring(0, 35) === toFind) {
      found = lineNumber + 1;
      break;
    }
    i = j + 1;
    lineNumber += 1;
  }
  return found;
};

// Add style reference in styles variable; if the styles variable is not present, it will be added at the end
const addStyleToStyles = (
  editor: vscode.TextEditor,
  document: vscode.TextDocument,
  addStyle: string,
  styleConst: string
): void => {
  editor.edit((editBuilder) => {
    let lineNumber = findLine(document, styleConst);
    if (lineNumber < 0) {
      const input = document.getText();
      const splittedInput = input.split('\n');
      let lineToInsertStyles: number = -1;
      splittedInput.some((line, index) => {
        if (line.includes('export default ')) {
          lineToInsertStyles = index;
          return true;
        }
      });
      if (lineToInsertStyles >= 0) {
        let toInsert = '';
        if (styleConst === 'const styles = {') {
          toInsert = `${styleConst}\n${addStyle}\n};\n\n`;
        } else {
          toInsert = `${styleConst}\n${addStyle}\n});\n\n`;
        }
        editBuilder.insert(
          new vscode.Position(lineToInsertStyles, 0),
          toInsert
        );
        lineNumber = lineToInsertStyles;
      } else {
        // Display error message
        vscode.window.showErrorMessage(
          "Add Style failed: there is no constant named 'styles' nor a 'default export' component."
        );
      }
    } else {
      editBuilder.insert(new vscode.Position(lineNumber, 0), addStyle);
    }
  });
};

// Create the section comment
const createSectionCommentReplacement = (
  linetext: string,
  length: number,
  lang: string
): string => {
  let output = '';
  const effectiveText = linetext.trim();
  
  // Indentation
  // This approach distinguish between spaces and tabs
  let spacing = '';
  for (let i = 0; i < linetext.length; i++) {
    if (linetext[i] !== effectiveText[0]) {
      spacing += linetext[i];
    } else {
      break;
    }
  }

  // Left & Right spacing
  const distanceLenght = (length - effectiveText.length - 2) / 2;
  let distanceLeft = '';
  let distanceRight = '';
  let distanceRightStars = '';

  if (Number.isInteger(distanceLenght)) {
    const tmp = Math.round(distanceLenght);
    distanceLeft = ' '.repeat(tmp);
    distanceRight = distanceLeft;
    distanceRightStars = ' '.repeat(tmp-1);
  } else {
    const tmpLeft = Math.round(distanceLenght);
    const tmpRight = tmpLeft - 1;
    distanceLeft = ' '.repeat(tmpLeft);
    distanceRight = ' '.repeat(tmpRight);
    distanceRightStars = ' '.repeat(tmpLeft-2);
  }

  // Different output depending on programming language
  // So far, only Python- and JS-like comments implemented
  if (lang.includes('python')) {
    const hashes = '#'.repeat(length);
    output = `${spacing}${hashes}\n${spacing}#${distanceLeft}${effectiveText}${distanceRight}#\n${spacing}${hashes}\n`;
  } else {
    // Assuming JS-like comments
    const stars = '*'.repeat(length - 1);
    output = `${spacing}/${stars}\n${spacing} *${distanceLeft}${effectiveText}${distanceRightStars}*\n ${spacing}${stars}/\n`;
  }

  return output;
};

// Replace the line with the section comment generated
const addSectionComment = (length: number): void => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;

    // Selection
    const selection = editor.selection;
    const selectionLine = selection.active.line;

    // Get selection line
    const documentText = document.getText();
    const selectedLine = documentText.split('\n')[selectionLine];

    const syntax = editor.document.languageId;

    const output = createSectionCommentReplacement(
      selectedLine,
      length,
      syntax
    );

    // Replace line with the section comment
    editor.edit((editBuilder) => {
      editBuilder.delete(
        new vscode.Range(selectionLine, 0, selectionLine, selectedLine.length)
      );
      editBuilder.insert(editor.selection.active, output);
    });
  }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  /***************************************
   *         Add Section Comments        *
   ***************************************/
  
  // Long
  const disposableAddSectionCommentLong = vscode.commands.registerCommand(
    'roxen.addSectionCommentLong',
    () => {
      addSectionComment(100);
    }
  );
  context.subscriptions.push(disposableAddSectionCommentLong);

  // Short
  const disposableAddSectionCommentShort = vscode.commands.registerCommand(
    'roxen.addSectionCommentShort',
    () => {
      addSectionComment(40);
    }
  );
  context.subscriptions.push(disposableAddSectionCommentShort);

  /***************************************
   *         React & React Native        *
   ***************************************/

  // useState Shortcut
  //
  // Dynamically create the line 'const [var, setVar] = useState<FixMeLater>();' just by typing 'var'
  const disposableState = vscode.commands.registerCommand(
    'roxen.useStateShortcut',
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        // Selection
        const selection = editor.selection;
        const selectionPosition = selection.active;
        const selectionLine = selectionPosition.line;

        // Get selection line
        const documentText = document.getText();
        let selectedLine = documentText.split('\n')[selectionLine];
        const selectionColumn = selectionPosition.character;
        let newState = '';

        // Get state var name
        let backwardIndex = selectionColumn - 1;
        if (selectedLine.charAt(0) !== ' ') {
          selectedLine = ' ' + selectedLine;
          backwardIndex += 1;
        }
        while (selectedLine.charAt(backwardIndex) !== ' ') {
          newState = selectedLine.charAt(backwardIndex) + newState;
          backwardIndex = backwardIndex - 1;
        }

        // Indentation
        const lineLength = selectedLine.length;
        const spacing = lineLength - newState.length;
        const indentation = spacing > 0 ? ' '.repeat(spacing) : '';

        // Create the useState string
        const firstChar = newState?.charAt(0);
        const restOfState = newState?.substring(1, newState?.length);
        const useState = `${indentation}const [${newState}, set${firstChar?.toUpperCase()}${restOfState}] = useState<FixMeLater>();`;

        editor.edit((editBuilder) => {
          editBuilder.delete(
            new vscode.Range(selectionLine, 0, selectionLine, lineLength)
          );
          editBuilder.insert(selectionPosition, useState);
        });

      }
    }
  );
  context.subscriptions.push(disposableState);

  // Add StyleSheet
  //
  // Add stylesheet reference into React Native StyleSheet styles variable
  const disposableStyleSheet = vscode.commands.registerCommand(
    'roxen.addStyleSheetReactNative',
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        // Selection
        const selection = editor.selection;
        const selected = document.getText(selection);
        const selectionPosition = selection.active;
        const selectionLine = selectionPosition.line;

        if (selected.length === 0) { // No selection
          
          // Get selection line
          const documentText = document.getText();
          let selectedLine = documentText.split('\n')[selectionLine];
          const selectionColumn = selectionPosition.character;

          // Get style name
          let startIndex = selectionColumn;
          while (selectedLine.charAt(startIndex) !== '.') {
            startIndex -= 1;
          }
          const newStyle = selectedLine.substring(startIndex + 1, selectionColumn);
          const addStyle = '\t' + newStyle + ': {\n\t\t\n\t},\n';

          addStyleToStyles(editor, document, addStyle, 'const styles = StyleSheet.create({');
        } else { // style.name selected
          if (selected.substring(0, 7) === 'styles.') {
            const newStyle = selected.substring(7);
            const addStyle = '\t' + newStyle + ': {\n\t\t\n\t},\n';
            addStyleToStyles(editor, document, addStyle, 'const styles = StyleSheet.create({');
          } else {
            vscode.window.showErrorMessage(
              "Add StyleSheet failed: there is no 'styles' instance selected."
            );
          }
        }
      }
    }
  );
  context.subscriptions.push(disposableStyleSheet);

  // Add style
  //
  // Add style reference into React style styles variable
  const disposableStyle = vscode.commands.registerCommand(
    'roxen.addStyleReact',
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        // Selection
        const selection = editor.selection;
        const selected = document.getText(selection);
        const selectionPosition = selection.active;
        const selectionLine = selectionPosition.line;

        if (selected.length === 0) { // No selection
          
          // Get selection line
          const documentText = document.getText();
          let selectedLine = documentText.split('\n')[selectionLine];
          const selectionColumn = selectionPosition.character;

          // Get style name
          let startIndex = selectionColumn;
          while (selectedLine.charAt(startIndex) !== '.') {
            startIndex -= 1;
          }
          const newStyle = selectedLine.substring(startIndex + 1, selectionColumn);
          const addStyle = '\t' + newStyle + ': {\n\t\t\n\t},\n';

          addStyleToStyles(editor, document, addStyle, 'const styles = {');
        } else { // style.name selected
          if (selected.substring(0, 7) === 'styles.') {
            const newStyle = selected.substring(7);
            const addStyle = '\t' + newStyle + ': {\n\t\t\n\t},\n';
            addStyleToStyles(editor, document, addStyle, 'const styles = {');
          } else {
            vscode.window.showErrorMessage(
              "Add Style failed: there is no 'styles' instance selected."
            );
          }
        }
      }
    }
  );
  context.subscriptions.push(disposableStyle);
}

// this method is called when your extension is deactivated
export function deactivate() {}

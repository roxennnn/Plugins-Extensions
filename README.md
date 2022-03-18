# Plugins & Extensions for Popular Text Editors

<p align="left">
 <a href="https://github.com/roxennnn/Plugins-Extensions/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/roxennnn/Plugins-Extensions"></a>
</p>

Plugins and extensions for popular text editors.

## Visual Studio Code
Extensions and snippet shortcuts for Visual Studio Code editor.
### Extension Support Function Shortcuts

#### Installation
[https://code.visualstudio.com/api/working-with-extensions/publishing-extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

[https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix)

[https://www.npmjs.com/package/vsce](https://www.npmjs.com/package/vsce)
#### Description

**useState Shortcut**

Starting from the last word written before the cursor position, replace the current line with the following. 
```ts
const [name, setName]= useState<FixMeLater>();
```
`name` correspponds to the last word before the cursor position.

**Add StyleSheet Reference - React Native**

Shortcut which automatically adds a style reference `name` &ndash; if `styles.name` is selected or the cursor is just after it &ndash; to a `StyleSheet` constant named `styles` in a React Native component. If no `StyleSheet` constant has been declared with name `styles`, it will be generated and then the reference added to it.

The `StyleSheet` constant has to be declared like this:
```ts
const styles = StyleSheet.create({
  
});
```

After the command is run with `styles.name`:
```ts
const styles = StyleSheet.create({
  name: {

  }
});
```

**Add Style Reference - React**

Shortcut which automatically adds a style reference `name` &ndash; if `styles.name` is selected or the cursor is just after it &ndash; to a constant named `styles` in a React component. If no constant `styles` has been declared, it will be generated and then the reference added to it.

The `styles` constant has to be declared like this:
```ts
const styles = {StyleSheet.create(
  
};
```

After the command is run with `styles.name`:
```ts
const styles = {
  name: {

  }
};
```

**Add Section Comments**

Generate *section comments* with a shortcut. There are two types of sections comments: a *long* one (100-character long) and a *short* one (40-character long).

The generated section comment can be used in Python or in programming languages with block comments Java-like.

### Snippet Shortcuts

#### Installation
[https://vscode-docs.readthedocs.io/en/stable/customization/userdefinedsnippets/](https://vscode-docs.readthedocs.io/en/stable/customization/userdefinedsnippets/)
#### Description
Code snippets are templates that make it easier to enter repeating code patterns, such as loops or conditional-statements.

Hereafter, the implemented code snippets are shown. They are identified by their shortcuts

**Typescript**

* `!componentNew`: template for a React component in Typescript.
```ts
import React from 'react';

type Props = {

};

const styles = {

};

const ComponentName = (props: Props) => {
  return (
    <div>
    </div>
  );
};

export default ComponentName;
```

* `!nativeComponentNew`: template for a React Native component in Typescript.
```ts
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

type Props = {

};

const ComponentName = (props: Props) => {
  return (
    <View>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  
});

export default ComponentName;
```

**Javascript**

* `!componentNew`: template for a React component in Javascript.
```js
import React from 'react';

const styles = {

};

const ComponentName = (props) => {
  return (
    <div>
    </div>
  );
};

export default ComponentName;
```

* `!nativeComponentNew`: template for a React Native component in Javascript.
```js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ComponentName = (props) => {
  return (
    <View>
      <Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  
});

export default ComponentName;
```

**Typescript & Javascript**

* `!functionNew`: template for a Javascript arrow function.
```js
const FunctionName = () => {
  
};
```
* `cl`: shortcut for `console.log();`.
```js
console.log();
```

## Sublime-Text
Plugins and extensions for Sublime-Text editor.

### Add Section Comments
Sublime-Text plugin to generate *section comments* with a shortcut. There are two types of sections comments: a *long* one (100-character long) and a *short* one (40-character long).

The generated section comment can be used in Python or in programming languages with block comments Java-like.

## License
[MIT](https://github.com/roxennnn/Plugins-Extensions/blob/master/LICENSE)

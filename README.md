# LiaScript-Preview (Experimental)

This will start the [development](https://www.npmjs.com/package/@liascript/devserver) server for [LiaScript](https://LiaScript.github.io) directly from VSCode. For more information, checkout the [documentation](https://liascript.github.io/course/?https://raw.githubusercontent.com/liaScript/docs/master/README.md#1) or checkout our [YouTube-Channel](https://www.youtube.com/channel/UCyiTe2GkW_u05HSdvUblGYg).

![preview.gif](https://github.com/andre-dietrich/liascript-preview-vscode/raw/main/preview.gif)

## Features

Currently there are 5 different options, which you can either activate by \[ctrl+shift+p\] and then type "liascript" or you use one of the following short-cuts:

* Start the development server in live mode: \[alt+l\]

  This option will start the server in the current directory and watch for changes. Every time a file is changed and saved, the preview will be reloaded automatically.
  If no file has been selected previously, then you will be presented with a folder overview, where you can open different files.
* Start the development server: \[alt+shift+l\]

  If automatically reloading might be annoying, you can use this option. It will only start the development and you will have to perform a reload of the course manually within the browser.
* Start the development server and test your course on the project-website:

  Text to speech is not enabled at the moment, but if you want to test your course on the LiaScript [project-website](https://LiaScript.github.io) this option can be used.
* Stop the development server: \[alt+l+c\]

  Once the server has been started, it will remain active until you close VScode or by using this command.
* Navigation:

  * from Preview to file: Simply by double-clicking onto an element on the slide
  * from cursor position to Preview: hit [alt+g]

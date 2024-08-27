# Islamic prayer times chrome extension

## Description
This Chrome extension provides Islamic Salat times using the Aladhan API (https://github.com/islamic-network/api.aladhan.com). It displays the prayer times directly in the browser and sends notifications to remind users when it's time to pray.

## Installation

After cloning the project, install the necessary dependencies, including TypeScript and Chrome types:
```bash
  npm install
```

## TypeScript Configuration

To compile the TypeScript files, use:

```bash
npx tsc
```

With the provided TypeScript configuration, only `src/content.ts` and `src/background.ts` will be compiled into the `/dist` directory, as they are the only files needed to run this extension. You can modify the compiler options in the `tsconfig.json` file if required.

## Run Locally

To run the extension locally:

  1. Enable **Developer mode** in your browser.
  2. Click on the Load unpacked button and select the project folder.
  3. The extension will be added to your browser and ready to use.

## Project Status

This project only supports prayer times for **Tunis , Tunisia**.

## Planned Features

- Support for multiple locations
- Custom notification settings.

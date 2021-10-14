# Welcome to Gravitee.io UI Components

## User guide

To use the Gravitee.io component library in your app just run:

```bash
npm install --save @gravitee/ui-components
# Or
yarn add @gravitee/ui-components
```

### Configuration

The components are based on a set of files to manage **icons**, **images**, **i18n** or even for **CSS**.
When we publish the dist folder, we also publish the assets, you can get them in folder `@gravitee/ui-components/assets`.
To use them in an application, it is necessary to add some configuration to expose the folders on the correct paths.

When working with Webpack directly you need to update the configuration:

**webpack.conf.js**

```javascript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/@gravitee/ui-components/assets/images', to: 'images' },
        { from: 'node_modules/@gravitee/ui-components/assets/css', to: 'css' },
        { from: 'node_modules/@gravitee/ui-components/assets/svg', to: 'svg' },
        { from: 'node_modules/@gravitee/ui-components/assets/i18n', to: 'i18n' },
      ],
    }),
  ],
};
```

When working with Angular then update your `angular.json` file:

**angular.json**

```json
{
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "index": "src/index.html",
        "main": "src/main.ts",
        "assets": [
          "src/favicon.ico",
          "src/favicon.png",
          "src/assets",
          {
            "glob": "**/*",
            "input": "node_modules/@gravitee/ui-components/assets/images",
            "output": "images/"
          },
          {
            "glob": "**/*.css",
            "input": "node_modules/@gravitee/ui-components/assets/css",
            "output": "css/"
          },
          {
            "glob": "**/*.svg",
            "input": "node_modules/@gravitee/ui-components/assets/icons",
            "output": "icons/"
          },
          {
            "glob": "**/*.json",
            "input": "node_modules/@gravitee/ui-components/assets/i18n",
            "output": "i18n/"
          }
        ]
      }
    }
  }
}
```

### I18n

Some components use i18n, if you didn't need it, you can load the default `EN` translations when your app starts.

```js
import { loadDefaultTranslations } from '@gravitee/ui-components/src/lib/i18n';

loadDefaultTranslations();
```

### Using in Angular app

**First import the component**

```js
import { FormGroup, FormControl } from '@angular/forms';

import '@gravitee/ui-components/wc/gv-input';
import '@gravitee/ui-components/wc/gv-button';
```

**Use in template, like an simple HTML element**

```html
<form [formGroup]="loginForm" (ngSubmit)="login()">
  <div>
    <gv-input autofocus name="username" formControlName="username" ngDefaultControl gvControl icon-left="communication:shield-user">
    </gv-input>
    <gv-input type="password" name="password" formControlName="password" ngDefaultControl gvControl icon-left="general:shield-protected">
    </gv-input>
  </div>

  <div>
    <gv-button class="signin" primary icon="navigation:sign-in" type="submit">Login</gv-button>
  </div>
</form>
```

### Upgrade

Read the changelog and be careful with breaking changes or notes about upgrade of dependencies.

To install the desired version:

```
npm install --save @gravitee/ui-components@{version}
```

_TIP_: You can clean the **package-lock.json** and remove duplicate dependencies with `npm dedupe`

## Developers guide

### Install

- Install [nvm](https://github.com/nvm-sh/nvm)
- Use with `nvm use` or install with `nvm install` the node version declared in `.nvmrc`
- Then install node modules with: `npm install`

### Tasks

The available NPM scripts are:

- `npm run serve`: start Storybook in dev mode
- `npm run lint`: run eslint and prettier
- `npm run lint:fix`: run eslint with autofix and prettier in write mode
- `npm run test`: run the unit tests
- `npm run test -- --collect-coverage`: run the unit tests with coverage
- `npm run docs`: generate the documentation
- `npm run build`: build storybook
- `npm run serve:prod`: start Storybook in prod mode
- `npm run generate:dist`: build components to use them in your project
- `npm run generate:icons`: build icons files from svg files
- `npm run generate:theme`: generate theme file based on css custom properties defined in each component file

If you want link for use in other local project as dependency:

```bash
npm link
cd ../my-project
npm link @gravitee/ui-components
```

If you want link the prod version in other local project:

```bash
npm run build
cd dist
npm link
cd ../my-project
npm link @gravitee/ui-components
```

## Contributing

You think Gravitee.io is awesome and want to contribute to the project?
Here are few [guidelines](https://github.com/gravitee-io/gravitee-ui-components/blob/master/CONTRIBUTING.md) that should help you get started.

## Copyright

Copyright (C) 2015 The Gravitee team (http://gravitee.io)
Licensed under the Apache License, Version 2.0 (the "License");

See the [LICENSE](https://github.com/gravitee-io/gravitee-ui-components/blob/master/LICENSE.txt) file for details.

## Changelog

Refer to the [CHANGELOG](https://github.com/gravitee-io/gravitee-ui-components/blob/master/CHANGELOG.md) for a complete list of changes.

import { addDecorator, configure, addParameters } from '@storybook/html';
import { create } from '@storybook/theming';
import { withKnobs } from '@storybook/addon-knobs';

const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withKnobs);

const graviteeTheme = create({
  base: 'light',
  brandTitle: 'Gravitee components',
  brandUrl: 'https://gravitee.io/',
  brandImage: 'https://avatars3.githubusercontent.com/u/12655666?s=280&v=4'
});

addParameters({
  options: {
    enableShortcuts: true,
    theme: graviteeTheme,
  },
});

function loadStories () {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

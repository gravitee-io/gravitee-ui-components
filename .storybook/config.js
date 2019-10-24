import { addDecorator, configure, addParameters } from '@storybook/html';
import { create } from '@storybook/theming';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import '../themes/gravitee-theme.css';

const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withKnobs);
addDecorator(withA11y);

const graviteeTheme = create({
  base: 'light',
  brandTitle: 'Gravitee components',
  brandUrl: 'https://gravitee.io/',
  brandImage: 'https://avatars3.githubusercontent.com/u/12655666?s=280&v=4'
});

addParameters({
  options: {
    enableShortcuts: true,
    showPanel: true,
    theme: graviteeTheme,
  },
  a11y: {
    restoreScroll: true,
  },
});

function loadStories () {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

// force full reload to not redefine web components
if (module.hot) {
  module.hot.accept(req.id, () => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    location.reload();
  });
}

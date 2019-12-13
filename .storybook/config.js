import { addDecorator, configure, addParameters } from '@storybook/html';
import { create } from '@storybook/theming';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import '../assets/css/gravitee-theme.css';
import brandImage from '../assets/images/gravitee-logo-inline.png';
import { i18nKnob } from '../stories/lib/i18n-knob';

const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withKnobs({
  escapeHTML: false,
}));
addDecorator(withA11y);

addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

const graviteeTheme = create({
  base: 'light',
  brandTitle: 'Gravitee components',
  brandUrl: 'https://gravitee.io/',
  brandImage
});

addParameters({
  options: {
    enableShortcuts: false,
    showPanel: true,
    theme: graviteeTheme,
  },
  a11y: {
    restoreScroll: true,
  },
});

function loadStories () {
  req('./welcome.stories.js');
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

// force full reload to not redefine web components
if (module.hot) {
  module.hot.accept(req.id, () => {
    const search = new URLSearchParams(window.location.search);
    window.parent.location.href = `${window.location.origin}/?path=/story/${search.get('id')}`;
  });
}

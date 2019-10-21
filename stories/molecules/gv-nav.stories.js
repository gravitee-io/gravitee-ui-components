import '../../src/molecules/gv-nav.js';
import notes from '../../.docs/gv-nav.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav_change');

storiesOf('Components.Molecules', module)
  .add('<gv-nav>', withActions(() => {

    const nav = document.createElement('gv-nav');
    nav.routes = [
      { path: '#', title: 'Dashboard' },
      { path: '#', title: 'Catalogue', isActive: true },
      { path: '#', title: 'Mes applications' },
    ];
    nav.style = '--gv-nav-link-selected:#357edd;';
    return nav;
  }, { notes }));

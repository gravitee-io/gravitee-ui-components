import '../../src/organisms/gv-header.js';
import notes from '../../.docs/gv-header.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav_change');

storiesOf('Components.Organisms', module)
  .add('<gv-header>', withActions(() => {

    const header = document.createElement('gv-header');
    header.routes = [
      { path: '#', title: 'Dashboard' },
      { path: '#', title: 'Catalogue', isActive: true },
      Promise.resolve({ path: '#', title: 'Mes applications' }),
    ];
    header.logoTitle = 'Gravitee.io components';
    header.logoImg = 'https://avatars3.githubusercontent.com/u/12655666?s=280&amp;v=4';
    return header;
  }, { notes }));

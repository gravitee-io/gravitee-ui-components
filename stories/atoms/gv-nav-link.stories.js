import '../../src/atoms/gv-nav-link.js';
import notes from '../../.docs/gv-nav-link.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action.js';

const withActions = withCustomEventActions('gv-nav-link_click');

storiesOf('Components.Atoms', module)
  .addParameters({ notes })
  .add('<gv-nav-link>', withActions(() => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Nav link</div>
      <gv-nav-link id="empty"></gv-nav-link>
      <gv-nav-link id="dashboard"></gv-nav-link>
      <gv-nav-link id="catalog"></gv-nav-link>
      <gv-nav-link id="apps"></gv-nav-link>
      <gv-nav-link id="error"></gv-nav-link>
    `;
    container.querySelector('#empty').route = Promise.resolve(null);
    container.querySelector('#dashboard').route = { title: 'Dashboard', path: '#' };
    container.querySelector('#catalog').route = Promise.resolve({ title: 'Catalog', path: '#', isActive: true });
    container.querySelector('#catalog').style = '--gv-nav-link-active--bgc:#357edd;';
    container.querySelector('#apps').route = Promise.resolve({ title: 'Apps', path: '#', isActive: false });
    container.querySelector('#error').route = Promise.reject(new Error('True story.'));
    return container;

  }));

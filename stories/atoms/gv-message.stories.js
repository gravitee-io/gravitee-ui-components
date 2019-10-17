import '../../src/atoms/gv-message.js';
import notes from '../../.docs/gv-message.md';
import { storiesOf } from '@storybook/html';

storiesOf('Atoms', module)
  .add('<gv-message>', () => {
    return `
      <div class="title">Info message</div>
      <gv-message type="info">The cake is a lie</gv-message>
      
      <div class="title">Success message</div>
      <gv-message type="success">Yeah, piece of cake !</gv-message>
      
      <div class="title">Error message</div>
      <gv-message type="error">Never gonna give you up</gv-message>
    `;
  }, { notes });

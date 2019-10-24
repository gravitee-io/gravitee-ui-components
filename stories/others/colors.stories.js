import '../../src/icons/shapes/all-shapes';
import '../../src/atoms/gv-icon.js';
import { storiesOf } from '@storybook/html';

storiesOf('Collection', module)
  .add('Colors', () => {
    return `<div class="title">Colors</div>

  <div class="collection colors">
      <div class="item" style="background-color: var(--gv-theme-color-darker); color: var(--gv-theme-color-lighter); ">
        <p>--gv-theme-color-darker </p>
      </div>
      
      <div class="item" style="background-color: var(--gv-theme-color-dark); color: var(--gv-theme-color-lighter);">
        <p>--gv-theme-color-dark </p>
      </div>
      
      <div class="item" style="background-color: var(--gv-theme-color); color: var(--gv-theme-color-lighter);">
        <p>--gv-theme-color </p>
      </div>
      
      <div class="item" style="background-color: var(--gv-theme-color-light); color: var(--gv-theme-color-darker);">
        <p>--gv-theme-color-light </p>
      </div>
      
      <div class="item" style="background-color: var(--gv-theme-color-lighter); color: var(--gv-theme-color-darker);">
        <p>--gv-theme-color-lighter </p>
      </div>
  </div>    

</div>`;
  });

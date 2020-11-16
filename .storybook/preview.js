import {configure, addDecorator, addParameters, setCustomElements} from '@storybook/web-components';
import {withKnobs} from '@storybook/addon-knobs';
import '../assets/css/gravitee-theme.generated.css';
import '../assets/css/documentation.css';
import {i18nKnob} from '../stories/lib/i18n-knob';
import customElements from '../.docs/custom-elements.json';


addDecorator(withKnobs({
  escapeHTML: false,
}));

addDecorator((storyFn) => {
  i18nKnob();
  return storyFn();
});

const viewports = {};
Array
  .from(new Array(10))
  .map((_, i) => {
    const w = 350 + i * 100;
    viewports['w' + w] = {
      type: 'desktop',
      name: w + 'px',
      styles: {
        width: w + 'px',
        height: '90%',
      },
    };
  });

const KIND_SORT = ['welcome', 'documentation', 'atoms', 'charts', 'molecules', 'organisms', 'policy'];

addParameters({
  options: {
    docs: {
      iframeHeight: '200px',
    },
    showPanel: true,
    storySort: (a, b) => {
      if (a[1].kind !== b[1].kind) {
        const aKind = KIND_SORT.indexOf(a[1].id.split('-')[0]) + a[1].kind;
        const bKind = KIND_SORT.indexOf(b[1].id.split('-')[0]) + b[1].kind;
        return aKind.localeCompare(bKind, undefined, {numeric: true});
      }
      return -1;
    }
  },
  viewport: {viewports},
});

function addDefaultValue(def) {
  def.defaultValue = def.default;
}

customElements.tags.forEach((tagDefinition) => {
  (tagDefinition.attributes || []).forEach((def) => addDefaultValue(def));
  (tagDefinition.properties || []).forEach((def) => addDefaultValue(def));
});

setCustomElements(customElements);

const stories = require.context('../stories', true, /\.stories\.(js|mdx)$/);
const docs = require.context('../docs', true, /\.mdx$/);


// Force full reload instead of HMR for Web Components
// https://github.com/storybookjs/storybook/tree/next/app/web-components

configure(stories, module);
if (module.hot) {
  module.hot.accept([stories.id, docs.id], (...a) => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}

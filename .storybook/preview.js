import { setCustomElements } from '@storybook/web-components';
import '../assets/css/gravitee-theme.generated.css';
import '../assets/css/documentation.css';
import { defaultLanguages, i18nDecorator, languages } from '../testing/lib/i18n-decorator';
import customElements from '../.docs/custom-elements.json';

export const globalTypes = {
  locale: {
    name: 'Language',
    description: 'Language used to translate component texts.',
    defaultValue: defaultLanguages,
    toolbar: {
      icon: 'globe',
      items: languages.map(({ key, label, icon }) => ({ value: key, right: icon, title: label })),
    },
  },
};

export const decorators = [i18nDecorator];

const viewports = {};
Array.from(new Array(10)).map((_, i) => {
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

const KIND_SORT = ['welcome', 'documentation', 'atoms', 'molecules', 'organisms', 'charts', 'policy'];

export const parameters = {
  options: {
    docs: {
      iframeHeight: '200px',
      inlineStories: false,
    },
    showPanel: true,
    storySort: (a, b) => {
      if (a[1].kind !== b[1].kind) {
        const aKind = KIND_SORT.indexOf(a[1].id.split('-')[0]) + a[1].kind;
        const bKind = KIND_SORT.indexOf(b[1].id.split('-')[0]) + b[1].kind;
        return aKind.localeCompare(bKind, undefined, { numeric: true });
      }
      return -1;
    },
  },
  viewport: { viewports },
  // Set a default delay, to have input's validation messages properly displayed
  chromatic: { delay: 50 },
};

function addDefaultValue(def) {
  def.defaultValue = def.default;
}

customElements.tags.forEach((tagDefinition) => {
  (tagDefinition.attributes || []).forEach((def) => addDefaultValue(def));
  (tagDefinition.properties || []).forEach((def) => addDefaultValue(def));
});

setCustomElements(customElements);

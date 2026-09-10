import { setCustomElementsManifest } from '@storybook/web-components-vite';
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

export const parameters = {
  docs: {
    story: {
      iframeHeight: '200px',
      inline: false,
    },
  },
  options: {
    // Storybook evaluates this function in isolation, so it cannot close over anything defined in this module.
    storySort: (a, b) => {
      const kindSort = ['welcome', 'documentation', 'atoms', 'molecules', 'organisms', 'charts', 'policy'];
      if (a.title !== b.title) {
        const aKind = kindSort.indexOf(a.id.split('-')[0]) + a.title;
        const bKind = kindSort.indexOf(b.id.split('-')[0]) + b.title;
        return aKind.localeCompare(bKind, undefined, { numeric: true });
      }
      return -1;
    },
  },
  viewport: { options: viewports },
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

setCustomElementsManifest(customElements);

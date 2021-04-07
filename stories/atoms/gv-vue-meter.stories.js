import '../../src/atoms/gv-vue-meter';
import notes from '../../.docs/gv-message.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Atoms/gv-vue-meter',
  component: 'gv-vue-meter',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-vue-meter',
  css: `
    :host {
      height: 500px;
      color: red;
    }
  `,
};

const items = [
  {
    levels: [
      {
        level: 1,
        targetLevel: false,
        score: 63,
      }, {
        level: 2,
        targetLevel: false,
        score: 52,
      }, {
        level: 3,
        targetLevel: false,
        score: 10,
      }, {
        level: 4,
        targetLevel: true,
        score: 89,
      },
      {
        level: 5,
        targetLevel: false,
        score: 20,
      },
    ],
  },

];

export const basic = makeStory(conf, {
  items,
});

/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../../src/atoms/gv-button';
import '../../src/molecules/gv-popover';
import notes from '../../.docs/gv-popover.md';
import { makeStory } from '../lib/make-story';

export default {
  title: 'Molecules/gv-popover',
  component: 'gv-popover',
  parameters: {
    notes,
    options: {
      showPanel: false,
    },
  },
};

const conf = {
  component: 'gv-popover',
  css: `
    :host {
      display: flex;
      height: 90vh;
      justify-content: space-around;
      align-items: center;
    }

    gv-popover {
      border: 1px solid red;
      --gv-popover--bgc: #262626;
      --gv-popover--c: white;
    }
  `,
};

export const Inline = makeStory(conf, {
  items: [
    { innerHTML: ' <h1>Top</h1><div slot="popover">On top !</div>', position: 'top' },
    { innerHTML: ' <h1>Right</h1><div slot="popover">On right !</div>', position: 'right' },
    { innerHTML: ' <h1>Bottom</h1><div slot="popover">On bottom !</div>' },
    { innerHTML: ' <h1>Left</h1><div slot="popover">On left !</div>', position: 'left' },
  ],
});

export const InlineArrow = makeStory(conf, {
  items: [
    { innerHTML: ' <h1>Top</h1><div slot="popover">On top !</div>', position: 'top', arrow: true },
    { innerHTML: ' <h1>Right</h1><div slot="popover">On right !</div>', position: 'right', arrow: true },
    { innerHTML: ' <h1>Bottom</h1><div slot="popover">On bottom !</div>', arrow: true },
    { innerHTML: ' <h1>Left</h1><div slot="popover">On left !</div>', position: 'left', arrow: true },
  ],
});

const largeContent = `<div style="text-align:center" slot="popover">
  <h2 >Ola = Bonjour !</h2>
  <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMa</p>
  <gv-tag>Hello</gv-tag>
  <button>i18n</button>
</div>`;

export const Large = makeStory(conf, {
  items: [
    {
      innerHTML: `<span> Top </span>${largeContent}`,
      position: 'top',
      large: true,
    },
    {
      innerHTML: `<span> Right </span>${largeContent}`,
      large: true,
      position: 'right',
    },
    {
      innerHTML: `<span> Bottom </span>${largeContent}`,
      large: true,
    },
    {
      innerHTML: `<span> Left </span>${largeContent}`,
      large: true,
      position: 'right',
    },
  ],
});

export const LargeArrow = makeStory(conf, {
  items: [
    {
      innerHTML: `<span> Top </span>${largeContent}`,
      position: 'top',
      large: true,
      arrow: true,
    },
    {
      innerHTML: `<span> Right </span>${largeContent}`,
      large: true,
      position: 'right',
      arrow: true,
    },
    {
      innerHTML: `<span> Bottom </span>${largeContent}`,
      large: true,
      position: 'bottom',
      arrow: true,
    },
    {
      innerHTML: `<span> Left </span>${largeContent}`,
      large: true,
      position: 'right',
      arrow: true,
    },
  ],
});

export const AutoPosition = makeStory(conf, {
  items: [
    {
      innerHTML: `<span> Left </span>${largeContent}`,
      large: true,
      position: 'right',
      arrow: true,
      auto: true,
    },
  ],
});

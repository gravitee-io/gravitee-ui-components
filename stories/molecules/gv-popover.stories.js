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
import { storiesOf } from '@storybook/html';

storiesOf('2. Molecules|<gv-popover>', module)
  .addParameters({ notes })
  .add('Basics', () => {

    const container = document.createElement('div');
    container.innerHTML = `
      <div class="title">Basics</div>
      <gv-popover>
        <h1> Ola ! </h1>
        <div slot="popover">Bonjour !</div>
      </gv-popover>
     
      <gv-popover>
        <span> More Content </span>
        <div slot="popover">
            <h2>Ola = Bonjour !</h2>
            <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMa</p>
            <gv-tag>Hello</gv-tag><gv-tag>i18n</gv-tag>
        </div>
      </gv-popover>
    `;

    return container;
  });

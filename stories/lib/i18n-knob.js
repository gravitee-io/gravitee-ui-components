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
import * as en from '../../assets/i18n/en.json';
import * as fr from '../../assets/i18n/fr.json';
import { addTranslations, getAvailableLanguages, getLanguage, setLanguage } from '../../src/lib/i18n';
import { color, select } from '@storybook/addon-knobs';
import { forceReRender } from '@storybook/html';

// NOTE: this project could be interesting but it's not ready (no npm package and install via github fails)
// https://github.com/CodeByAlex/storybook-i18n-addon

// Init languages
addTranslations('en', en.default, 'English');
addTranslations('fr', fr.default, 'Français');

const INIT_LANG = window.localStorage.getItem('I18N_LANG') || 'en';

// Default to English
setLanguage(INIT_LANG);

let keyboardShortcutWasPressed = false;
window.addEventListener('keypress', ({ keyCode, altKey, ctrlKey, metaKey, shiftKey }) => {
  // "i" key
  if (keyCode === 105 && !altKey && !ctrlKey && !metaKey && !shiftKey) {
    keyboardShortcutWasPressed = true;
    (getLanguage() === 'en')
      ? setLanguage('fr')
      : setLanguage('en');
    forceReRender();
  }
});

export function i18nKnob () {

  if (keyboardShortcutWasPressed) {
    // This is very very ugly, but this trick helps to reset the knob default value
    // Maybe the knob will be updated automatically after 5.3
    // https://github.com/storybookjs/storybook/issues/8376
    color('Language');
  }

  const i18nValue = select('Language', getAvailableLanguages(), getLanguage());

  if (getLanguage() !== i18nValue && !keyboardShortcutWasPressed) {
    setLanguage(i18nValue);
  }
  window.localStorage.setItem('I18N_LANG', getLanguage());
  keyboardShortcutWasPressed = false;
}

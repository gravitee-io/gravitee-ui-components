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
import 'whatwg-fetch';

/**
 * @param {string} key - The translation key
 * @param {object} data - The translation data
 * @returns {string} - The translated
 */
export function i18n(key, data) {
  const translation = getTranslation(key);
  if (translation == null) {
    return 'unknown';
  }

  if (data) {
    const msg = i18n._messageFormatter.compile(translation);
    return msg(data);
  }

  return translation;
}

/**
 * @param {string} key - The translation key
 * @returns {null|string|function} - The translation string or function
 */
function getTranslation(key) {
  try {
    return key.split('.').reduce((prev, curr) => prev && prev[curr], i18n._translations[i18n._lang]);
  } catch (e) {
    return null;
  }
}

// Init private translation storage
i18n._translations = {};

const MessageFormat = require('messageformat');
i18n._messageFormatter = new MessageFormat(i18n._lang);

/**
 * @param {string} lang - Translation language code
 */
export function setLanguage(lang) {
  i18n._lang = lang;
}

/**
 * @returns {string} - Translation language code
 */
export function getLanguage() {
  return i18n._lang;
}

/**
 * @param {string} lang - Translation language code
 * @param {object} translations - Translation values by key
 * @param {object} label - Lang label
 */
export function addTranslations(lang, translations, label) {
  i18n._translations[lang] = { ...{ LANGUAGE: label }, ...translations };
}

/**
 * @returns {object} - All defined languages (key: human name and value: code)
 */
export function getAvailableLanguages() {
  const availableLanguages = {};
  for (const lang in i18n._translations) {
    const { LANGUAGE } = i18n._translations[lang];
    availableLanguages[LANGUAGE] = lang;
  }
  return availableLanguages;
}

export function loadDefaultTranslations() {
  setLanguage('en');
  return fetch(`/i18n/${i18n._lang}.json`)
    .then((response) => {
      return response.json();
    })
    .then((translations) => {
      addTranslations(i18n._lang, translations);
    })
    .catch((ex) => {
      // eslint-disable-next-line no-console
      console.error('[ui-components] loadDefaultTranslations - parsing failed ', ex);
    });
}

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
import { addTranslations, getLanguage, setLanguage } from '../../src/lib/i18n';

const LANGUAGE_STORAGE_KEY = 'I18N_LANG';
export const languages = [
  { key: 'en', translations: en.default, label: 'English', icon: '🇬🇧' },
  { key: 'fr', translations: fr.default, label: 'Français', icon: '🇫🇷' },
];
export const defaultLanguages = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';

languages.forEach(({ key, translations, label }) => {
  addTranslations(key, translations, label);
});

// Default to English
setLanguage(defaultLanguages);

export const i18nDecorator = (storyFn, { globals: { locale } }) => {
  setLanguage(locale);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, getLanguage());
  return storyFn();
};

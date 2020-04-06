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
export function applyTheme (theme) {
  if (theme) {
    const logo = theme._links ? theme._links.logo : theme.logo;
    const optionalLogo = theme._links ? theme._links.optionalLogo : theme.optionalLogo;
    const backgroundImage = theme._links ? theme._links.backgroundImage : theme.backgroundImage;
    updateImage('--gv-theme-logo', logo, `url('/images/gravitee-logo.png')`);
    updateImage('--gv-theme-optional-logo', optionalLogo, `url('/images/gravitee-logo-light.png')`);
    updateImage('--gv-theme-homepage-background-image', backgroundImage, `none`);
    theme.definition.data.forEach((component) => {
      component.css.forEach((cssProperty) => {
        document.documentElement.style.setProperty(cssProperty.name, cssProperty.value);
      });
    });
  }
}

export function updateImage (name, value, defaultValue) {
  setTimeout(() => {
    const propertyValue = value ? `url(${value})` : 'none';
    document.documentElement.style.setProperty(name, propertyValue);
  }, 0);
}

export function getApplicationTypeIcon (type) {
  switch (type.toLowerCase()) {
    case 'browser':
    case 'web':
      return 'devices:laptop';
    case 'native':
      return 'devices:android';
    case 'backend_to_backend':
      return 'devices:server';
    default:
      return 'layout:layout-top-panel-2';
  }
}

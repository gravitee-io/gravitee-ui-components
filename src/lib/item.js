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
import { getApplicationTypeIcon } from './theme';
import { html } from 'lit';

export function getVersion(item) {
  if (item) {
    if (item.version) {
      return item.version;
    } else if (item.applicationType) {
      const icon = getApplicationTypeIcon(item.applicationType);
      return html`<gv-icon shape="${icon}"></gv-icon>`;
    }
  }
  return null;
}

export function getTitle(item) {
  if (item) {
    return item.name;
  }
  return '';
}

export function getPicture(item) {
  if (item) {
    if (item.picture) {
      return item.picture;
    } else if (item._links && item._links.picture) {
      return item._links.picture;
    }
  }
  return null;
}

export function getBackground(item) {
  if (item) {
    if (item.background) {
      return item.background;
    } else if (item._links && item._links.background) {
      return item._links.background;
    }
  }
  return null;
}

export function getStates(item) {
  if (item) {
    return item.states;
  }
  return null;
}

export function getLabels(item) {
  if (item) {
    return item.labels;
  }
  return null;
}

export function getRating(item) {
  if (item) {
    return item.rating_summary;
  }
  return null;
}

export function getEntrypoints(item) {
  if (item) {
    return item.entrypoints || [];
  }
  return [];
}

export function getDescription(item) {
  if (item && item.description) {
    return item.description;
  }
  return '';
}

export function getOwner(item) {
  if (item && item.owner) {
    return item.owner.display_name;
  }
  return '';
}

export function getNbApisInView(item) {
  if (item && item.total_apis != null) {
    return item.total_apis;
  }
  return null;
}

export function getPictureDisplayName(item) {
  if (item) {
    if (item.version) {
      return `${getTitle(item)}  ${item.version}`;
    } else if (item.applicationType) {
      return `${getTitle(item)}  ${item.applicationType}  ${getOwner(item)}`;
    }
  }
  return getTitle(item);
}

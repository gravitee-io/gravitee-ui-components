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
import '../../src/organisms/gv-http-client';
import { html } from 'lit-element';

export default {
  title: 'Organisms/gv-http-client',
  component: 'gv-http-client',
  parameters: {
    // DO NOT REACTIVATE a11y on these stories for now as the a11y checks are taking forever to run
    a11y: { disable: true },
  },
};

export const Default = {
  render: ({ response, loading, path, method }) =>
    html` <gv-http-client .response="${response}" ?loading="${loading}" .path="${path}" .method="${method}"></gv-http-client>`,
  args: {
    loading: false,
  },
};

export const Loading = {
  ...Default,
  args: {
    loading: true,
  },
};

export const WithResponse = {
  ...Default,
  args: {
    loading: false,
    path: '/',
    method: 'GET',
    response: {
      body: '{"swagger":"2.0","info":{"title":"Solar System openData","description":"API to get all data about all solar system objects","version":"1.2.0"},"host":"api.le-systeme-solaire.net","basePath":"/rest.php","schemes":["https"],"consumes":["application/json"],"produces":["application/json"],"tags":[{"name":"bodies","description":"Object with all data about the concerned body : orbitals, physicals and atmosphere"},{"name":"knowncount","description":"Count of known objects"}],"paths":{"/bodies":{"get":{"tags":["bodies"],"summary":"List","parameters":[{"name":"data","in":"query","description":"The data you want to retrieve (comma separated). Example: id,semimajorAxis,isPlanet.","required":false,"type":"string"},{"name":"exclude","in":"query","description":"One or more data you want to exclude (comma separated). Example: id,isPlanet.","required":false,"type":"string"},{"name":"order","in":"query","description":"A data you want to sort on and the sort direction (comma separated). Example: id,desc. Only one data is authorized.","required":false,"type":"string"},{"name":"page","in":"query","description":"Page number (number>=1) and page size (size>=1 and 20 by default) (comma separated). NB: You cannot use \\"page\\" without \\"order\\"! Example: 1,10.","required":false,"type":"string"},{"name":"rowData","in":"query","description":"Transform the object in records. NB: This can also be done client-side in JavaScript!","required":false,"type":"boolean"},{"name":"filter[]","in":"query","description":"Filters to be applied. Each filter consists of a data, an operator and a value (comma separated). Example: id,eq,mars. Accepted operators are : cs (like) - sw (start with) - ew (end with) - eq (equal) - lt (less than) - le (less or equal than) - ge (greater or equal than) - gt (greater than) - bt (between). And all opposites operators : ncs - nsw - new - neq - nlt - nle - nge - ngt - nbt. Note : if anyone filter is invalid, all filters will be ignore.","required":false,"type":"array","collectionFormat":"multi","items":{"type":"string"}},{"name":"satisfy","in":"query","description":"Should all filters match (default)? Or any?","required":false,"type":"string","enum":["any"]}],"responses":{"200":{"description":"An array of bodies","schema":{"type": "object","properties": {"bodies": {"type":"array","items":{"type": "object","properties": {"id": {"type": "string"},"name": {"type": "string"},"englishName": {"type": "string"},"isPlanet": {"type": "boolean"},"moons":{"type":"array", "items":{"type":"object", "properties": {"moon" :{"type":"string"}, "rel" :{"type":"string"}}}},"semimajorAxis": {"type": "number"},"perihelion": {"type": "number"},"aphelion": {"type": "number"},"eccentricity": {"type": "number"},"inclination": {"type": "number"},"mass":{"type":"object", "properties":{ "massValue" :{"type":"number"}, "massExponent" :{"type":"integer"}}},"vol":{"type":"object", "properties":{ "volValue" :{"type":"number"}, "volExponent" :{"type":"integer"}}},"density": {"type": "number"},"gravity": {"type": "number"},"escape": {"type": "number"},"meanRadius": {"type": "number"},"equaRadius": {"type": "number"},"polarRadius": {"type": "number"},"flattening": {"type": "number"},"dimension": {"type": "string"},"sideralOrbit": {"type": "number"},"sideralRotation": {"type": "number"},"aroundPlanet":{"type":"object", "properties":{ "planet" :{"type":"string"}, "rel" :{"type":"string"}}},"discoveredBy": {"type": "string"},"discoveryDate": {"type": "string"},"alternativeName": {"type": "string"},"axialTilt": {"type": "number"},"avgTemp": {"type": "number"},"mainAnomaly": {"type": "number"},"argPeriapsis": {"type": "number"},"longAscNode": {"type": "number"},"rel":{"type":"string"}}}}}}}}}},"/bodies/{id}":{"get":{"tags":["bodies"],"summary":"read","parameters":[{"name":"id","in":"path","description":"Identifier for item.","required":true,"type":"string"}],"responses":{"200":{"description":"The requested item.","schema":{"type": "object","properties": {"id": {"type": "string"},"name": {"type": "string"},"englishName": {"type": "string"},"isPlanet": {"type": "boolean"},"moons":{"type":"array", "items":{"type":"object", "properties": {"moon" :{"type":"string"}, "rel" :{"type":"string"}}}},"semimajorAxis": {"type": "number"},"perihelion": {"type": "number"},"aphelion": {"type": "number"},"eccentricity": {"type": "number"},"inclination": {"type": "number"},"mass":{"type":"object", "properties":{ "massValue" :{"type":"number"}, "massExponent" :{"type":"integer"}}},"vol":{"type":"object", "properties":{ "volValue" :{"type":"number"}, "volExponent" :{"type":"integer"}}},"density": {"type": "number"},"gravity": {"type": "number"},"escape": {"type": "number"},"meanRadius": {"type": "number"},"equaRadius": {"type": "number"},"polarRadius": {"type": "number"},"flattening": {"type": "number"},"dimension": {"type": "string"},"sideralOrbit": {"type": "number"},"sideralRotation": {"type": "number"},"aroundPlanet":{"type":"object", "properties":{ "planet" :{"type":"string"}, "rel" :{"type":"string"}}},"discoveredBy": {"type": "string"},"discoveryDate": {"type": "string"},"alternativeName": {"type": "string"},"axialTilt": {"type": "number"},"avgTemp": {"type": "number"},"mainAnomaly": {"type": "number"},"argPeriapsis": {"type": "number"},"longAscNode": {"type": "number"}}}}}}},"/knowncount":{"get":{"tags":["knowncount"],"summary":"List","parameters":[{"name":"rowData","in":"query","description":"Transform the object in records. NB: This can also be done client-side in JavaScript!","required":false,"type":"boolean"}],"responses":{"200":{"description":"An array of knowncount","schema":{"type": "object","properties": {"knowncount": {"type":"array","items":{"type": "object","properties": {"id": {"type": "string"},"knownCount": {"type": "number"},"updateDate": {"type": "string"},"rel":{"type":"string"}}}}}}}}}},"/knowncount/{id}":{"get":{"tags":["knowncount"],"summary":"read","parameters":[{"name":"id","in":"path","description":"Identifier for item.","required":true,"type":"string"}],"responses":{"200":{"description":"The requested item.","schema":{"type": "object","properties": {"id": {"type": "string"},"knownCount": {"type": "number"},"updateDate": {"type": "string"}}}}}}}}}',
      headers: {
        'transfer-encoding': 'chunked',
        Server: 'Apache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        Connection: 'keep-alive',
        'X-Gravitee-Transaction-Id': 'dc08a805-76c9-4f27-88a8-0576c9df2790',
        'X-Gravitee-Request-Id': 'dc08a805-76c9-4f27-88a8-0576c9df2790',
        Date: 'Wed, 11 Aug 2021 12:29:05 GMT',
        'Content-Type': 'application/json; charset=utf-8',
      },
      statusCode: 505,
    },
  },
};

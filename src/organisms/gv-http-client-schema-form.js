/*
 * Copyright (C) 2021 The Gravitee team (http://gravitee.io)
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
export const gvHttpClientSchemaForm = {
  type: 'object',
  id: 'urn:jsonschema:io:gravitee:http:client',
  properties: {
    method: {
      title: 'HTTP Method',
      description: 'HTTP method to invoke the endpoint.',
      type: 'string',
      default: 'GET',
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'],
    },
    path: {
      title: 'Path',
      type: 'string',
      default: '/',
    },
    headers: {
      type: 'array',
      title: 'Request Headers',
      items: {
        type: 'object',
        title: 'Header',
        properties: {
          name: {
            title: 'Name',
            type: 'string',
          },
          value: {
            title: 'Value',
            type: 'string',
          },
        },
      },
      required: ['name', 'value'],
      default: [
        {
          name: '',
          value: '',
        },
      ],
    },
    body: {
      title: 'Request body',
      type: 'string',
      'x-schema-form': {
        type: 'codemirror',
        codemirrorOptions: {
          placeholder: 'Put request body here',
          lineWrapping: true,
          lineNumbers: true,
          allowDropFileTypes: true,
          autoCloseTags: true,
        },
      },
    },
  },
  required: ['method', 'path'],
};

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
import './gv-properties';
import { makeStory } from '../../../testing/lib/make-story';

export default {
  title: 'Organisms/gv-properties',
  component: 'gv-properties',
};

const conf = {
  component: 'gv-properties',
};

export const Empty = makeStory(conf, {
  items: [{}],
});

const properties = [
  { key: 'file.encoding', value: 'UTF-8' },
  { key: 'file.separator', value: '/' },
  { key: 'ftp.nonProxyHosts', value: 'local|*.local|169.254/16|*.169.254/16' },
  { key: 'java.awt.headless', value: 'true' },
  { key: 'java.class.path', value: '/usr/local/Cellar/gradle/6.7.1/libexec/lib/gradle-launcher-6.7.1.jar' },
  { key: 'java.class.version', value: '55.0' },
  { key: 'java.endorsed.dirs', value: '/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home/jre/lib/endorsed' },
  {
    key: 'java.ext.dirs',
    value:
      '/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home/jre/lib/ext:/Library/Java/Extensions:/Network/Library/Java/Extensions:/System/Library/Java/Extensions:/usr/lib/java',
  },
  { key: 'java.home', value: '/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home/jre' },
  { key: 'java.io.tmpdir', value: '/var/folders/8z/5q5q5q5q5q5q5q5q5q5q5q5q5q5q5/T/' },
  {
    key: 'java.library.path',
    value:
      '/Users/gravitee/Library/Java/Extensions:/Library/Java/Extensions:/Network/Library/Java/Extensions:/System/Library/Java/Extensions:/usr/lib/java:.:/usr/local/lib',
  },
  { key: 'java.runtime.name', value: 'OpenJDK Runtime Environment' },
  { key: 'java.runtime.version', value: '1.8.0_272-b10' },
  { key: 'java.specification.name', value: 'Java Platform API Specification' },
  { key: 'java.specification.vendor', value: 'Oracle Corporation' },
  { key: 'java.specification.version', value: '1.8' },
  { key: 'java.vendor', value: 'AdoptOpenJDK' },
  { key: 'java.vendor.url', value: 'https://adoptopenjdk.net/' },
  { key: 'java.vendor.url.bug', value: '' },
  { key: 'java.version', value: '1.8.0_272' },
];
const encryptedProperty = { key: 'ftp.privateToken', value: 'B9iKAXEeys3G3TcG5ont9dggbtjLAp5v', encryptable: true, encrypted: true };

export const Basics = makeStory(conf, {
  items: [
    {
      properties,
    },
  ],
});

export const BasicsEncryptable = makeStory(conf, {
  items: [
    {
      properties: [...properties, encryptedProperty],
      encryptable: true,
    },
  ],
});

export const Expert = makeStory(conf, {
  items: [
    {
      properties,
      expert: true,
    },
  ],
});

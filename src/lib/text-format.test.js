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
import { describe, expect, test } from '@jest/globals';

import { toDom } from './text-format';

describe('T E X T - F O R M A T', () => {
  describe('adoc', () => {
    test('should convert a document and read its title', async () => {
      const { title, element } = await toDom('= My title\n\nSome *text*.');

      expect(title).toEqual('My title');
      expect(element.innerHTML).toContain('<p>Some <strong>text</strong>.</p>');
    });

    test('should colorize a source block with highlight.js', async () => {
      const { element } = await toDom('[source,js]\n----\nconst a = 1;\n----');

      expect(element.querySelector('pre').getAttribute('class')).toEqual('highlight');
      expect(element.querySelector('code').getAttribute('class')).toEqual('language-js');
      expect(element.querySelector('code .hljs-keyword').textContent).toEqual('const');
    });

    test('should escape a source block written in an unsupported language', async () => {
      const { element } = await toDom('[source,unknown]\n----\nfoo <b>bar</b>\n----');

      expect(element.querySelector('code').innerHTML).toEqual('foo &lt;b&gt;bar&lt;/b&gt;');
    });

    test('should sanitize a document embedding JavaScript', async () => {
      const { element } = await toDom('```test"><img src=x onerror=alert(1)></img>');

      expect(element.querySelector('img').getAttribute('onerror')).toBeNull();
      expect(element.innerHTML).not.toContain('alert(1)');
    });
  });

  describe('markdown', () => {
    test('should convert a document', async () => {
      const { title, element } = await toDom('# My title\n\nSome **text**.', 'md');

      expect(title).toEqual('My title');
      expect(element.innerHTML).toContain('<p>Some <strong>text</strong>.</p>');
    });
  });

  test('should throw on an unsupported type', async () => {
    await expect(toDom('whatever', 'rst')).rejects.toThrow("Unsupported documentation type: 'rst'");
  });
});

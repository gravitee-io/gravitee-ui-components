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
import '../../src/molecules/gv-code';
import notes from '../../.docs/gv-code.md';
import { makeStory } from '../lib/make-story';

const htmlCode = `<span>A simple example of the live sample system in action.</span><div><div>Hello world! Welcome to Gravitee</div></div>`;
const bashCode = `curl -X POST "https://api-market-place.ai.ovh.net/sound-spleeter/process" -H "accept: application/zip" -H "X-OVH-Api-Key: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" -H "Content-Type: application/json" -d '{"url": "https://github.com/deezer/spleeter/raw/master/audio_example.mp3", "nb_stems": 5}' -o splitted_output.zip`;
const pythonCode = `@requires_authorization
def somefunc(param1='', param2=0):
    r'''A docstring'''
    if param1 > param2: # interesting
        print 'Gre\\'ater'
    return (param2 - param1 + 1 + 0b10l) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''`;

export default {
  title: 'Molecules|gv-code',
  component: 'gv-code',
  parameters: {
    notes,
  },
};

const conf = {
  component: 'gv-code',
};

export const bash = makeStory(conf, {
  items: [{ content: bashCode, lang: 'bash' }],
});

export const html = makeStory(conf, {
  items: [{ content: htmlCode }],
});

export const python = makeStory(conf, {
  items: [{ content: pythonCode, lang: 'python' }],
});

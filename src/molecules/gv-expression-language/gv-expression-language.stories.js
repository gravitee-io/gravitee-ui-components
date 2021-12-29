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
import '../gv-code';
import { makeStory, storyWait } from '../../../testing/lib/make-story';
import grammar from '../../../testing/resources/el-grammar.json';

export default {
  title: 'Molecules/gv-expression-language',
  component: 'gv-expression-language',
};

const conf = {
  component: 'gv-expression-language',
};

const shellOptions = {
  mode: 'shell',
};

const shell = `curl -X POST "https://api-market-place.ai.ovh.net/sound-spleeter/process"
     -H "accept: application/zip" -H "X-OVH-Api-Key: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
     -H "Content-Type: application/json"
     -d '{"url": "https://github.com/deezer/spleeter/raw/master/audio_example.mp3", "nb_stems": 5}'
     -o splitted_output.zip`;

export const ReadonlyClipboard = makeStory(conf, {
  items: [
    {
      value: shell,
      options: shellOptions,
      readonly: true,
      label: 'Readonly curl example with clipboard',
      clipboard: true,
      grammar,
    },
  ],
});

const html = `<span>A simple example of the live sample system in action.</span><div><div>Hello world! Welcome to Gravitee</div></div>`;

const htmlOptions = {
  mode: 'HTML',
};

const description = 'Ctrl-Shift-e/Cmd-Shift-e to insert Expression Language';

export const HTML = makeStory(conf, {
  items: [{ value: html, options: htmlOptions, required: true, grammar, description }],
});

const items = [
  { options: htmlOptions, rows: 1, grammar, small: true, label: 'Small' },
  { options: htmlOptions, rows: 1, grammar, label: 'Medium' },
  { options: htmlOptions, rows: 1, grammar, large: true, label: 'Large' },
];

export const Input = makeStory(conf, {
  items: [
    ...items.map((p) => ({ ...p, value: html })),
    ...items.map((p) => ({ ...p, required: true, description: 'Required' })),
    ...items.map((p) => ({ ...p, disabled: true, value: html, description: 'Disabled' })),
    ...items.map((p) => ({ ...p, clipboard: true, value: html, description: 'Clipboard' })),
  ],
});

const python = `@requires_authorization
def somefunc(param1='', param2=0):
    r'''A docstring'''
    if param1 > param2: # interesting
        print 'Gre\\'ater'
    return (param2 - param1 + 1 + 0b10l) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''`;

const pythonOptions = {
  mode: 'python',
};

export const Python = makeStory(conf, {
  items: [{ value: python, options: pythonOptions, grammar }],
});

const xmlSrc = `<?xml version="1.0" encoding="UTF-8"?>
<foo>
  <bar></bar>
</foo>`;

const xmlOptions = {
  mode: 'xml',
};

export const EmptyXml = makeStory(conf, {
  items: [{ placeholder: 'Put the body content here', options: xmlOptions, grammar }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.placeholder = 'Put the XML content here';
    }),
  ],
});

export const Xml = makeStory(conf, {
  items: [{ value: xmlSrc, options: xmlOptions, grammar }],
});

const applicationJsonSrc = `{
  "id": "foobar",
  "data": []
}`;

const applicationJsonOptions = {
  mode: 'json',
};

export const applicationJson = makeStory(conf, {
  items: [
    {
      value: applicationJsonSrc,
      placeholder: 'Put the body content here',
      options: applicationJsonOptions,
      grammar,
    },
  ],
});

const jsSrc = `const transform => (items = []) {
  return items.map((item, index) => ({ ...item, ...{ index } }));
}
`;

const jsOptions = {
  mode: 'javascript',
};

export const Javascript = makeStory(conf, {
  items: [{ value: jsSrc, placeholder: 'Put the body content here', options: jsOptions, grammar }],
});

const jsonSrc = `{
  "id": "foobar",
  "data": []
}`;

const jsonOptions = {
  mode: 'json',
};

export const Json = makeStory(conf, {
  items: [{ value: jsonSrc, placeholder: 'Put the body content here', options: jsonOptions, grammar }],
});

const groovySrc = `println 'Hello'

int power(int n) { 2**n }

println "2^6==\${power(6)}"
`;

const groovyOptions = {
  mode: 'groovy',
};

export const Groovy = makeStory(conf, {
  items: [{ value: groovySrc, placeholder: 'Put the body content here', options: groovyOptions, grammar }],
});

const markdownSrc = `GitHub Flavored Markdown
========================

Everything from markdown plus GFM features:

## URL autolinking

Underscores_are_allowed_between_words.

## Strikethrough text

GFM adds syntax to strikethrough text, which is missing from standard Markdown.

~~Mistaken text.~~
~~**works with other formatting**~~

~~spans across
lines~~

## Fenced code blocks (and syntax highlighting)

\`\`\`javascript
for (var i = 0; i < items.length; i++) {
    console.log(items[i], i); // log them
}
\`\`\`

## Task Lists

- [ ] Incomplete task list item
- [x] **Completed** task list item

## A bit of GitHub spice

See http://github.github.com/github-flavored-markdown/.

(Set \`gitHubSpice: false\` in mode options to disable):

* SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* \\#Num: #1
* User/#Num: mojombo#1
* User/Project#Num: mojombo/god#1

(Set \`emoji: false\` in mode options to disable):

* emoji: :smile:
`;

const markdownOptions = {
  mode: 'markdown',
};

export const markdown = makeStory(conf, {
  items: [{ value: markdownSrc, placeholder: 'Put the body content here', options: markdownOptions, grammar }],
});

const textSrc = 'Simple text';

const textOptions = {
  mode: 'text',
};

export const Text = makeStory(conf, {
  items: [{ value: textSrc, placeholder: 'Put the body content here', options: textOptions, grammar }],
});

const asciiDocOptions = {
  mode: 'asciidoc',
};

const asciiDocSrc = `= AsciiDoc Article Title
3.0, July 29, 2022: AsciiDoc article template
:toc:
:icons: font
:url-quickref: https://docs.asciidoctor.org/asciidoc/latest/syntax-quick-reference/

Content entered directly below the header but before the first section heading is called the preamble.

== First level heading

This is a paragraph with a *bold* word and an _italicized_ word.

.Image caption
image::image-file-name.png[I am the image alt text.]

This is another paragraph.footnote:[I am footnote text and will be displayed at the bottom of the article.]

=== Second level heading

.Unordered list title
* list item 1
** nested list item
*** nested nested list item 1
*** nested nested list item 2
* list item 2

This is a paragraph.

.Example block title
====
Content in an example block is subject to normal substitutions.
====

.Sidebar title
****
Sidebars contain aside text and are subject to normal substitutions.
****

==== Third level heading

[#id-for-listing-block]
.Listing block title
----
Content in a listing block is subject to verbatim substitutions.
Listing block content is commonly used to preserve code input.
----

===== Fourth level heading

.Table title
|===
|Column heading 1 |Column heading 2

|Column 1, row 1
|Column 2, row 1

|Column 1, row 2
|Column 2, row 2
|===

====== Fifth level heading

[quote, firstname lastname, movie title]
____
I am a block quote or a prose excerpt.
I am subject to normal substitutions.
____

[verse, firstname lastname, poem title and more]
____
I am a verse block.
  Indents and endlines are preserved in verse blocks.
____

== First level heading

TIP: There are five admonition labels: Tip, Note, Important, Caution and Warning.

// I am a comment and won't be rendered.

. ordered list item
.. nested ordered list item
. ordered list item

The text at the end of this sentence is cross referenced to <<_third_level_heading,the third level heading>>

== First level heading

This is a link to the https://docs.asciidoctor.org/home/[Asciidoctor documentation].
This is an attribute reference {url-quickref}[that links this text to the AsciiDoc Syntax Quick Reference].`;

export const AsciiDoc = makeStory(conf, {
  items: [{ value: asciiDocSrc, placeholder: 'Put the body content here', options: asciiDocOptions, grammar }],
});

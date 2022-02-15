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
import './gv-code';
import { makeStory, storyWait } from '../../../testing/lib/make-story';

export default {
  title: 'Molecules/gv-code',
  component: 'gv-code',
};

const conf = {
  component: 'gv-code',
};

const jsonSrc = `{
  "id": "foobar",
  "data": []
}`;

export const Json = makeStory(conf, {
  items: [{ value: jsonSrc, placeholder: 'Put the body content here' }],
});

const jsonLarge = JSON.stringify(
  {
    clientOrderNumber: '1111111111',
    countryCode: 'ES',
    orderType: 'B',
    orderDate: '2022-01-25',
    orderReason: 'Order Reason',
    currencyCode: 'ES',
    poReference: '1111111111',
    manualIntervention: 'NO',
    agentName: 'Test Agent',
    orderSource: 'Test Order',
    subTotal: 100,
    tax: 20,
    totalValue: 120,
    accountManager: '',
    orderlines: [
      {
        deliveryLine: '1',
        materialNumber: 'Test',
        quantity: '1',
        unitPrice: '93.85',
        promotionCode: 'AAA',
        'promotionDescription:': 'Nice promo',
        orderUom: 'PCE',
        itemCategory: 'XXX',
        stockLocation: 'PRO',
        laserText: 'Hello',
        wrappingText: 'Test WrappingText',
        customisation: 'Test Customisation',
        productName: 'GHD GMAX FG UK POLL',
        wrapQuantity: 0,
        unitTax: 26.85,
        taxRate: 20,
        virtualWarehouse: 'A001',
        lineDiscount: {
          code: 'XYZ',
          value: 2.0,
        },
      },
      {
        deliveryLine: '2',
        materialNumber: '10000022967',
        quantity: '3',
        unitPrice: '93.85',
        promotionCode: 'XYZ',
        orderUom: 'PCE',
        itemCategory: 'AA',
        stockLocation: 'PRO',
        laserText: 'Test LAserText',
        wrappingText: 'Test Wrapping Text',
        customisation: 'Test Customisation',
        productName: 'MAX PRO',
        wrapQuantity: 0,
        unitTax: 26.85,
        taxRate: 20,
        virtualWarehouse: 'A001',
        lineDiscount: {
          code: 'GGG',
          value: 2.0,
        },
      },
    ],
    deliveryCustomer: {
      customerType: 'deliveryCustomer',
      fullName: 'Salsa Delivery',
      firstName: 'Salsa',
      lastName: 'Delivery',
      clientCustomerId: '12345',
      addressLine1: 'Test Adress',
      addressLine2: 'address2',
      addressLine3: 'address3',
      town: 'Test',
      county: 'Test',
      postcode: '23232',
      countryCode: 'ES',
      emailAddress: 'marija.timovska@gmail.com',
      telephoneNumber: '071235917',
      company: 'Great Company',
      etage: 'etage1',
      codePorte: 'Porte1',
    },
    OrderingCustomer: {
      customerType: 'orderingCustomer',
      fullName: 'Test Test',
      firstName: 'Test',
      lastName: 'Order',
      addressLine2: 'addressline3',
      addressLine3: 'addressline3 ',
      town: 'Madrid',
      postcode: 'LS11 5BZ',
      countryCode: 'ES',
      emailAddress: 'marija.timovska@gmail.com',
      nationalNumber: '',
      company: 'ssss',
      etage: 'ssseee',
      codePorte: 'sdsddsd',
    },
    deliveryInfo: {
      deliveryDate: '2022-01-27',
      deliveryNet: 0,
      deliveryTax: 0,
      deliveryTaxRate: 0,
      deliveryTotal: 0,
      deliveryMethod: 'CP24',
      deliveryInstructions: 'cp24',
    },
    collectInfo: {
      collectStoreId: 'WQAO',
      collectPhoneNumber: '071235917',
      collectEmail: 'marija.timovska@gmail.com',
      collectInfo1: 'info1',
      collectInfo2: 'info2',
      collectInfo3: 'info3',
      collectInfo4: 'info4',
      collectInfo5: 'info5',
      collectInfo6: 'info6',
    },
    origin: {
      originApplication: 'Salsa',
      originIdentifier: 'Salsa',
      countryCode: 'ES',
      eCommStore: '',
      SAPOrderTypeOverwrite: 'N',
    },
    payment: {
      paymentType: 'P',
      paymentTerms: 'Test Test',
      cardType: 'PP',
      cardholder: 'Marija Timovska',
      authorisationCode: '6329278291196431504047',
      authorisationExpiry: '202111',
      authorisedAmount: '17.55',
      merchantID: 'Test',
      paymentInfo: '6329278291196431504047',
      PPRequestToken: 'AxjrrwSTUvvsySzf+cIUAH9PhJdM97U+El00qtzod8OCUEMmkmVdHpM6WpNS++tqWMm+DKIAtAlt',
      PPTransactionId: '4S7350409Y662940G',
      PPOrderId: 'O-4XG438205P909742Y',
    },
    giftCardPayment: {
      giftCardUsed: 'No',
      giftCardValue: 0,
    },
    additionalInfo: {
      info1: 'test1',
      info2: 'test2',
      info3: 'test3',
      info4: 'test4',
      info5: 'test5',
    },
  },
  null,
  2,
);

export const JsonLarge = makeStory(conf, {
  items: [{ value: jsonLarge }],
});

export const JsonUpdated = makeStory(conf, {
  items: [{ value: jsonSrc, placeholder: 'Put the body content here' }],
  simulations: [
    storyWait(1500, ([component]) => {
      component.value = jsonLarge;
    }),
  ],
});

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
    },
  ],
});

const html = `<span>A simple example of the live sample system in action.</span><div><div>Hello world! Welcome to Gravitee</div></div>`;

const htmlOptions = {
  mode: 'HTML',
};

export const HTML = makeStory(conf, {
  items: [{ value: html, options: htmlOptions, required: true }],
});

const items = [
  { options: htmlOptions, rows: 1, small: true, label: 'Small' },
  { options: htmlOptions, rows: 1, label: 'Medium' },
  { options: htmlOptions, rows: 1, large: true, label: 'Large' },
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
  items: [{ value: python, options: pythonOptions }],
});

const xmlSrc = `<?xml version="1.0" encoding="UTF-8"?>
<foo>
  <bar></bar>
</foo>`;

const xmlOptions = {
  mode: 'xml',
};

export const EmptyXml = makeStory(conf, {
  items: [{ placeholder: 'Put the body content here', options: xmlOptions }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.placeholder = 'Put the XML content here';
    }),
  ],
});

export const Xml = makeStory(conf, {
  items: [{ value: xmlSrc, options: xmlOptions }],
});

const jsSrc = `const transform => (items = []) {
  return items.map((item, index) => ({ ...item, ...{ index } }));
}
`;

const jsOptions = {
  mode: 'javascript',
};

export const Javascript = makeStory(conf, {
  items: [{ value: jsSrc, placeholder: 'Put the body content here', options: jsOptions }],
});

const groovySrc = `println 'Hello'

int power(int n) { 2**n }

println "2^6==\${power(6)}"
`;

const groovyOptions = {
  mode: 'groovy',
};

export const Groovy = makeStory(conf, {
  items: [{ value: groovySrc, placeholder: 'Put the body content here', options: groovyOptions }],
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
  items: [{ value: markdownSrc, placeholder: 'Put the body content here', options: markdownOptions }],
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
  items: [{ value: asciiDocSrc, placeholder: 'Put the body content here', options: asciiDocOptions }],
});

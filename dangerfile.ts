import { danger, markdown } from 'danger';

const modifiedDefinitionJson = danger.git.fileMatch('src/theme/definition.json');

if (modifiedDefinitionJson.edited) {
  markdown(`
Hey dear reviewer, I'm the Gravitee.io bot :robot:

I just want to tell you that \`definition.json\` has been updated in this PR. As this file is used to theme clients' portals you should carefully review it to avoid any regression!

Also, after merging this PR, you should update the \`definition.json\` of [APIM Rest API](https://github.com/gravitee-io/gravitee-management-rest-api).
`);
}

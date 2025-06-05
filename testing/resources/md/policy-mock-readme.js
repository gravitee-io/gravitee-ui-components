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
/* eslint-disable no-useless-escape */
export const policyCalloutReadme = `= Callout Policy
## Overview
You can use the \`callout-http\` policy to invoke an HTTP(S) URL and place a subset or all of the content in
one or more variables of the request execution context.

This can be useful if you need some data from an external service and want to inject it during request
processing.

The result of the callout is placed in a variable called \`calloutResponse\` and is only available during policy
execution. If no variable is configured the result of the callout is no longer available.





## Errors
You can use the response template feature to override the default response provided by the policy.
These templates are be defined at the API level, in "Entrypoint" section for V4 Apis, or in "Response Templates" for V2 APIs.

The error keys sent by this policy are as follows:

| Key |
| ---  |
| CALLOUT_EXIT_ON_ERROR |
| CALLOUT_HTTP_ERROR |
`;

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
export const policyMockReadme = `= Mock Policy
:source-highlighter: highlightjs

ifdef::env-github[]
image:https://ci.gravitee.io/buildStatus/icon?job=gravitee-io/gravitee-policy-mock/master["Build status", link="https://ci.gravitee.io/job/gravitee-io/job/gravitee-policy-mock/"]
image:https://badges.gitter.im/Join Chat.svg["Gitter", link="https://gitter.im/gravitee-io/gravitee-io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"]
endif::[]

== Phase

|===
|onRequest|onResponse

|X
|

|===

== Description

Mock policy is providing you with the ability to create mocked response when a consumer is calling one of your services.
This way, you do not have to provide a functional backend and it gives you more time to think about your API contract.

You can think this policy as a contract-first approach since you are able to create a fully-functional API without the
need to write any line of code to handle consumer calls.

Internally, this policy replace the default HTTP invoker by putting a mock invoker. There is no more HTTP call between
the gateway and a remote service / backend.

When defining response body content, you can use the internal Expression Language to provide a dynamic mock.

[source, xml]
.Body content example (xml)
----
<user id="{#request.paths[3]}">
    <firstname>{#properties['firstname_' + #request.paths[3]]}</firstname>
	<lastname>{#properties['lastname_' + #request.paths[3]]}</lastname>
	<age>{(T(java.lang.Math).random() * 60).intValue()}</age>
	<createdAt>{(new java.util.Date()).getTime()}</createdAt>
</user>
----

[source, json]
.Body content example (json)
----
{
    "id": "{#request.paths[3]}",
    "firstname": "{#properties['firstname_' + #request.paths[3]]}",
    "lastname": "{#properties['lastname_' + #request.paths[3]]}",
    "age": {(T(java.lang.Math).random() * 60).intValue()},
    "createdAt": {(new java.util.Date()).getTime()}
}
----

Also, you don't have to take care about the _Content-Type_ header since Mock policy is able to detect automatically the
content type.

== Configuration

You can configure the policy with the following options :

|===
|Property |Required |Description |Type |Default

|status|X|HTTP Status Code|integer|
|headers|X|HTTP Headers|Array of HTTP headers|
|content|X|HTTP Body content|string|

|===


[source, json]
.Configuration example
----
"mock": {
    "status": "200",
    "headers": [
        {
            "name": "Content-Type",
            "value": "application/json"
        }, {
            "name": "Server",
            "value": "Gravitee.io"
        }
    ],
    "content": "<user id=\\"{#request.paths[3]}\\">\\n\\t<firstname>{#properties['firstname_' + #request.paths[3]]}</firstname>\\n\\t<lastname>{#properties['lastname_' + #request.paths[3]]}</lastname>\\n\\t<age>{(T(java.lang.Math).random() * 60).intValue()}</age>\\n\\t<createdAt>{(new java.util.Date()).getTime()}</createdAt>\\n</user>"
}
----


=== Links

https://discuss.asciidoctor.org[Discuss Asciidoctor,role=external,window=_blank]

https://discuss.asciidoctor.org
`;

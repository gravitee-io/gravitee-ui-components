# [3.42.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.41.1...v3.42.0) (2023-06-27)


### Features

* use gioConfig.banner.text as description by default ([6dec123](https://github.com/gravitee-io/gravitee-ui-components/commit/6dec1239bda75698eb7eba01b0cbc195264f355c))

## [3.41.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.41.0...v3.41.1) (2023-06-16)


### Bug Fixes

* downgrade `[@storybook](https://github.com/storybook)` to `6.4` to fix docs ([716bc6e](https://github.com/gravitee-io/gravitee-ui-components/commit/716bc6ee8e482683a22ebe69c75fc7607eff1dab))
* sanitize Asciidoc content to avoid XSS attacks ([0372368](https://github.com/gravitee-io/gravitee-ui-components/commit/0372368ed7939b6c84da8482bb8b5cc52a7fa483))

# [3.41.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.40.0...v3.41.0) (2023-06-09)


### Features

* better support AM Flow icons ([f1650dc](https://github.com/gravitee-io/gravitee-ui-components/commit/f1650dc5e8108cc84dd978ebadd1d68a2cde0ec8))

# [3.40.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.6...v3.40.0) (2023-05-30)


### Features

* improve customization of gv-chart-gauge-progress ([4350493](https://github.com/gravitee-io/gravitee-ui-components/commit/43504934d7cc93a5f10b36ce31e55fedcc019a5b))

## [3.39.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.5...v3.39.6) (2023-05-16)


### Bug Fixes

* **gv-policy-studio:** resolve drag and drop on FF linux ([b8baf6e](https://github.com/gravitee-io/gravitee-ui-components/commit/b8baf6eadaa58aae07075149b23316d112a697f1))

## [3.39.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.4...v3.39.5) (2023-05-09)


### Bug Fixes

* use `hc-key` ref in map to ensure china is properly identified ([05a0896](https://github.com/gravitee-io/gravitee-ui-components/commit/05a089698471e53959adb51bed9758453c93f0e1)), closes [33579#p117910](https://github.com/33579/issues/p117910)

## [3.39.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.3...v3.39.4) (2023-05-05)


### Bug Fixes

* **gv-chart-gauge-progress:** simplify component ([bdf4ac0](https://github.com/gravitee-io/gravitee-ui-components/commit/bdf4ac0febb3f5f831176b96804996422b2f1f6a))

## [3.39.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.2...v3.39.3) (2023-05-04)


### Bug Fixes

* keep name text aline left when is long string ([b5158cc](https://github.com/gravitee-io/gravitee-ui-components/commit/b5158cc6b58c8e96603b6f5f7ff923f1b17b3f1b))

## [3.39.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.1...v3.39.2) (2023-05-04)


### Bug Fixes

* export gv-chart-gauge-progress component ([6d61727](https://github.com/gravitee-io/gravitee-ui-components/commit/6d61727fa625c58996f36e84d91cd367cc49e3d0))

## [3.39.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.39.0...v3.39.1) (2023-05-03)


### Bug Fixes

* emit change event on key input change ([3d8529e](https://github.com/gravitee-io/gravitee-ui-components/commit/3d8529e6e492acd6d8340f90b199559fe6123635))

# [3.39.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.12...v3.39.0) (2023-05-03)


### Features

* add gv-chart-gauge-progress component ([e40c5f0](https://github.com/gravitee-io/gravitee-ui-components/commit/e40c5f04d0e82b1062d031fb2ff05281eb41588c))

## [3.38.12](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.11...v3.38.12) (2023-04-14)


### Bug Fixes

* dispatch input event to work with Angular's ngDefaultControl ([93250ae](https://github.com/gravitee-io/gravitee-ui-components/commit/93250aeedda9ca45b541d44000fd094f2c678444))

## [3.38.11](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.10...v3.38.11) (2023-04-05)


### Bug Fixes

* **gv-table:** pagination issue when number of items don't divide by the page size ([1e6e473](https://github.com/gravitee-io/gravitee-ui-components/commit/1e6e4739e26587e7576a7f63335babeae4f6f183))

## [3.38.10](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.9...v3.38.10) (2023-03-31)


### Bug Fixes

* **gv-select:** correctly display and place option list when used in a small container ([3942165](https://github.com/gravitee-io/gravitee-ui-components/commit/3942165632c36327ca617a83e0a0c5b4a5a5e733))

## [3.38.9](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.8...v3.38.9) (2023-03-29)


### Bug Fixes

* **gv-input:** remove search icon in password mode ([c199fde](https://github.com/gravitee-io/gravitee-ui-components/commit/c199fde25977a21b3d36743bafdaf9c794d088b1))
* **gv-schema-form:** handle disabled state on input with x-schema-form condition when loading ([755fdcc](https://github.com/gravitee-io/gravitee-ui-components/commit/755fdcc69384d662f25f0a2942589e58b985499c))

## [3.38.8](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.7...v3.38.8) (2023-03-07)


### Bug Fixes

* **gv-chart-line:** use more column in tooltip to avoid length issue with lots of series ([c6a57f9](https://github.com/gravitee-io/gravitee-ui-components/commit/c6a57f9d86d22efe4aae5ceb50103abe966b2a2c))

## [3.38.7](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.6...v3.38.7) (2023-03-06)


### Bug Fixes

* **gv-properties:** handle page size update ([d0de1b1](https://github.com/gravitee-io/gravitee-ui-components/commit/d0de1b15be3cfa7c8efed0f9f4ef83fe59a41653))

## [3.38.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.5...v3.38.6) (2023-03-06)


### Bug Fixes

* **gv-policy-studio:** handle plans named with a special character ([a5e6510](https://github.com/gravitee-io/gravitee-ui-components/commit/a5e6510e7ba3f2fe39fbacc20b7c7e78f3ca45a1))

## [3.38.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.4...v3.38.5) (2023-02-03)


### Bug Fixes

* **gv-button:** remove useless css rule ([dfb3294](https://github.com/gravitee-io/gravitee-ui-components/commit/dfb32941425f03e221b88d77aa30468e8ce41429))

## [3.38.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.3...v3.38.4) (2022-12-20)


### Bug Fixes

* **gv-icon:** load icon only if has shape ([b4b08de](https://github.com/gravitee-io/gravitee-ui-components/commit/b4b08de7ccb106096196d5390257f2be456e0f48))

## [3.38.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.2...v3.38.3) (2022-12-20)


### Bug Fixes

* **gv-date-picker:** fix range time mode ([dd6f4c3](https://github.com/gravitee-io/gravitee-ui-components/commit/dd6f4c3fc156ae7445bf9bc67446bdc92da929ce))

## [3.38.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.1...v3.38.2) (2022-12-15)


### Bug Fixes

* **gv-date-picker:** fix range time mode ([9c9eb9e](https://github.com/gravitee-io/gravitee-ui-components/commit/9c9eb9e40d9df38655a655226bf07adfd393b08d))

## [3.38.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.38.0...v3.38.1) (2022-12-14)


### Bug Fixes

* **gv-input:** dispatch submit event only on required icon ([91c267b](https://github.com/gravitee-io/gravitee-ui-components/commit/91c267bd90dcfe604da1e98827e0895b6b03b687))

# [3.38.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.37.1...v3.38.0) (2022-12-09)


### Features

* add new gv-shema-form-group ([29470ec](https://github.com/gravitee-io/gravitee-ui-components/commit/29470ec093950f1b9a471093a04586405edd476f))

## [3.37.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.37.0...v3.37.1) (2022-11-14)


### Bug Fixes

* keep event listener for gv-cron-editor when disabled state change ([a8b0bc3](https://github.com/gravitee-io/gravitee-ui-components/commit/a8b0bc3e9fa7759fd26302ea4e0ea995f5288a7a))

# [3.37.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.36.2...v3.37.0) (2022-11-14)


### Features

* add disabled state for gv-cron-editor ([6e81ce0](https://github.com/gravitee-io/gravitee-ui-components/commit/6e81ce0363850f24359e59c86a6b9ee2b1e10f18))

## [3.36.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.36.1...v3.36.2) (2022-08-16)


### Bug Fixes

* **gv-design:** wait for subcomponent to be rendered before interacting with it ([4d92dad](https://github.com/gravitee-io/gravitee-ui-components/commit/4d92dad7edb288fdf158d4275c72c45c08fa4643))

## [3.36.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.36.0...v3.36.1) (2022-06-16)


### Bug Fixes

* avoid UnhandledPromiseRejection error with flows pre ([2fbadf8](https://github.com/gravitee-io/gravitee-ui-components/commit/2fbadf86dacae2304ad8b9ab8a4b22dc9461b8b0))
* reword flow-mode into flow_mode ([0426178](https://github.com/gravitee-io/gravitee-ui-components/commit/0426178ab246d00ca75896e2741d7fe68e67daed))

# [3.36.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.35.3...v3.36.0) (2022-06-10)


### Features

* hide closed plans in design studio ([ac74aa0](https://github.com/gravitee-io/gravitee-ui-components/commit/ac74aa040d3d1c2d780cc70eb75bc1a5da2e0c18))

## [3.35.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.35.2...v3.35.3) (2022-05-20)


### Bug Fixes

* rework event handling in gv-rating-list to fix click on `Answer button` ([238c6a5](https://github.com/gravitee-io/gravitee-ui-components/commit/238c6a5f74d4d01c95a30f25399a746a3781c652))

## [3.35.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.35.1...v3.35.2) (2022-05-17)


### Bug Fixes

* properly setup confirm in tables ([3dd9629](https://github.com/gravitee-io/gravitee-ui-components/commit/3dd9629d692b18b516d811af496b8bf5e4d0f936))

## [3.35.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.35.0...v3.35.1) (2022-04-21)


### Bug Fixes

* **gv-icon:** use svg lit directive ([46a4706](https://github.com/gravitee-io/gravitee-ui-components/commit/46a470662802efe1fde721315206c3978518b3b4))

# [3.35.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.34.0...v3.35.0) (2022-04-14)


### Features

* reword API properties screen title ([c5f4abc](https://github.com/gravitee-io/gravitee-ui-components/commit/c5f4abc9f8546795466a5fbf88d76fcda4e5c10b))

# [3.34.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.33.1...v3.34.0) (2022-04-11)


### Features

* change and add icons for AM flows ([53aa841](https://github.com/gravitee-io/gravitee-ui-components/commit/53aa8419106ace01b3a56e03b97dfb988fa2b1a5)), closes [gravitee-io/issues#7470](https://github.com/gravitee-io/issues/issues/7470)

## [3.33.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.33.0...v3.33.1) (2022-03-30)


### Bug Fixes

* async import asciidoctor properly ([e3540f1](https://github.com/gravitee-io/gravitee-ui-components/commit/e3540f1f67c0a0aefb302f9a5a5a92f6e606c81d))

# [3.33.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.32.0...v3.33.0) (2022-03-24)


### Features

* load asciidoctor & asciidoctor-highlight.js separately ([7921d16](https://github.com/gravitee-io/gravitee-ui-components/commit/7921d1620a6ee5a4e97645371510d58978fdad78))

# [3.32.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.31.3...v3.32.0) (2022-03-23)


### Features

* add code:if icon ([833f0b5](https://github.com/gravitee-io/gravitee-ui-components/commit/833f0b51765cbe6f6401169ec9dee8a278606bff))
* **policy-studio:** use new condition icon ([17abf43](https://github.com/gravitee-io/gravitee-ui-components/commit/17abf431d76a2d1ea787ec23535879775ef6fb02))

## [3.31.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.31.2...v3.31.3) (2022-03-22)


### Bug Fixes

* remove unnecessary `changedProperties` ([d26102a](https://github.com/gravitee-io/gravitee-ui-components/commit/d26102a7cd37c0e3df18ce4a24353ce37032ee7a))


### Performance Improvements

* add webpack config to limit languages imported by the dependencies ([428d81a](https://github.com/gravitee-io/gravitee-ui-components/commit/428d81aeba455e0ab8c6ae02d4d2a21a4fe94a86))

## [3.31.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.31.1...v3.31.2) (2022-03-22)


### Bug Fixes

* **gv-schema-form:** remove useless compact attribute ([92f7aae](https://github.com/gravitee-io/gravitee-ui-components/commit/92f7aaec909c6827e7f5c0a1ac097b2268f194c6)), closes [gravitee-io/issues#7022](https://github.com/gravitee-io/issues/issues/7022)

## [3.31.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.31.0...v3.31.1) (2022-03-18)


### Bug Fixes

* not click twice to validate policy schema-form ([fef57be](https://github.com/gravitee-io/gravitee-ui-components/commit/fef57be79f2698799aff4ea3a3e098448be2365c))

# [3.31.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.30.1...v3.31.0) (2022-02-25)


### Features

* add icons for new AM flows ([045e760](https://github.com/gravitee-io/gravitee-ui-components/commit/045e76040855488940d202785f351fd255197609))

## [3.30.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.30.0...v3.30.1) (2022-02-22)


### Bug Fixes

* **gv-policy-studio:** auto submit dirty form if is necessary ([c223623](https://github.com/gravitee-io/gravitee-ui-components/commit/c223623838e653a46a4a177f64baaa4a5e5898fb))

# [3.30.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.29.4...v3.30.0) (2022-02-16)


### Features

* handle policy studio with dynamic save-bar ([4253551](https://github.com/gravitee-io/gravitee-ui-components/commit/4253551ce253d6aedcbe068889bff0de39dd5640))

## [3.29.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.29.3...v3.29.4) (2022-02-16)


### Bug Fixes

* **gv-code:** resolve display of large json ([17740d0](https://github.com/gravitee-io/gravitee-ui-components/commit/17740d0060e4247715c9702a2114e0eef9c4bc11)), closes [gravitee-io/issues#7017](https://github.com/gravitee-io/issues/issues/7017)

## [3.29.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.29.2...v3.29.3) (2022-02-15)


### Bug Fixes

* **gv-code:** fix the value update ([9e3abd4](https://github.com/gravitee-io/gravitee-ui-components/commit/9e3abd4ac72dcefb198c481c819d631efc571789))

## [3.29.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.29.1...v3.29.2) (2022-02-09)


### Reverts

* Revert "fix(gv-design): remove change event when user select step" ([4b6ca8c](https://github.com/gravitee-io/gravitee-ui-components/commit/4b6ca8c02f308b8bc88e43b8d097647cf5e73ecc))

## [3.29.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.29.0...v3.29.1) (2022-02-09)


### Bug Fixes

* **gv-design:** auto submit dirty form if is necessary ([98120e2](https://github.com/gravitee-io/gravitee-ui-components/commit/98120e2aaa5ca22938f7483fe4e81e6a9eefd444))
* **gv-design:** remove change event when user select step ([96d1971](https://github.com/gravitee-io/gravitee-ui-components/commit/96d1971564f6a3426ca2ebb91cfa145a13b28da7))
* **gv-design:** use step form to dispatch change during d&d ([d096afd](https://github.com/gravitee-io/gravitee-ui-components/commit/d096afd8175af7c20e4cc0e64f0733165c0b0d58))

# [3.29.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.8...v3.29.0) (2022-02-08)


### Bug Fixes

* **gv-design:** improve default value management ([21dee73](https://github.com/gravitee-io/gravitee-ui-components/commit/21dee73451bd42fc6b23a368597b93a76ae709ae))
* **gv-policy-studio:** improve default value management ([ef6db7e](https://github.com/gravitee-io/gravitee-ui-components/commit/ef6db7e55ea7db70518d7bae36bb69f008f0284d))
* **gv-properties:** change keyboard binding to prevent conflict with gv-expression-language ([eb7f2d9](https://github.com/gravitee-io/gravitee-ui-components/commit/eb7f2d979569e5f0be3f1aef48ed630e298b9c2f))
* **gv-proverties:** resolve form btn position ([52464ab](https://github.com/gravitee-io/gravitee-ui-components/commit/52464aba91ff92d957a6040ff2958e6f9923f996))
* **gv-resources:** change keyboard binding to prevent conflict with gv-expression-language ([61bfbd2](https://github.com/gravitee-io/gravitee-ui-components/commit/61bfbd25d709a33025d6ccb311d5b0e6874a190a))
* **gv-resources:** improve default value management ([a0f8d1a](https://github.com/gravitee-io/gravitee-ui-components/commit/a0f8d1adabf0387b6fa1e6ee6f909b0f56f228cf))
* **gv-schema-form:** resolve isValid fn ([d8e59b2](https://github.com/gravitee-io/gravitee-ui-components/commit/d8e59b2f46b4340f876f7812a347be557f54cc76))
* **gv-schema-form:** set an empty array to enum control when selection is empty ([56f32f0](https://github.com/gravitee-io/gravitee-ui-components/commit/56f32f0b20d9c1b9cfc3cc4887b8f317970361a7))


### Features

* **events:** expose ComponentCustomEvent type ([13912ac](https://github.com/gravitee-io/gravitee-ui-components/commit/13912acbae1c886d23c8f172378283b60dbb6142))
* **gv-design:** fires change event when content change ([c64e90a](https://github.com/gravitee-io/gravitee-ui-components/commit/c64e90a3b304fe6891d50f75c8a5d4d7e76e9dcb))
* **gv-policy-studio:** fork gv-policy-studio to gv-design ([51a46b3](https://github.com/gravitee-io/gravitee-ui-components/commit/51a46b383a9b29a138ee3089142df8511dc150c7))
* **gv-properties:** submit form with keyboard ([f852988](https://github.com/gravitee-io/gravitee-ui-components/commit/f85298855cc9deebd1f27231cb94ddc15bb2c901))
* **gv-schema-form:** submit form with keyboard ([5c4c13c](https://github.com/gravitee-io/gravitee-ui-components/commit/5c4c13cdf9146b3d8bb9fb0d157447bb556987a1))

## [3.28.8](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.7...v3.28.8) (2022-02-07)


### Reverts

* Revert "ci: remove manual approval to run chromatic job" ([f689c66](https://github.com/gravitee-io/gravitee-ui-components/commit/f689c66f35f6040e38104ce5a1e41d1b00873300))

## [3.28.7](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.6...v3.28.7) (2022-01-25)


### Bug Fixes

* revert "chore(deps): update dependency semantic-release to v19" ([774a023](https://github.com/gravitee-io/gravitee-ui-components/commit/774a02312f92cf28419e36b137be9ebda7c6d256))

## [3.28.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.5...v3.28.6) (2022-01-25)


### Bug Fixes

* override href from asciidoctor ToC ([cdee38e](https://github.com/gravitee-io/gravitee-ui-components/commit/cdee38e70bfab381ca71b0814481e5ee85bced8c))

## [3.28.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.4...v3.28.5) (2022-01-17)


### Bug Fixes

* explicitly add `.js` ending for each lit import ([3cc5217](https://github.com/gravitee-io/gravitee-ui-components/commit/3cc52174bd0298fdd64788dee96e6af5e5e6d04e))

## [3.28.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.3...v3.28.4) (2022-01-17)


### Bug Fixes

* explicitly add `.js` ending for each lit import ([f29de1e](https://github.com/gravitee-io/gravitee-ui-components/commit/f29de1ec19fc04012fde6e432aa2c07df50436e6))

## [3.28.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.2...v3.28.3) (2022-01-17)


### Bug Fixes

* **i18n:** mark label param as optional in addTranslations method ([01af567](https://github.com/gravitee-io/gravitee-ui-components/commit/01af5677c97304972c7baa1ccca99b0eb345b87c))

## [3.28.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.1...v3.28.2) (2022-01-13)


### Bug Fixes

* **style:** mark defaultValue param as optional in getCssVar ([359649c](https://github.com/gravitee-io/gravitee-ui-components/commit/359649c9b0a8b81c5f3bebdac3fb89dbac35ef27))

## [3.28.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.28.0...v3.28.1) (2022-01-13)


### Bug Fixes

* **gv-policy-studio:** change keyboard binding to prevent conflict with gv-expression-language ([0d065de](https://github.com/gravitee-io/gravitee-ui-components/commit/0d065de6a1579690ffe5bb6e69ff6c7128732a01))
* **input:** remove the call to reportValidity to prevent autofocus on the field in error ([65ad3dc](https://github.com/gravitee-io/gravitee-ui-components/commit/65ad3dc0946db6b9cb140ebb63db40f352eb3d53))

# [3.28.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.27.3...v3.28.0) (2022-01-10)


### Bug Fixes

* **gv-pagination:** resolve keyboard commands ([c1785cc](https://github.com/gravitee-io/gravitee-ui-components/commit/c1785cc3d9779bc6f24ba8adcb1f55ac6deb7da5))


### Features

* **gv-pagination:** add optional page size selector ([49339dd](https://github.com/gravitee-io/gravitee-ui-components/commit/49339dd5323c65981a987e5247b9172316f490c3))
* **gv-pagination:** add small/medium/large properties to custom size of fields ([bd7b038](https://github.com/gravitee-io/gravitee-ui-components/commit/bd7b0389af820396d5a1e21aed5853200d7b4be1))
* **gv-pagination:** add title with usefull informations on active btn ([bfde1ae](https://github.com/gravitee-io/gravitee-ui-components/commit/bfde1ae66637102f69eb843369653dc33678f260))

## [3.27.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.27.2...v3.27.3) (2022-01-10)


### Bug Fixes

* pin `colors` version to avoid vulnerability ([e7de803](https://github.com/gravitee-io/gravitee-ui-components/commit/e7de8032f604213bbfc6a170e40f421d2528558c))

## [3.27.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.27.1...v3.27.2) (2022-01-07)


### Bug Fixes

* **gv-policy-studio:** ensure optional tabs order ([8cbcd6e](https://github.com/gravitee-io/gravitee-ui-components/commit/8cbcd6ea5f050e56fd42fcc8ce8064f20c05495e))

## [3.27.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.27.0...v3.27.1) (2022-01-07)


### Bug Fixes

* **gv-http-client:** fix Lit import for repeat directive ([af29790](https://github.com/gravitee-io/gravitee-ui-components/commit/af29790fa097c88403206954fc4de66a0c063f89))

# [3.27.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.26.0...v3.27.0) (2021-12-29)


### Features

* add conditional flow icon ([f7e2582](https://github.com/gravitee-io/gravitee-ui-components/commit/f7e25829156533ca2b317402cedbde1adb9c0923))
* add conditional policy tooltip on icon ([2642977](https://github.com/gravitee-io/gravitee-ui-components/commit/26429773f89a59989f907d0de2212f5c676d2eac))

# [3.26.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.25.4...v3.26.0) (2021-12-29)


### Features

* improve conditional policy icon style ([c57be13](https://github.com/gravitee-io/gravitee-ui-components/commit/c57be1303472baafc989dc82dd9f865c0ed696d9))

## [3.25.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.25.3...v3.25.4) (2021-12-29)


### Bug Fixes

* fix parameter type in i18n function ([4beeb63](https://github.com/gravitee-io/gravitee-ui-components/commit/4beeb63437bc6dbf1ee439ef4ab79ad946d22cac))

## [3.25.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.25.2...v3.25.3) (2021-12-22)


### Bug Fixes

* keep conditional value when policy is moved ([67f1513](https://github.com/gravitee-io/gravitee-ui-components/commit/67f1513c314f6962f9e10b1bca211aa842b2cf1e))
* prefix description and condition with `common` ([6225123](https://github.com/gravitee-io/gravitee-ui-components/commit/6225123364a75e6fc878967d41bc9144a9f2d145))

## [3.25.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.25.1...v3.25.2) (2021-12-22)


### Bug Fixes

* init additionalProperties with an empty object to allow them ([6245972](https://github.com/gravitee-io/gravitee-ui-components/commit/62459723f03c4a612ab24120dd1d264f68f11a59)), closes [a32fa3dd4f315f7ce1/lib/attribute.js#L303](https://github.com/a32fa3dd4f315f7ce1/lib/attribute.js/issues/L303)

## [3.25.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.25.0...v3.25.1) (2021-12-21)


### Bug Fixes

* use lit instead lit-html to import classMap ([80bd439](https://github.com/gravitee-io/gravitee-ui-components/commit/80bd43915e53213d69e09175ce27a2875b4af68c))

# [3.25.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.5...v3.25.0) (2021-12-21)


### Features

* add conditional step management ([be0af4c](https://github.com/gravitee-io/gravitee-ui-components/commit/be0af4ce77077642f695a9fae8aa1951de72612c))
* add conditional top left icon inside flow step ([48aacff](https://github.com/gravitee-io/gravitee-ui-components/commit/48aacffb374f60429a8a02256b1c944a37afe65f))
* add groups option for schema forms ([ef78a40](https://github.com/gravitee-io/gravitee-ui-components/commit/ef78a4093ab42dfe0f67f3580595273bf2a32813))
* separate description of the other policy settings ([be9160c](https://github.com/gravitee-io/gravitee-ui-components/commit/be9160c73182f4c25ea048eb39826b1ffe9cde44))

## [3.24.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.4...v3.24.5) (2021-12-20)


### Bug Fixes

* **gv-expression-language:** resolve grammar completion ([01c4728](https://github.com/gravitee-io/gravitee-ui-components/commit/01c4728b3a09b68443d1f6f4d168ff41e98690d1))
* **gv-policy-studio:** remove conflicting behavior with the ESC key ([6f6ccbf](https://github.com/gravitee-io/gravitee-ui-components/commit/6f6ccbf85621a3237ef437dcc60f21cee99b0f7b))
* **input:** report validation problems to the user ([fa55646](https://github.com/gravitee-io/gravitee-ui-components/commit/fa55646e86966e24b7ab67e7949080e2b1afd6d2))

## [3.24.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.3...v3.24.4) (2021-12-16)


### Bug Fixes

* remove unnecessary perform update ([1b8fee6](https://github.com/gravitee-io/gravitee-ui-components/commit/1b8fee6711bf1af63bf40ca9aca2fac570590076))

## [3.24.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.2...v3.24.3) (2021-12-15)


### Bug Fixes

* resolve will update implementation ([e4a8076](https://github.com/gravitee-io/gravitee-ui-components/commit/e4a8076358a0715734cc03fa9023fc0fb7d9029f))

## [3.24.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.1...v3.24.2) (2021-12-14)


### Bug Fixes

* revert unneeded changed introduced in `upgrade to Lit 2` ([f0aef5f](https://github.com/gravitee-io/gravitee-ui-components/commit/f0aef5f7ffc97b139ebc8a5f5947f3ed5acc5cea))
* wait for Lit component to be ready before updating their properties ([3baf7df](https://github.com/gravitee-io/gravitee-ui-components/commit/3baf7dfe1fec74ab6778eceebfde6dd8a5061b65))

## [3.24.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.24.0...v3.24.1) (2021-12-13)


### Bug Fixes

* upgrade date-fns from 2.24.0 to 2.26.0 ([a7a5324](https://github.com/gravitee-io/gravitee-ui-components/commit/a7a532425fc33ae2fd210c2707c1d45785eaf5a9))

# [3.24.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.23.0...v3.24.0) (2021-12-08)


### Features

* upgrade to Lit 2 ([8cff25a](https://github.com/gravitee-io/gravitee-ui-components/commit/8cff25a937957e126d61dd88684bc5a77c5a8446))

# [3.23.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.22.0...v3.23.0) (2021-11-23)


### Features

* add owner in gv-card-full like gv-row ([ce30d92](https://github.com/gravitee-io/gravitee-ui-components/commit/ce30d927d2b488a3609e233a83dc3ab61f189bf0))
* add owner in gv-propot like gv-row ([e400807](https://github.com/gravitee-io/gravitee-ui-components/commit/e4008072026b1327ddf8cddfee5d39475f1bed11))

# [3.22.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.7...v3.22.0) (2021-11-16)


### Features

* add new gv-select-native component based on `select` ([db7677e](https://github.com/gravitee-io/gravitee-ui-components/commit/db7677e08cfd962e9ad09f15330db35cd3cf4b31)), closes [#251](https://github.com/gravitee-io/gravitee-ui-components/issues/251)
* **gv-select:** improve with design pattern listbox ([0b68119](https://github.com/gravitee-io/gravitee-ui-components/commit/0b68119ede7a78d5ff4a467de90844a244d9ab4b))

## [3.21.7](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.6...v3.21.7) (2021-11-15)


### Bug Fixes

* upgrade @formatjs/intl-locale from 2.4.39 to 2.4.40 ([1442e55](https://github.com/gravitee-io/gravitee-ui-components/commit/1442e55016d79d358002c029586608935a558abe))

## [3.21.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.5...v3.21.6) (2021-11-10)


### Bug Fixes

* update theme due to auto upgrade ([4a826de](https://github.com/gravitee-io/gravitee-ui-components/commit/4a826de2e613492c8324df83b61c4ab138b32724))

## [3.21.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.4...v3.21.5) (2021-11-10)


### Bug Fixes

* **gv-schema-form:** wait browser refresh before update ([796ba74](https://github.com/gravitee-io/gravitee-ui-components/commit/796ba743942f285e5a3c4a390ab25895ced1f904)), closes [gravitee-io/issues#6514](https://github.com/gravitee-io/issues/issues/6514)

## [3.21.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.3...v3.21.4) (2021-11-10)


### Bug Fixes

* **gv-policy-studio:** force dirty state & submit valid forms ([5408aa3](https://github.com/gravitee-io/gravitee-ui-components/commit/5408aa3c43cf185869fb1dc6ff2cb2d7e7dba208)), closes [gravitee-io/issues#6517](https://github.com/gravitee-io/issues/issues/6517)

## [3.21.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.2...v3.21.3) (2021-11-08)


### Bug Fixes

* upgrade @formatjs/intl-relativetimeformat from 9.3.1 to 9.3.2 ([fa69158](https://github.com/gravitee-io/gravitee-ui-components/commit/fa69158a44d118dda8d70f572a86292e37a55de7))

## [3.21.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.1...v3.21.2) (2021-11-08)


### Bug Fixes

* upgrade @formatjs/intl-locale from 2.4.38 to 2.4.39 ([7e84a88](https://github.com/gravitee-io/gravitee-ui-components/commit/7e84a880083075c234a2d4d44d0f0e0b0cdf3afe))

## [3.21.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.21.0...v3.21.1) (2021-11-02)


### Bug Fixes

* upgrade codemirror from 5.63.1 to 5.63.2 ([7c41589](https://github.com/gravitee-io/gravitee-ui-components/commit/7c415896dfdd1fc71178804101d9f2bec3988fc8))

# [3.21.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.20.2...v3.21.0) (2021-10-27)


### Bug Fixes

* **gv-code:** makes it possible to add tab in single line mode ([56580e8](https://github.com/gravitee-io/gravitee-ui-components/commit/56580e8b1fb69e6d95e92156be3cf92f50fc8fb1))
* **gv-schema-form:** accept empty string with enum type ([c7f5809](https://github.com/gravitee-io/gravitee-ui-components/commit/c7f5809efea2f441e3c3a0064d60b7f6e9a599bf))
* **gv-schema-form:** resolve display for inline object ([d007a04](https://github.com/gravitee-io/gravitee-ui-components/commit/d007a04641e6c8444decc721a2184a2d85d388c6))


### Features

* **gv-schema-form:** add conditional & dependencies fields support ([73d64d2](https://github.com/gravitee-io/gravitee-ui-components/commit/73d64d2c08f81e30d1a422c7009867f7782dbbc5))
* **gv-schema-form:** add custom error message support ([42019c8](https://github.com/gravitee-io/gravitee-ui-components/commit/42019c81784b9a889ccd9f9b3e3e33a3c1e58ce5))
* **gv-schema-form:** add option to control expand state ([bbcc1fe](https://github.com/gravitee-io/gravitee-ui-components/commit/bbcc1fe231b052a8c214a7d1297058d12d4cb98b))
* **gv-schema-form:** ignore additionalProperties ([72e2924](https://github.com/gravitee-io/gravitee-ui-components/commit/72e2924bed29ae0b8e527dfc8c7667dcba15264d))

## [3.20.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.20.1...v3.20.2) (2021-10-25)


### Bug Fixes

* **gv-code:** define extension of files to load for a specific CodeMirror mode ([ab12130](https://github.com/gravitee-io/gravitee-ui-components/commit/ab1213059d27516d65fbbe2a34ce184f1e3d2a4e))

## [3.20.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.20.0...v3.20.1) (2021-10-21)


### Bug Fixes

* upgrade codemirror from 5.63.0 to 5.63.1 ([ef2d2b5](https://github.com/gravitee-io/gravitee-ui-components/commit/ef2d2b5c5d6eaa83e10d2450582e5027aeb7bb70))

# [3.20.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.19.1...v3.20.0) (2021-10-19)


### Features

* make gv-state text-transform and font-weight customizable ([3e23389](https://github.com/gravitee-io/gravitee-ui-components/commit/3e23389ef1ff1aef1ce34a9ef3b391ab241ab375))

## [3.19.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.19.0...v3.19.1) (2021-10-19)


### Bug Fixes

* upgrade @formatjs/intl-locale from 2.4.37 to 2.4.38 ([3059cf4](https://github.com/gravitee-io/gravitee-ui-components/commit/3059cf4822389dddbcee6a67f2b35af3fd7db10f))

# [3.19.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.18.1...v3.19.0) (2021-10-19)


### Bug Fixes

* **gv-input:** use the right icon for the input password ([8ff51c8](https://github.com/gravitee-io/gravitee-ui-components/commit/8ff51c8c08c57ba588d764cf43d5e1a77e60f418))
* **gv-text:** use rows attribute as default in autosize mode ([a23c7f4](https://github.com/gravitee-io/gravitee-ui-components/commit/a23c7f4a9fb0419c1385e60c04f3c02374cc4a1f))


### Features

* **gv-schema-form:** add description in array field ([4f509f3](https://github.com/gravitee-io/gravitee-ui-components/commit/4f509f31ebffb06f5bf5420cd8b57347a7c167fa))
* **gv-schema-form:** display array elements on one line when it's possible ([14d0284](https://github.com/gravitee-io/gravitee-ui-components/commit/14d02841ef6a4c96cd9adf3358763d5c20a675d8))
* **gv-schema-form:** display object with many fields on a grid ([2ada1c6](https://github.com/gravitee-io/gravitee-ui-components/commit/2ada1c6f4798147eff731e25301271d195653f3d))
* **gv-schema-form:** improve text type support ([adc6ca1](https://github.com/gravitee-io/gravitee-ui-components/commit/adc6ca198448319b3e2e0c1f341964a220ca279c))
* **gv-schema-form:** manage OR conditions for hidden/disabled fields ([03347cd](https://github.com/gravitee-io/gravitee-ui-components/commit/03347cd16a155b7c59a3e5668bfdc03db4fa8389))

## [3.18.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.18.0...v3.18.1) (2021-10-19)


### Bug Fixes

* upgrade @formatjs/intl-relativetimeformat from 9.3.0 to 9.3.1 ([4e66b4c](https://github.com/gravitee-io/gravitee-ui-components/commit/4e66b4ca3cbf119f3c47f86d3f9cdde6655cebf3))

# [3.18.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.7...v3.18.0) (2021-10-18)


### Bug Fixes

* **gv-schema-form:** solve the dynamic validation of attributes in the whole tree ([5084a9d](https://github.com/gravitee-io/gravitee-ui-components/commit/5084a9d47c74e06b5f920a5f02fda035436215f3))


### Features

* **gv-schema-form:** add background-color css variable ([eeff1e3](https://github.com/gravitee-io/gravitee-ui-components/commit/eeff1e31a34f478d6a687f515deee5a826490106))
* **gv-schema-form:** add control margin css variable ([c434203](https://github.com/gravitee-io/gravitee-ui-components/commit/c43420326418b6ae5ab1a8fac21c87d264b59b2b))
* **gv-schema-form:** add support for text type ([87a4da9](https://github.com/gravitee-io/gravitee-ui-components/commit/87a4da9a7b392bcbd68f30100e172cc6d2b58c92))
* **gv-schema-form:** display object with 2 fields only on one line ([2bca726](https://github.com/gravitee-io/gravitee-ui-components/commit/2bca7265509880299f40911f24326a84a4129c37))
* **gv-schema-form:** wrap object to gv-expandable component ([c05e042](https://github.com/gravitee-io/gravitee-ui-components/commit/c05e042cf434634c1ad0e14a5346527f5d2ef009))

## [3.17.7](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.6...v3.17.7) (2021-10-18)


### Bug Fixes

* upgrade @formatjs/intl-relativetimeformat from 9.2.3 to 9.3.0 ([1e23f55](https://github.com/gravitee-io/gravitee-ui-components/commit/1e23f55e0c24d57b38ef7432c2d7fead2cf8c225))

## [3.17.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.5...v3.17.6) (2021-10-14)


### Bug Fixes

* **gv-input:** click on search icon should submit in gv-input ([4e3ddde](https://github.com/gravitee-io/gravitee-ui-components/commit/4e3dddeb3af31c548ff0c72b22d00584d9f2f9ce)), closes [gravitee-io/issues#5323](https://github.com/gravitee-io/issues/issues/5323)

## [3.17.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.4...v3.17.5) (2021-10-12)


### Bug Fixes

* upgrade codemirror from 5.59.2 to 5.63.0 ([22a57b1](https://github.com/gravitee-io/gravitee-ui-components/commit/22a57b186f20fc4fc3df88ef0b237a408e9b8851))

## [3.17.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.3...v3.17.4) (2021-10-12)


### Bug Fixes

* upgrade date-fns from 2.17.0 to 2.24.0 ([02c3466](https://github.com/gravitee-io/gravitee-ui-components/commit/02c34661b68a74f1b7c680c4c552c515ae087a67))

## [3.17.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.2...v3.17.3) (2021-10-08)


### Bug Fixes

* revert upgrade to Lit 2 to fix gv-icon issues ([76015e8](https://github.com/gravitee-io/gravitee-ui-components/commit/76015e87386efdb684a2601ffef7f39e796c9a43))

## [3.17.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.1...v3.17.2) (2021-10-07)


### Bug Fixes

* **gv-icon:** fix icon display in app using AngularJS ([f952a96](https://github.com/gravitee-io/gravitee-ui-components/commit/f952a968cc2cf565b79d3d5590756aa1442019cc))

## [3.17.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.17.0...v3.17.1) (2021-10-07)


### Bug Fixes

* **gv-icon:** fix icon display in app using AngularJS ([8845c1f](https://github.com/gravitee-io/gravitee-ui-components/commit/8845c1f87faeceecebb0a3e2816faba49c50edb7))

# [3.17.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.16.1...v3.17.0) (2021-09-30)


### Features

* upgrade to Lit 2 ([2e49a9c](https://github.com/gravitee-io/gravitee-ui-components/commit/2e49a9cae49d9313f4027499bf789de6f9727980))

## [3.16.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.16.0...v3.16.1) (2021-09-27)


### Bug Fixes

* **deps:** update dependency @formatjs/intl-relativetimeformat to v9 ([74fd204](https://github.com/gravitee-io/gravitee-ui-components/commit/74fd20447df9577ac5e8d250cac4819cc44cb682))

# [3.16.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.15.0...v3.16.0) (2021-09-21)


### Features

* update ColorPalette to match new colors ([6487018](https://github.com/gravitee-io/gravitee-ui-components/commit/648701883481bfd83616cdca22f7d09030f1f54e))

# [3.15.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.14.0...v3.15.0) (2021-09-21)


### Bug Fixes

* add missing ref to `gv-http-client` ([50ee284](https://github.com/gravitee-io/gravitee-ui-components/commit/50ee284f1acfe95fc199aca0459d161e3a23598e))


### Features

* add stop circle icons ([8830b99](https://github.com/gravitee-io/gravitee-ui-components/commit/8830b9996ab88a10e00e41f2067b0d9891aac21b))

# [3.14.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.13.2...v3.14.0) (2021-09-21)


### Features

* **gv-table:** add cell value as title of a cell ([93e9f0f](https://github.com/gravitee-io/gravitee-ui-components/commit/93e9f0f59f86c0e9ad764e273e93a0554a8983dc)), closes [#453](https://github.com/gravitee-io/gravitee-ui-components/issues/453)

## [3.13.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.13.1...v3.13.2) (2021-09-17)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([a816b43](https://github.com/gravitee-io/gravitee-ui-components/commit/a816b430d341c26c1599f7f705627026bd7f87e5))

## [3.13.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.13.0...v3.13.1) (2021-09-16)


### Bug Fixes

* do not shrink row content if there are a lot of metadata ([053a1ab](https://github.com/gravitee-io/gravitee-ui-components/commit/053a1ab12539fb8d2227f95b4beda39f3735934f)), closes [gravitee-io/issues#5761](https://github.com/gravitee-io/issues/issues/5761)

# [3.13.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.12.1...v3.13.0) (2021-08-26)


### Features

* **gv-properties:** add property encryption toggle ([ee6ae0f](https://github.com/gravitee-io/gravitee-ui-components/commit/ee6ae0f214664e00febee6df8765627b970d5b8b))
* **gv-properties:** ux improvements on api properties screen ([ddf232b](https://github.com/gravitee-io/gravitee-ui-components/commit/ddf232bd7ffa695f773f5c6ca55b75a45207d2e5))

## [3.12.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.12.0...v3.12.1) (2021-08-25)


### Bug Fixes

* **gv-http-client:** remove default header value ([95a911a](https://github.com/gravitee-io/gravitee-ui-components/commit/95a911aded441e4b45dfecf0943b4e0c5d9dbd8e))

# [3.12.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.11.2...v3.12.0) (2021-08-24)


### Bug Fixes

* **gv-schema-form:** use alternative to hide control, codemirror does not like ([ca4fc9c](https://github.com/gravitee-io/gravitee-ui-components/commit/ca4fc9c970637806e15025b50759653a4523be6e))


### Features

* **gv-schema-form:** add simple hidden field support ([17b5e64](https://github.com/gravitee-io/gravitee-ui-components/commit/17b5e64df44da79dfdb92e20e2590f7bcc0337fb)), closes [gravitee-io/issues#5948](https://github.com/gravitee-io/issues/issues/5948)
* **gv-schema-form:** add support to evaluate AND & OR condition in ([f83680e](https://github.com/gravitee-io/gravitee-ui-components/commit/f83680ee1a6178fb67986dc648c5251e8bb97974)), closes [gravitee-io/issues#5972](https://github.com/gravitee-io/issues/issues/5972)

## [3.11.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.11.1...v3.11.2) (2021-08-16)


### Bug Fixes

* **gv-policy-studio:** use correct icon and name for `try it` tab ([fecc56e](https://github.com/gravitee-io/gravitee-ui-components/commit/fecc56e429efa12966511a80cafb08c5b7c374f0))

## [3.11.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.11.0...v3.11.1) (2021-08-13)


### Bug Fixes

* **gv-http-client:** export schema form in a JS file to include it in the released package ([32183de](https://github.com/gravitee-io/gravitee-ui-components/commit/32183de359c291e6dea8dae6f72811454248e55f))

# [3.11.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.6...v3.11.0) (2021-08-13)


### Features

* handle debug mode ([9a507df](https://github.com/gravitee-io/gravitee-ui-components/commit/9a507df6dd458e6791ff81b9831f4b5fd4da9944)), closes [gravitee-io/issues#5803](https://github.com/gravitee-io/issues/issues/5803)

## [3.10.6](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.5...v3.10.6) (2021-08-04)


### Bug Fixes

* **deps:** update dependency clipboard-copy to v4 ([f4228e0](https://github.com/gravitee-io/gravitee-ui-components/commit/f4228e00c49657c1a1fe9ed78c1757df3b89f521))

## [3.10.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.4...v3.10.5) (2021-08-04)


### Bug Fixes

* **gv-expression-language:** resolve autocompletion in xml/html mode ([8623e63](https://github.com/gravitee-io/gravitee-ui-components/commit/8623e63e2f9872431c15c2ff5ea2d05a0af6b510))

## [3.10.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.3...v3.10.4) (2021-07-30)


### Bug Fixes

* **gv-policy-studio:** make dynamic properties backward compatible ([0e894f5](https://github.com/gravitee-io/gravitee-ui-components/commit/0e894f5de4d212bbff0d56b1eabed4940a8c9bb2)), closes [gravitee-io/issues#5910](https://github.com/gravitee-io/issues/issues/5910)

## [3.10.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.2...v3.10.3) (2021-07-21)


### Bug Fixes

* fix release by disabling husky hooks on CI ([a343bc9](https://github.com/gravitee-io/gravitee-ui-components/commit/a343bc9be36ab5af04878aa471d529c0c6c75520))

## [3.10.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.1...v3.10.2) (2021-07-21)


### Bug Fixes

* **deps:** update dependency jdenticon to v3 ([acc6cd8](https://github.com/gravitee-io/gravitee-ui-components/commit/acc6cd89800033b5a719dab63e242a49ff70d647))

## [3.10.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.10.0...v3.10.1) (2021-07-05)


### Bug Fixes

* **gv-icon:** revert devices icons update ([79a54ec](https://github.com/gravitee-io/gravitee-ui-components/commit/79a54ec2eade62ff342ca42946e503f1a9fdb3f7))

# [3.10.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.9.2...v3.10.0) (2021-07-03)


### Features

* **build:** remove source minification when building the package ([a115847](https://github.com/gravitee-io/gravitee-ui-components/commit/a11584726af6af627d0abe7b93443a93f87ef563))

## [3.9.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.9.1...v3.9.2) (2021-07-01)


### Bug Fixes

* **gv-code:** manage "application/json" type ([f2c8714](https://github.com/gravitee-io/gravitee-ui-components/commit/f2c8714312972854511a9a4910d7710c3ebc8733))
* **gv-code:** send an event when value is copied to clipboard ([68ad3c1](https://github.com/gravitee-io/gravitee-ui-components/commit/68ad3c13d1aeb26910dbb5f03d1dc9885ddffd12))

## [3.9.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.9.0...v3.9.1) (2021-07-01)


### Bug Fixes

* **gv-code:** re-activate clipboard icon ([3a5c64c](https://github.com/gravitee-io/gravitee-ui-components/commit/3a5c64cfb0aebe34854523fd46ebbce04760da95))

# [3.9.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.8.2...v3.9.0) (2021-06-28)


### Features

* **gv-chart-gauge:** update gauge chart options ([46a38eb](https://github.com/gravitee-io/gravitee-ui-components/commit/46a38eb4c3d40d1e794b88e365f5880f8c25b935))

## [3.8.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.8.1...v3.8.2) (2021-06-25)


### Bug Fixes

* reset flow id to avoid flow overriding in AM ([bb645ed](https://github.com/gravitee-io/gravitee-ui-components/commit/bb645ed517d572fc92b6d091fe5be1a6a96203d4))
* **gv-policy-studio:** allow to reset condition ([9f84aff](https://github.com/gravitee-io/gravitee-ui-components/commit/9f84affbcd76db1ec3711b5d7710b470955b565c)), closes [#388](https://github.com/gravitee-io/gravitee-ui-components/issues/388)
* **gv-policy-studio:** resolve consecutive saves ([3b9833d](https://github.com/gravitee-io/gravitee-ui-components/commit/3b9833dbae6423e478f1cadbcd5d934bd14e031a))

## [3.8.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.8.0...v3.8.1) (2021-06-24)


### Bug Fixes

* **gv-documentation:** resolve code preview ([b6b2413](https://github.com/gravitee-io/gravitee-ui-components/commit/b6b24135975096513a7597cf5141ed53531cfc21))

# [3.8.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.7.0...v3.8.0) (2021-06-22)


### Features

* **gv-documenation:** add possibility to override empty msg ([f8fe870](https://github.com/gravitee-io/gravitee-ui-components/commit/f8fe8706f0d59997d47dd0fbbcd703a0c61d6e30))

# [3.7.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.6.0...v3.7.0) (2021-06-22)


### Features

* add a bunch of icons coming from Material Icons ([4be7ef3](https://github.com/gravitee-io/gravitee-ui-components/commit/4be7ef3e2236960fa3d491c0691a56c9b251f90b))
* update Gravitee.io icon ([bda95ea](https://github.com/gravitee-io/gravitee-ui-components/commit/bda95ea761fe1e20657baf21b5fd087cf0c67d29))

# [3.6.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.5.0...v3.6.0) (2021-06-21)


### Features

* **gv-documentation:** update to handle asciidoc outside policy studio ([925f511](https://github.com/gravitee-io/gravitee-ui-components/commit/925f511f23656eeaa662b62f91154199568e5030))

# [3.5.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.4.1...v3.5.0) (2021-06-21)


### Bug Fixes

* **gv-schema-form:** force touch state when ask validation on render and form is dirty ([e53d5f2](https://github.com/gravitee-io/gravitee-ui-components/commit/e53d5f2129cf5ca4c1fc698a63dd838424391dfe))
* **gv-table:** prevent dispatch of select event when cell have an element with listeners ([d65b8b5](https://github.com/gravitee-io/gravitee-ui-components/commit/d65b8b59ababff7cbc2325e0a53722975dbe18dc))


### Features

* **gv-resouces:** improve resources list ([2235ca0](https://github.com/gravitee-io/gravitee-ui-components/commit/2235ca018ddcffbf985dafe796579e00e15b3730))
* **gv-schema-form:** add hidden field support ([93ac9f6](https://github.com/gravitee-io/gravitee-ui-components/commit/93ac9f66dc76a0e3881cf3c896694df83ddea07b))
* **gv-schema-form:** implement readOnly property support ([c1bcb94](https://github.com/gravitee-io/gravitee-ui-components/commit/c1bcb9489489796820de99da53f6e51ad6282d56))
* **gv-schema-form:** implement writeOnly property support ([3b743c6](https://github.com/gravitee-io/gravitee-ui-components/commit/3b743c6c86949d54bd7192b777f059e222b5416d))
* **gv-schema-form:** use control label instead of key in error message ([8ecf2d6](https://github.com/gravitee-io/gravitee-ui-components/commit/8ecf2d6ff47970668263a220bc38626b5e246f77))

## [3.4.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.4.0...v3.4.1) (2021-06-17)


### Bug Fixes

* **gv-policy-studio:** mark flow as dirty only if has changed ([fa9c6c2](https://github.com/gravitee-io/gravitee-ui-components/commit/fa9c6c2f8a2f2c73726eea3b2fac505eb4001911)), closes [#376](https://github.com/gravitee-io/gravitee-ui-components/issues/376)

# [3.4.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.3.0...v3.4.0) (2021-06-15)


### Bug Fixes

* **gv-expression-language:** hide label if not use ([cff4675](https://github.com/gravitee-io/gravitee-ui-components/commit/cff46750c019fe17c043d8c8bc502827655f2cb7)), closes [gravitee-io/issues#5719](https://github.com/gravitee-io/issues/issues/5719)


### Features

* **gv-expression-language:** add inner mode for 'hint' element ([d31702d](https://github.com/gravitee-io/gravitee-ui-components/commit/d31702d304ba05b762fc29b8fe9c3d028e74768c)), closes [gravitee-io/issues#5719](https://github.com/gravitee-io/issues/issues/5719)
* **gv-expression-language:** add support of autofocus attribute ([5bbfa95](https://github.com/gravitee-io/gravitee-ui-components/commit/5bbfa9530e72c7754c3163584d2479a73ca89ab6)), closes [gravitee-io/issues#5719](https://github.com/gravitee-io/issues/issues/5719)

# [3.3.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.2.0...v3.3.0) (2021-06-10)


### Features

* create flow structure based on the flow schema ([330e8f8](https://github.com/gravitee-io/gravitee-ui-components/commit/330e8f84e7f52e4ab944e1ba86ed9ebb02175a7f)), closes [gravitee-io/gravitee-ui-components#349](https://github.com/gravitee-io/gravitee-ui-components/issues/349)

# [3.2.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.1.0...v3.2.0) (2021-06-10)


### Bug Fixes

* use correct CSS variable for background color of danger button ([2a5be23](https://github.com/gravitee-io/gravitee-ui-components/commit/2a5be23b22afa0e6cf0dbafefaec21ea9576693f))


### Features

* add a CSS variable to define box-shadow color of `gv-input` in invalid state ([3b8761a](https://github.com/gravitee-io/gravitee-ui-components/commit/3b8761aaf006388f61ee579344f3e098b8ecb6c1))
* add a stylesheet with theme variables for the Consoles ([2fd2542](https://github.com/gravitee-io/gravitee-ui-components/commit/2fd2542e6a8e7983f947a1c37e71607ab828a743))
* update logos with the new ones ([728c805](https://github.com/gravitee-io/gravitee-ui-components/commit/728c805a450dab8737cb95fd5f0f733ad1c2e9ee))

# [3.1.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.0.1...v3.1.0) (2021-06-10)


### Bug Fixes

* **gv-schema-form-control:** update simple properties when is required ([ca929e3](https://github.com/gravitee-io/gravitee-ui-components/commit/ca929e3fe005ba4fb1f9ced8154aae6b299db1ac))


### Features

* add DSL to disable a field that matches some condition ([6502e7b](https://github.com/gravitee-io/gravitee-ui-components/commit/6502e7bdb110af8645f3c9bb3ffbfd9267d86fda)), closes [gravitee-io/gravitee-ui-components#350](https://github.com/gravitee-io/gravitee-ui-components/issues/350)

## [3.0.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v3.0.0...v3.0.1) (2021-06-09)


### Bug Fixes

* **gv-expression-language:** resolve hint overlay ([a9837f2](https://github.com/gravitee-io/gravitee-ui-components/commit/a9837f22a9b9212cf951e20ddf70be1a0434e6b6)), closes [gravitee-io/issues#4943](https://github.com/gravitee-io/issues/issues/4943) [#364](https://github.com/gravitee-io/gravitee-ui-components/issues/364)

# [3.0.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.9.1...v3.0.0) (2021-05-31)


### chore

* move @highcharts/map-collection to peerDependencies ([0b73f1c](https://github.com/gravitee-io/gravitee-ui-components/commit/0b73f1c58810f523aac7b345ea02e7b2724628ae))
* move asciidoctor, asciidoctor-highlight.js and highlight to peerDependencies ([bef1847](https://github.com/gravitee-io/gravitee-ui-components/commit/bef184733864eba172ce336d52fd53d3f87e49a2))
* move highcharts to peerDependencies ([39525e3](https://github.com/gravitee-io/gravitee-ui-components/commit/39525e368bda496b3e686c7051b3bd5362682b75))


### BREAKING CHANGES

* Some dependencies are no longer shipped with this package.
So project using asciidoc related components must install the dependencies directly.
To do so, after updating `@gravitee/ui-components`, just run:
```bash
npm i asciidoctor asciidoctor-highlight.js highlight
yarn add asciidoctor asciidoctor-highlight.js highlight
```

This has been done in order to:
- ensure we are using the version from user's project and avoid having duplicated versions
- reduce the size of this package by making these dependencies optional peer dependencies.
And so allow skipping them for project not using any AsciiDoc related components.
* The dependency `highcharts` is no longer shipped with `@gravitee/ui-components.
So project using any map chart must install the dependency directly.
To do so, after updating `@gravitee/ui-components`, just run:
```bash
npm i highcharts
yarn add highcharts
```

This has been done in order to:
 - ensure we are using the version from user's project and avoid having duplicated versions
 - reduce the size of this package by making this dependency an optional peer dependency.
 And so allow skipping this dependency for project not using any map charts.
* The dependency `@highcharts/map-collection` is no longer shipped with this package.

So project using any map chart must install the dependency directly.
To do so, after updating `@gravitee/ui-components`, just run:

```bash
npm i @highcharts/map-collection
yarn add @highcharts/map-collection
```

This has been done in order to:
 - ensure we are using the version from user's project and avoid having duplicated versions
 - reduce the size of this package by making this dependency an optional peer dependency.
 And so allow skipping this dependency for project not using any map charts.

## [2.9.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.9.0...v2.9.1) (2021-05-27)


### Bug Fixes

* **management:** platform policies rollback error throwing when no policy ([fbf75af](https://github.com/gravitee-io/gravitee-ui-components/commit/fbf75aff87b7b8c45a0f9ab5066a0cb8615848ec))

# [2.9.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.8.0...v2.9.0) (2021-05-26)


### Features

* **management:** platform policies ([2000aed](https://github.com/gravitee-io/gravitee-ui-components/commit/2000aed9c41dfdc248f8d3df6267ac774d2afbf9)), closes [gravitee-io/issues#4460](https://github.com/gravitee-io/issues/issues/4460)

# [2.8.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.7.0...v2.8.0) (2021-05-11)

### Miscellaneous

* **deps:** bump hosted-git-info from 2.8.8 to 2.8.9 ([e0f6219](https://github.com/gravitee-io/gravitee-ui-components/commit/e0f6219371531bd18d9546bd0fe449665af09ab6))

# [2.7.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.6.0...v2.7.0) (2021-05-11)


### Features

* **gv-date-picker:** improve date picker ([6a650c0](https://github.com/gravitee-io/gravitee-ui-components/commit/6a650c0873be06d7f8f77108f63057bf966ea53d)), closes [gravitee-io/issues#4894](https://github.com/gravitee-io/issues/issues/4894)
* **gv-expandable:** add new component ([4764c81](https://github.com/gravitee-io/gravitee-ui-components/commit/4764c8181e058599ef28b3bd2bf4ec489c2b17cb)), closes [gravitee-io/issues#4894](https://github.com/gravitee-io/issues/issues/4894)
* **lib:** add support to use deepEqual on Array without order consideration ([a062dc0](https://github.com/gravitee-io/gravitee-ui-components/commit/a062dc05fb2925cb8e8ab36b22d1b07a4801a6f3)), closes [gravitee-io/issues#4894](https://github.com/gravitee-io/issues/issues/4894)

# [2.6.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.5.0...v2.6.0) (2021-05-07)

Same as 2.5.0, was triggered after a change in the release config.

# [2.5.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.4.0...v2.5.0) (2021-05-07)


### Features

* **gv-chart-histogram:** improve histogram chart options usage ([6a27d7a](https://github.com/gravitee-io/gravitee-ui-components/commit/6a27d7ac46616abcac9cd7015f42e98fbc34e85c))

# [2.4.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.5...v2.4.0) (2021-05-05)


### Features

* **gv-chart-histogram:** add new component ([57316eb](https://github.com/gravitee-io/gravitee-ui-components/commit/57316eb988f38cc792cda3142b734cb1e6f7c4dc))

## [2.3.5](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.4...v2.3.5) (2021-04-22)


### Bug Fixes

* resolve install on windows ([6c2a1ee](https://github.com/gravitee-io/gravitee-ui-components/commit/6c2a1ee3420f735106788b18c48407a4339ee8d6)), closes [gravitee-io/issues#5195](https://github.com/gravitee-io/issues/issues/5195)

## [2.3.4](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.3...v2.3.4) (2021-04-21)


### Bug Fixes

* **gv-policy-studio:** clone policy configuration when submit form ([18d4d45](https://github.com/gravitee-io/gravitee-ui-components/commit/18d4d45e3d4f0fb09da9e1767036fc829f8076d6)), closes [gravitee-io/issues#5336](https://github.com/gravitee-io/issues/issues/5336)
* **gv-schema-form:** fix rerender with validation in policy studio ([a05ee4a](https://github.com/gravitee-io/gravitee-ui-components/commit/a05ee4abc16077abceea4529de992a5b34d71475)), closes [gravitee-io/issue#5351](https://github.com/gravitee-io/issue/issues/5351)

## [2.3.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.2...v2.3.3) (2021-04-19)


### Bug Fixes

* **gv-code:** remove listeners when disconnect callback ([bc6cc0f](https://github.com/gravitee-io/gravitee-ui-components/commit/bc6cc0f1a0c85a4999e384447759eb6b35cebe20)), closes [gravitee-io/issues#5364](https://github.com/gravitee-io/issues/issues/5364)

## [2.3.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.1...v2.3.2) (2021-04-19)


### Bug Fixes

* **gv-autocomplete:** close options panel when selecting option ([37c3d37](https://github.com/gravitee-io/gravitee-ui-components/commit/37c3d37ee4f94632a7aba744624b1b3c0b6acde6)), closes [#296](https://github.com/gravitee-io/gravitee-ui-components/issues/296)

## [2.3.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.3.0...v2.3.1) (2021-04-08)


### Bug Fixes

* **gv-select:** fix display of option list in scrollable parent ([6608595](https://github.com/gravitee-io/gravitee-ui-components/commit/6608595ebadc4feab4438956a068e49ac584dae1))

# [2.3.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.2.2...v2.3.0) (2021-04-07)


### Features

* **portal:** allows to change favicon ([692bc83](https://github.com/gravitee-io/gravitee-ui-components/commit/692bc83b9b8c508156f2f39e9d0e987fb77212a9)), closes [gravitee-io/issues#4855](https://github.com/gravitee-io/issues/issues/4855)

## [2.2.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.2.1...v2.2.2) (2021-03-25)


### Bug Fixes

* **gv-promote:** resolve blink when loading new data ([684a954](https://github.com/gravitee-io/gravitee-ui-components/commit/684a954ded70aedadebe66e57f4c43fc5389f5e8)), closes [#313](https://github.com/gravitee-io/gravitee-ui-components/issues/313)

## [2.2.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.2.0...v2.2.1) (2021-03-25)


### Bug Fixes

* **gv-button:** rendering problem with skeleton mode ([5767007](https://github.com/gravitee-io/gravitee-ui-components/commit/5767007c6beb2283ba0c29e45d6dd767f64df8c2)), closes [#311](https://github.com/gravitee-io/gravitee-ui-components/issues/311)

# [2.2.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.1.1...v2.2.0) (2021-03-23)


### Features

* dashboard of all alerts ([fc344a6](https://github.com/gravitee-io/gravitee-ui-components/commit/fc344a662285cc0acabbf1e9c50ef2e8da3ea095))

## [2.1.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.1.0...v2.1.1) (2021-03-17)


### Bug Fixes

* **i18:** use relative url to load default translation ([a318fe4](https://github.com/gravitee-io/gravitee-ui-components/commit/a318fe4b2cac704fb7337e542d52807846276839))

# [2.1.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v2.0.0...v2.1.0) (2021-03-17)


### Features

* add a new component gv-row-expendable ([c2adc06](https://github.com/gravitee-io/gravitee-ui-components/commit/c2adc068c78f58967685e4afe8abe3e7b87d8866))

# [2.0.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.4.1...v2.0.0) (2021-03-16)


### Bug Fixes

* **gv-modal:** remove red color of close icon ([ebde976](https://github.com/gravitee-io/gravitee-ui-components/commit/ebde976f631720b35239d9fda89212d9e55d64e6))
* **gv-option:** resolve display with icons & without text ([909fa76](https://github.com/gravitee-io/gravitee-ui-components/commit/909fa768578c466394ad51a132dd79999ef633a5)), closes [gravitee-io/issues#5234](https://github.com/gravitee-io/issues/issues/5234)


### BREAKING CHANGES

* **gv-modal:** use naming convention for var css, read the component documentation for new names

## [1.4.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.4.0...v1.4.1) (2021-03-16)


### Bug Fixes

* **gv-menu:** resolve sticky mode ([0422353](https://github.com/gravitee-io/gravitee-ui-components/commit/0422353e475f91d38b54ab12a1a9b17ed7317f3c)), closes [gravitee-io/issues#5233](https://github.com/gravitee-io/issues/issues/5233)

# [1.4.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.3.3...v1.4.0) (2021-03-16)


### Features

* **gv-state:** handle new state ([b73f0cf](https://github.com/gravitee-io/gravitee-ui-components/commit/b73f0cf218582aa41c3fb14599d4c2635cbacb79))

## [1.3.3](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.3.2...v1.3.3) (2021-03-15)


### Bug Fixes

* let compare null objects ([57d54b6](https://github.com/gravitee-io/gravitee-ui-components/commit/57d54b6e3d309b254016a7c686ff221938dac006)), closes [gravitee-io/issues#5230](https://github.com/gravitee-io/issues/issues/5230)

## [1.3.2](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.3.1...v1.3.2) (2021-03-11)


### Bug Fixes

* gv-select default background should be white ([227dc03](https://github.com/gravitee-io/gravitee-ui-components/commit/227dc037868c80c41eb5979d1ed65294265e51b6))

## [1.3.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.3.0...v1.3.1) (2021-03-10)


### Bug Fixes

* **gv-select:** let select go out of parent item ([1494ce0](https://github.com/gravitee-io/gravitee-ui-components/commit/1494ce0567201bf457209001f757e29f0fd142e5))

# [1.3.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.2.0...v1.3.0) (2021-03-01)


### Features

* add gv-modal ([d8b2620](https://github.com/gravitee-io/gravitee-ui-components/commit/d8b2620d92d6b15036fb3113ba89dc9206dd7832))

# [1.2.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.1.1...v1.2.0) (2021-02-26)


### Bug Fixes

* **gv-autocomplete:** remove overlap when has several autocomplete ([d8b9849](https://github.com/gravitee-io/gravitee-ui-components/commit/d8b98496435cde588f5c08aaeb6135511e2c5410))
* **gv-schema-form:** use good propery for placeholder ([72e516a](https://github.com/gravitee-io/gravitee-ui-components/commit/72e516a4b2f004ec0053696fbfee182b959e0411))


### Features

* **gv-schema-form:** add an option to make only the content scrollable ([f234882](https://github.com/gravitee-io/gravitee-ui-components/commit/f234882c9a10ab2796eb38cdbe78bc886550ae9e)), closes [gravitee-io/issues#2298](https://github.com/gravitee-io/issues/issues/2298)
* **inputs:** add description text below the inputs ([2517e7d](https://github.com/gravitee-io/gravitee-ui-components/commit/2517e7d1b8bcb1c8cacd05069abaed4c83d7b149))

## [1.1.1](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.1.0...v1.1.1) (2021-02-26)


### Bug Fixes

* add `disable` flag to chromatic only when it is computed to `true` ([e70c829](https://github.com/gravitee-io/gravitee-ui-components/commit/e70c829aeb7d983eeca184c4d64c01dcf3fb8711))

# [1.1.0](https://github.com/gravitee-io/gravitee-ui-components/compare/v1.0.25...v1.1.0) (2021-02-26)


### Features

* commit to make the first automatic release using semantic-release ([c09cd6f](https://github.com/gravitee-io/gravitee-ui-components/commit/c09cd6f1f0265b37d1ff1c941dacefbefcdef023))

## <small>1.0.25 (2021-02-24)</small>

* doc: improve documentation ([6cee73b](https://github.com/gravitee-io/gravitee-ui-components/commit/6cee73b))
* refactor(gv-icon): improve svg integration with <use> attribute ([9d3b33e](https://github.com/gravitee-io/gravitee-ui-components/commit/9d3b33e)), closes [gravitee-io/gravitee-ui-components#265](https://github.com/gravitee-io/gravitee-ui-components/issues/265)



## <small>1.0.24 (2021-02-18)</small>

* fix(gv-code): enable autoresize ([cc021bc](https://github.com/gravitee-io/gravitee-ui-components/commit/cc021bc))
* fix(gv-table): add a var CSS for overflow ([bae9718](https://github.com/gravitee-io/gravitee-ui-components/commit/bae9718))



## <small>1.0.23 (2021-02-17)</small>

* fix(gv-code): resolve display when field has only one row & long content ([0f37d6a](https://github.com/gravitee-io/gravitee-ui-components/commit/0f37d6a)), closes [gravitee-io/issues#5086](https://github.com/gravitee-io/issues/issues/5086)



## <small>1.0.22 (2021-02-16)</small>

* fix(gv-code): resolve display when field has only one row ([558fac8](https://github.com/gravitee-io/gravitee-ui-components/commit/558fac8)), closes [gravitee-io/issues#5086](https://github.com/gravitee-io/issues/issues/5086)



## <small>1.0.21 (2021-02-16)</small>

* ci: use simple Node Docker image + NPM script in CircleCI workflow ([a22ba95](https://github.com/gravitee-io/gravitee-ui-components/commit/a22ba95))
* ci: use small executor for step that don't require a lot of power ([20afe04](https://github.com/gravitee-io/gravitee-ui-components/commit/20afe04))
* fix(gv-cron-editor): compute mode from the value only for a few specific cases ([c9e8769](https://github.com/gravitee-io/gravitee-ui-components/commit/c9e8769))
* fix(gv-link): crop text and add `...` when it is too long to fit ([12767ff](https://github.com/gravitee-io/gravitee-ui-components/commit/12767ff))



## <small>1.0.20 (2021-02-12)</small>

* Cron Editor: Various small enhancements of design and behavior (#272) ([71523c8](https://github.com/gravitee-io/gravitee-ui-components/commit/71523c8)), closes [#272](https://github.com/gravitee-io/gravitee-ui-components/issues/272)
* style: format json files with prettier ([cb48ab7](https://github.com/gravitee-io/gravitee-ui-components/commit/cb48ab7))
* fix(gv-code): resolve scroll ([45185ea](https://github.com/gravitee-io/gravitee-ui-components/commit/45185ea)), closes [gravitee-io/issues#5060](https://github.com/gravitee-io/issues/issues/5060)
* fix(gv-code): resolve value updating ([397a23c](https://github.com/gravitee-io/gravitee-ui-components/commit/397a23c))
* fix(gv-expressions-language): dispatch native input event for form integration ([ab98cc9](https://github.com/gravitee-io/gravitee-ui-components/commit/ab98cc9))
* feat(gv-code): add placeholder option like others inputs ([1a0ff8c](https://github.com/gravitee-io/gravitee-ui-components/commit/1a0ff8c))
* feat(gv-expression-language): add label & placeholder attributes like others ([0cf0013](https://github.com/gravitee-io/gravitee-ui-components/commit/0cf0013))
* feat(gv-option): add var css ([ea20c4c](https://github.com/gravitee-io/gravitee-ui-components/commit/ea20c4c))
* feat(gv-switch): use innerHTML to set description option ([c9899c0](https://github.com/gravitee-io/gravitee-ui-components/commit/c9899c0)), closes [gravitee-io/issues#4745](https://github.com/gravitee-io/issues/issues/4745)
* chore: add prettier ([2cd9e09](https://github.com/gravitee-io/gravitee-ui-components/commit/2cd9e09)), closes [#236](https://github.com/gravitee-io/gravitee-ui-components/issues/236)
* chore: add prettier ([f2ff3ee](https://github.com/gravitee-io/gravitee-ui-components/commit/f2ff3ee))
* chore: bump Storybook to 6.1.17 ([5046d91](https://github.com/gravitee-io/gravitee-ui-components/commit/5046d91))
* chore: move i18n control to Storybook toolbar ([faf47fe](https://github.com/gravitee-io/gravitee-ui-components/commit/faf47fe))
* chore: replace some Storybook addons by `@storybook/essentials` ([3f0e93a](https://github.com/gravitee-io/gravitee-ui-components/commit/3f0e93a))
* chore: use correct Storybook in `i18n-knob` and remove @storybook/html from deps ([13709a5](https://github.com/gravitee-io/gravitee-ui-components/commit/13709a5))
* chore: use new config format of Storybook ([26b4321](https://github.com/gravitee-io/gravitee-ui-components/commit/26b4321))



## <small>1.0.19 (2021-02-08)</small>

* feat: add gv-cron-editor component ([b1d5784](https://github.com/gravitee-io/gravitee-ui-components/commit/b1d5784)), closes [gravitee-io/issues#4043](https://github.com/gravitee-io/issues/issues/4043)
* feat: display deployments markups on api analytics ([cea37e7](https://github.com/gravitee-io/gravitee-ui-components/commit/cea37e7))
* feat: improve input element validation ([c11421b](https://github.com/gravitee-io/gravitee-ui-components/commit/c11421b))
* feat(): improve gv-select styling ([c039b88](https://github.com/gravitee-io/gravitee-ui-components/commit/c039b88))
* feat(): reduce menu item height ([b959a3e](https://github.com/gravitee-io/gravitee-ui-components/commit/b959a3e))
* feat(gv-date-picker): improve with gv-input properties & seconds management ([a536ccd](https://github.com/gravitee-io/gravitee-ui-components/commit/a536ccd))
* feat(gv-option): add label field in option object if need to manage title & label on each entry ([29f0da1](https://github.com/gravitee-io/gravitee-ui-components/commit/29f0da1))
* feat(gv-properties): use gv-cron-editor to manage dynamic properties ([ab78221](https://github.com/gravitee-io/gravitee-ui-components/commit/ab78221))
* feat(gv-tabs): add slot title, small & truncate options to manage responsive of tabs ([900f01d](https://github.com/gravitee-io/gravitee-ui-components/commit/900f01d))
* feat(gv-user-menu): add missing border ([27fad42](https://github.com/gravitee-io/gravitee-ui-components/commit/27fad42))
* fix(gv-input): don't make the field readonly if is clipboard ([6530704](https://github.com/gravitee-io/gravitee-ui-components/commit/6530704))
* fix(gv-select): resolve display when too many options are selected relative to the size ([30765f9](https://github.com/gravitee-io/gravitee-ui-components/commit/30765f9))
* refactor(gv-checkbox): extends validation like others input-element ([c7aa0cf](https://github.com/gravitee-io/gravitee-ui-components/commit/c7aa0cf))
* test(gv-date-picker): add unit test, resolve date-fns import & upgrade to 2.16.1 ([3422c4f](https://github.com/gravitee-io/gravitee-ui-components/commit/3422c4f))
* chore: resolve static files generation ([ce5224b](https://github.com/gravitee-io/gravitee-ui-components/commit/ce5224b))



## <small>1.0.18 (2021-02-01)</small>

* fix(gv-autocomplete): do not show no-option slot if no search is done ([5f856fb](https://github.com/gravitee-io/gravitee-ui-components/commit/5f856fb)), closes [#258](https://github.com/gravitee-io/gravitee-ui-components/issues/258)
* fix(gv-gauge): make background transparent ([1100589](https://github.com/gravitee-io/gravitee-ui-components/commit/1100589))
* fix(gv-policy-studio): fix apidefinition file in policy-studio stories ([9939419](https://github.com/gravitee-io/gravitee-ui-components/commit/9939419))
* fix(gv-spinner): add default image ([1250176](https://github.com/gravitee-io/gravitee-ui-components/commit/1250176)), closes [#240](https://github.com/gravitee-io/gravitee-ui-components/issues/240)
* feat(gv-policy-studio): add readonly-plans option ([4b25488](https://github.com/gravitee-io/gravitee-ui-components/commit/4b25488)), closes [gravitee-io/issues#4770](https://github.com/gravitee-io/issues/issues/4770)
* feat(gv-policy-studio): remove hasPlans ([b893f6c](https://github.com/gravitee-io/gravitee-ui-components/commit/b893f6c))



## <small>1.0.17 (2021-01-22)</small>

* fix: newsletter improvment - css issue ([3f17278](https://github.com/gravitee-io/gravitee-ui-components/commit/3f17278))
* fix(gv-code): not load a mode if not defined ([5169a8b](https://github.com/gravitee-io/gravitee-ui-components/commit/5169a8b)), closes [gravitee-io/issues#4924](https://github.com/gravitee-io/issues/issues/4924)
* fix(gv-documentation): force white-space:pre-wrap instead of pre in code preview ([4bac162](https://github.com/gravitee-io/gravitee-ui-components/commit/4bac162))
* fix(gv-input): stop propagation of click for clipboard ([3bc65a9](https://github.com/gravitee-io/gravitee-ui-components/commit/3bc65a9))
* fix(input): resolve readonly mode ([89e8279](https://github.com/gravitee-io/gravitee-ui-components/commit/89e8279))
* feat: newsletter improvment ([cfbfaaf](https://github.com/gravitee-io/gravitee-ui-components/commit/cfbfaaf))
* feat(gv-policy-studio): add readonly mode ([7f00504](https://github.com/gravitee-io/gravitee-ui-components/commit/7f00504)), closes [gravitee-io/issues#4749](https://github.com/gravitee-io/issues/issues/4749)



## <small>1.0.16 (2021-01-15)</small>

* feat: console dashboard page ([2ba45b5](https://github.com/gravitee-io/gravitee-ui-components/commit/2ba45b5))
* feat(): add new component gv-chart-gauge ([7cbacd7](https://github.com/gravitee-io/gravitee-ui-components/commit/7cbacd7))
* feat(gv-autocomplete): Add slot to show when no options ([aa86889](https://github.com/gravitee-io/gravitee-ui-components/commit/aa86889))
* fix: fix error for gv-table documentation ([7d29e21](https://github.com/gravitee-io/gravitee-ui-components/commit/7d29e21))
* fix(gv-button): show loading on button without icon ([239b120](https://github.com/gravitee-io/gravitee-ui-components/commit/239b120)), closes [#229](https://github.com/gravitee-io/gravitee-ui-components/issues/229)
* fix(gv-confirm): add disabled attribute and handle slot gv-button dis… (#234) ([8a27166](https://github.com/gravitee-io/gravitee-ui-components/commit/8a27166)), closes [#234](https://github.com/gravitee-io/gravitee-ui-components/issues/234) [#233](https://github.com/gravitee-io/gravitee-ui-components/issues/233)
* fix(ui-component): manage password type for schema-form ([f65b733](https://github.com/gravitee-io/gravitee-ui-components/commit/f65b733)), closes [gravitee-io/issues#4701](https://github.com/gravitee-io/issues/issues/4701)



## <small>1.0.15 (2020-12-21)</small>

* Deploying Gravitee.io dev repos Circle CI Pipeline config ([c8ab8cd](https://github.com/gravitee-io/gravitee-ui-components/commit/c8ab8cd))
* Deploying Gravitee.io dev repos Circle CI Pipeline config ([ac9f818](https://github.com/gravitee-io/gravitee-ui-components/commit/ac9f818))
* chore: improve stories order & code source format ([2c9212e](https://github.com/gravitee-io/gravitee-ui-components/commit/2c9212e))
* chore: improve webpack configuration ([52e4dc4](https://github.com/gravitee-io/gravitee-ui-components/commit/52e4dc4))
* chore: upgrade asciidoctor-highlight.js to 0.3.0 ([26ef3ad](https://github.com/gravitee-io/gravitee-ui-components/commit/26ef3ad))
* chore: upgrade highlight.js to 10.4.0 ([07f784b](https://github.com/gravitee-io/gravitee-ui-components/commit/07f784b))
* chore: upgrade storybook to 6.1.11 ([1bc85ce](https://github.com/gravitee-io/gravitee-ui-components/commit/1bc85ce))
* chore(deps): bump highlight.js from 9.18.1 to 10.4.1 ([567f7e8](https://github.com/gravitee-io/gravitee-ui-components/commit/567f7e8))
* chore(deps): bump ini from 1.3.5 to 1.3.8 ([f6240a4](https://github.com/gravitee-io/gravitee-ui-components/commit/f6240a4))
* feat: add gv-expression-language component ([f3f3762](https://github.com/gravitee-io/gravitee-ui-components/commit/f3f3762)), closes [gravitee-io/issues#60](https://github.com/gravitee-io/issues/issues/60)
* feat: allow to migrate from policy studio v1 to v2 ([2bfb4ed](https://github.com/gravitee-io/gravitee-ui-components/commit/2bfb4ed))
* feat(gv-documentation): force target='_blank' to link ([bd71de7](https://github.com/gravitee-io/gravitee-ui-components/commit/bd71de7))
* feat(gv-table): add story with dynamic table fields ([8edbfa8](https://github.com/gravitee-io/gravitee-ui-components/commit/8edbfa8))
* style: lint fix ([68e2e83](https://github.com/gravitee-io/gravitee-ui-components/commit/68e2e83))
* fix(gv-code): accept configuration options without mode ([b3c3257](https://github.com/gravitee-io/gravitee-ui-components/commit/b3c3257))
* fix(gv-policy-studio): resolve step form submit ([3d8bc0d](https://github.com/gravitee-io/gravitee-ui-components/commit/3d8bc0d))
* fix(gv-schema-form): resolve position of input element ([63cb74e](https://github.com/gravitee-io/gravitee-ui-components/commit/63cb74e))
* refactor(policy-studio): add attributes for AM integration ([6d24ea0](https://github.com/gravitee-io/gravitee-ui-components/commit/6d24ea0)), closes [gravitee-io/issues#4592](https://github.com/gravitee-io/issues/issues/4592)



## <small>1.0.14 (2020-12-08)</small>

* fix(gv-schema-form): resolve complex form validation ([e1657f7](https://github.com/gravitee-io/gravitee-ui-components/commit/e1657f7)), closes [gravitee-io/issues#4722](https://github.com/gravitee-io/issues/issues/4722)



## <small>1.0.13 (2020-12-02)</small>

* fix(gv-code): display codemirror even with a mode that not exist ([6390ded](https://github.com/gravitee-io/gravitee-ui-components/commit/6390ded)), closes [gravitee-io/issues#4665](https://github.com/gravitee-io/issues/issues/4665)
* fix(gv-code): resolve dispatch of change event ([2875b3c](https://github.com/gravitee-io/gravitee-ui-components/commit/2875b3c)), closes [gravitee-io/issues#4712](https://github.com/gravitee-io/issues/issues/4712)
* fix(gv-user-menu): avoid closing on mouseleave group ([fb8ec47](https://github.com/gravitee-io/gravitee-ui-components/commit/fb8ec47))
* feat(gv-user-menu): allow group of routes ([341eabd](https://github.com/gravitee-io/gravitee-ui-components/commit/341eabd))



## <small>1.0.12 (2020-11-26)</small>

* fix(gv-date-picker): resolve clear icon colors ([e61153b](https://github.com/gravitee-io/gravitee-ui-components/commit/e61153b)), closes [gravitee-io/issues#4662](https://github.com/gravitee-io/issues/issues/4662)
* fix(gv-plans): resolve pagination ([e73bc23](https://github.com/gravitee-io/gravitee-ui-components/commit/e73bc23)), closes [gravitee-io/issues#4653](https://github.com/gravitee-io/issues/issues/4653)
* fix(gv-table): add padding to header ([10fe2cf](https://github.com/gravitee-io/gravitee-ui-components/commit/10fe2cf))
* fix(input): resolve icon size ([91c03a7](https://github.com/gravitee-io/gravitee-ui-components/commit/91c03a7))
* feat(gv-row): add option small to hide labels ([084f5c7](https://github.com/gravitee-io/gravitee-ui-components/commit/084f5c7)), closes [gravitee-io/issues#4661](https://github.com/gravitee-io/issues/issues/4661)



## <small>1.0.11 (2020-11-24)</small>

* Configure favicon ([8afc980](https://github.com/gravitee-io/gravitee-ui-components/commit/8afc980))
* feat.(pipeline_definition): deploying [.circleci/config.yml] pipeline definition ([e23b8c4](https://github.com/gravitee-io/gravitee-ui-components/commit/e23b8c4))
* feat: add component gv-input-message ([656d83d](https://github.com/gravitee-io/gravitee-ui-components/commit/656d83d))
* feat: add gv-documentation component ([1de46dd](https://github.com/gravitee-io/gravitee-ui-components/commit/1de46dd))
* feat: add gv-properties component ([73049b1](https://github.com/gravitee-io/gravitee-ui-components/commit/73049b1))
* feat: add gv-resizable-views component ([714f254](https://github.com/gravitee-io/gravitee-ui-components/commit/714f254)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat: add gv-resources component ([32867f9](https://github.com/gravitee-io/gravitee-ui-components/commit/32867f9))
* feat: add gv-schema-form component ([f02f27f](https://github.com/gravitee-io/gravitee-ui-components/commit/f02f27f))
* feat: add gv-tabs component ([ff6853c](https://github.com/gravitee-io/gravitee-ui-components/commit/ff6853c)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat: add policy studio components ([4aa04e5](https://github.com/gravitee-io/gravitee-ui-components/commit/4aa04e5)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat: add simple dropdown menu ([ef18a28](https://github.com/gravitee-io/gravitee-ui-components/commit/ef18a28))
* feat: add thirdparty icons ([f4af244](https://github.com/gravitee-io/gravitee-ui-components/commit/f4af244)), closes [gravitee-io/issues#4494](https://github.com/gravitee-io/issues/issues/4494)
* feat: create keyboard element mixin ([dbcf952](https://github.com/gravitee-io/gravitee-ui-components/commit/dbcf952))
* feat: improve gv-popover & gv-confirm components ([09a561b](https://github.com/gravitee-io/gravitee-ui-components/commit/09a561b))
* feat: support tickets history ([7004068](https://github.com/gravitee-io/gravitee-ui-components/commit/7004068))
* feat(gv-button): accept enter key to press button ([c068821](https://github.com/gravitee-io/gravitee-ui-components/commit/c068821))
* feat(gv-button): improve gv-button for a11y with tabindex ([743f39a](https://github.com/gravitee-io/gravitee-ui-components/commit/743f39a)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat(gv-icon): add --gv-icon-opacity--c css variable ([8e2cf97](https://github.com/gravitee-io/gravitee-ui-components/commit/8e2cf97))
* feat(gv-input): improve clipboard with popover ([2c27746](https://github.com/gravitee-io/gravitee-ui-components/commit/2c27746))
* feat(gv-option): accept empty title in options ([285f8dc](https://github.com/gravitee-io/gravitee-ui-components/commit/285f8dc))
* feat(gv-option): add possibility to pass an image on options ([ba5be31](https://github.com/gravitee-io/gravitee-ui-components/commit/ba5be31))
* feat(gv-option): add small & outlined attributes ([807205f](https://github.com/gravitee-io/gravitee-ui-components/commit/807205f))
* feat(gv-pagination): add disabled attribute ([0b42aa0](https://github.com/gravitee-io/gravitee-ui-components/commit/0b42aa0))
* feat(gv-state): add @cssprop for font-size & padding ([557d7f0](https://github.com/gravitee-io/gravitee-ui-components/commit/557d7f0)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat(gv-switch): add small attribute & improve component ([121228c](https://github.com/gravitee-io/gravitee-ui-components/commit/121228c))
* feat(gv-tag): add @cssprop for font-size & padding ([3b49b51](https://github.com/gravitee-io/gravitee-ui-components/commit/3b49b51)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat(gv-text): improve with css variables and autosize attribute ([acb305e](https://github.com/gravitee-io/gravitee-ui-components/commit/acb305e))
* feat(i18n): add function to load translations (usefull for console app) ([1805b83](https://github.com/gravitee-io/gravitee-ui-components/commit/1805b83))
* feat(policy-studio): improve interaction with forms ([9fe3ed9](https://github.com/gravitee-io/gravitee-ui-components/commit/9fe3ed9)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* fix(gv-autocomplete): not reset options if minChars=0 ([3c2013c](https://github.com/gravitee-io/gravitee-ui-components/commit/3c2013c))
* fix(gv-code): resolve size when component has placeholder ([a05ba37](https://github.com/gravitee-io/gravitee-ui-components/commit/a05ba37))
* fix(gv-input): update validation states after set value ([ff80a0b](https://github.com/gravitee-io/gravitee-ui-components/commit/ff80a0b))
* fix(gv-select): cannot unselect option of simple list ([873b9f8](https://github.com/gravitee-io/gravitee-ui-components/commit/873b9f8))
* fix(gv-select): set invalid state when multiple select has empty array value ([b8143dd](https://github.com/gravitee-io/gravitee-ui-components/commit/b8143dd))
* fix(gv-table): render the icon once ([77a5dee](https://github.com/gravitee-io/gravitee-ui-components/commit/77a5dee)), closes [gravitee-io/issues#4523](https://github.com/gravitee-io/issues/issues/4523)
* fix(gv-table): use box-sizing: border-box by default for host ([46e6b0f](https://github.com/gravitee-io/gravitee-ui-components/commit/46e6b0f))
* fix(gv-tag): remove spaces around slot ([712b03f](https://github.com/gravitee-io/gravitee-ui-components/commit/712b03f))
* fix(input): reduce size of icon for small inputs ([0fa0177](https://github.com/gravitee-io/gravitee-ui-components/commit/0fa0177))
* fix(policy-studio): resolve policy edition of flow plan ([913a7ee](https://github.com/gravitee-io/gravitee-ui-components/commit/913a7ee)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* test(gv-table): add story with gv-confirm ([272bca8](https://github.com/gravitee-io/gravitee-ui-components/commit/272bca8))
* refactor(gv-message): remove css properties and use theme variables ([601f0d0](https://github.com/gravitee-io/gravitee-ui-components/commit/601f0d0))
* refactor(gv-select): fires input event when change like others inputs ([917bff9](https://github.com/gravitee-io/gravitee-ui-components/commit/917bff9)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* style: format css ([36d6b6b](https://github.com/gravitee-io/gravitee-ui-components/commit/36d6b6b))
* chore: upgrade dependencies, improve scripts & configuration ([6664bf8](https://github.com/gravitee-io/gravitee-ui-components/commit/6664bf8))
* chore: upgrade license-maven-plugin configuration ([8a13a1c](https://github.com/gravitee-io/gravitee-ui-components/commit/8a13a1c))



## <small>1.0.10 (2020-10-27)</small>

* fix(ui-components): a gv-tag in gv-table cell must not have width: 100% ([a4d8540](https://github.com/gravitee-io/gravitee-ui-components/commit/a4d8540)), closes [gravitee-io/issues#4035](https://github.com/gravitee-io/issues/issues/4035) [gravitee-io/issues#4461](https://github.com/gravitee-io/issues/issues/4461)



## <small>1.0.9 (2020-10-09)</small>

* fix: gv-input spinner animation ([0ceb673](https://github.com/gravitee-io/gravitee-ui-components/commit/0ceb673)), closes [gravitee-io/issues#4341](https://github.com/gravitee-io/issues/issues/4341)
* fix: resolve addon-docs configuration to show the real code in stories ([67b4435](https://github.com/gravitee-io/gravitee-ui-components/commit/67b4435))
* fix(components): gv-code should accept 'json' mode for codemirror ([80b3659](https://github.com/gravitee-io/gravitee-ui-components/commit/80b3659)), closes [gravitee-io/issues#4048](https://github.com/gravitee-io/issues/issues/4048)
* fix(gv-tree): fix expand of folders in production mode ([2a5d0a3](https://github.com/gravitee-io/gravitee-ui-components/commit/2a5d0a3)), closes [gravitee-io/issues#4275](https://github.com/gravitee-io/issues/issues/4275)
* feat(pictures): delete image ([246f81f](https://github.com/gravitee-io/gravitee-ui-components/commit/246f81f)), closes [gravitee-io/issues#4316](https://github.com/gravitee-io/issues/issues/4316)
* chore: fix hot reload ([ef5cfd5](https://github.com/gravitee-io/gravitee-ui-components/commit/ef5cfd5)), closes [gravitee-io/issues#4332](https://github.com/gravitee-io/issues/issues/4332)



## <small>1.0.8 (2020-09-22)</small>

* feat: add theme facet for theme generation ([12286cf](https://github.com/gravitee-io/gravitee-ui-components/commit/12286cf)), closes [gravitee-io/issues#3895](https://github.com/gravitee-io/issues/issues/3895)
* feat: Add vertical menu ([74058f3](https://github.com/gravitee-io/gravitee-ui-components/commit/74058f3)), closes [gravitee-io/gravitee-cockpit#64](https://github.com/gravitee-io/gravitee-cockpit/issues/64)
* chore: add jest ([17a2120](https://github.com/gravitee-io/gravitee-ui-components/commit/17a2120))
* chore: Catch errors while publishing ([22797b9](https://github.com/gravitee-io/gravitee-ui-components/commit/22797b9))
* chore: upgrade to storybook 6.x ([8e315a8](https://github.com/gravitee-io/gravitee-ui-components/commit/8e315a8))
* chore: upgrade web-component-analyzer and fix build ([a4271a9](https://github.com/gravitee-io/gravitee-ui-components/commit/a4271a9))



## <small>1.0.7 (2020-08-19)</small>

* fix(portal): allow to manage Application's metadata from portal ([9bbfda1](https://github.com/gravitee-io/gravitee-ui-components/commit/9bbfda1)), closes [gravitee-io/issues#4089](https://github.com/gravitee-io/issues/issues/4089)
* chore(deps): bump elliptic from 6.5.2 to 6.5.3 ([5b55350](https://github.com/gravitee-io/gravitee-ui-components/commit/5b55350))



## <small>1.0.6 (2020-07-29)</small>

* fix(gv-checkbox): apply same behavior as native input[type=checkbox] ([cc90bc9](https://github.com/gravitee-io/gravitee-ui-components/commit/cc90bc9)), closes [gravitee-io/issues#4136](https://github.com/gravitee-io/issues/issues/4136)
* fix(gv-table): resolve gv-confirm position ([66d7a68](https://github.com/gravitee-io/gravitee-ui-components/commit/66d7a68)), closes [gravitee-io/issues#4140](https://github.com/gravitee-io/issues/issues/4140)
* chore(deps): bump lodash from 4.17.15 to 4.17.19 ([44b7e0e](https://github.com/gravitee-io/gravitee-ui-components/commit/44b7e0e))



## <small>1.0.5 (2020-07-16)</small>

* feat: Allows to define a background on the APIs/Apps/Categories headers ([6b0d592](https://github.com/gravitee-io/gravitee-ui-components/commit/6b0d592)), closes [gravitee-io/issues#3761](https://github.com/gravitee-io/issues/issues/3761)



## <small>1.0.3 (2020-06-17)</small>

* fix: The subscribe button should not disappear on scroll ([e85adf6](https://github.com/gravitee-io/gravitee-ui-components/commit/e85adf6)), closes [gravitee-io/issues#3955](https://github.com/gravitee-io/issues/issues/3955)
* chore(deps): bump websocket-extensions from 0.1.3 to 0.1.4 ([7c5ddd1](https://github.com/gravitee-io/gravitee-ui-components/commit/7c5ddd1))



## <small>1.0.2 (2020-06-03)</small>

* refactor: rewrite gv-code with codemirror ([feeeaa3](https://github.com/gravitee-io/gravitee-ui-components/commit/feeeaa3)), closes [gravitee-io/issues#3870](https://github.com/gravitee-io/issues/issues/3870)
* fix: lint ([7017dfc](https://github.com/gravitee-io/gravitee-ui-components/commit/7017dfc))
* fix(ui-components): allow to force skeleton mode on gv-table ([760a4bd](https://github.com/gravitee-io/gravitee-ui-components/commit/760a4bd)), closes [gravitee-io/issues#3804](https://github.com/gravitee-io/issues/issues/3804)
* fix(ui-components): words in gv-tag should never be broken ([df20abd](https://github.com/gravitee-io/gravitee-ui-components/commit/df20abd)), closes [gravitee-io/issues#3832](https://github.com/gravitee-io/issues/issues/3832)
* feat(portal): enable tags on gv-promote & gv-card-full to be clicked ([779a067](https://github.com/gravitee-io/gravitee-ui-components/commit/779a067)), closes [gravitee-io/issues#3842](https://github.com/gravitee-io/issues/issues/3842)



## <small>1.0.1 (2020-05-26)</small>

* fix: resolve icon position ([4a68aa4](https://github.com/gravitee-io/gravitee-ui-components/commit/4a68aa4))
* chore: remove Terser mangle property ([d455789](https://github.com/gravitee-io/gravitee-ui-components/commit/d455789))



## 1.0.0 (2020-05-26)

* feat(portal) : add management link in portal usermenu ([de7c81d](https://github.com/gravitee-io/gravitee-ui-components/commit/de7c81d)), closes [gravitee-io/issues#3109](https://github.com/gravitee-io/issues/issues/3109)
* Fix lint ([7ac59db](https://github.com/gravitee-io/gravitee-ui-components/commit/7ac59db))
* fix lints ([64a47b3](https://github.com/gravitee-io/gravitee-ui-components/commit/64a47b3))
* Fix version to snapshot ([d2730c0](https://github.com/gravitee-io/gravitee-ui-components/commit/d2730c0))
* fix: add min-width to promoted-api for small resolution ([ee6aca2](https://github.com/gravitee-io/gravitee-ui-components/commit/ee6aca2))
* fix: allow user to save credentials ([baf1446](https://github.com/gravitee-io/gravitee-ui-components/commit/baf1446)), closes [gravitee-io/issues#2827](https://github.com/gravitee-io/issues/issues/2827)
* fix: Avatar cannot be changed the first time ([ee3888a](https://github.com/gravitee-io/gravitee-ui-components/commit/ee3888a)), closes [gravitee-io/issues#3192](https://github.com/gravitee-io/issues/issues/3192)
* fix: Avoid multiple calls on API/App page ([848b9e8](https://github.com/gravitee-io/gravitee-ui-components/commit/848b9e8)), closes [gravitee-io/issues#3524](https://github.com/gravitee-io/issues/issues/3524)
* fix: Avoid to select user menu text ([f20aacf](https://github.com/gravitee-io/gravitee-ui-components/commit/f20aacf)), closes [gravitee-io/issues#3690](https://github.com/gravitee-io/issues/issues/3690)
* fix: Click should not be allowed when gv-select is disabled ([d15a743](https://github.com/gravitee-io/gravitee-ui-components/commit/d15a743)), closes [gravitee-io/issues#2933](https://github.com/gravitee-io/issues/issues/2933)
* fix: Date range seems not handling well time zone ([caf305d](https://github.com/gravitee-io/gravitee-ui-components/commit/caf305d)), closes [gravitee-io/issues#3603](https://github.com/gravitee-io/issues/issues/3603)
* fix: Display better empty/error/skeleton states ([ca59583](https://github.com/gravitee-io/gravitee-ui-components/commit/ca59583)), closes [gravitee-io/issues#3588](https://github.com/gravitee-io/issues/issues/3588) [gravitee-io/issues#3649](https://github.com/gravitee-io/issues/issues/3649) [gravitee-io/issues#3594](https://github.com/gravitee-io/issues/issues/3594)
* fix: Display labels on API cards ([e86e707](https://github.com/gravitee-io/gravitee-ui-components/commit/e86e707)), closes [gravitee-io/issues#3116](https://github.com/gravitee-io/issues/issues/3116)
* fix: Display to consumer entrypoints of the API ([cd008bc](https://github.com/gravitee-io/gravitee-ui-components/commit/cd008bc)), closes [gravitee-io/issues#3451](https://github.com/gravitee-io/issues/issues/3451)
* fix: display total apis of a category in card ([9309644](https://github.com/gravitee-io/gravitee-ui-components/commit/9309644)), closes [gravitee-io/issues#3646](https://github.com/gravitee-io/issues/issues/3646)
* fix: Empty state not working on widget stats ([c1456ae](https://github.com/gravitee-io/gravitee-ui-components/commit/c1456ae)), closes [gravitee-io/issues#3553](https://github.com/gravitee-io/issues/issues/3553)
* fix: Errors when selecting a filter on an empty user agent ([57cea6d](https://github.com/gravitee-io/gravitee-ui-components/commit/57cea6d)), closes [gravitee-io/issues#3788](https://github.com/gravitee-io/issues/issues/3788)
* fix: Fix user menu ([8256599](https://github.com/gravitee-io/gravitee-ui-components/commit/8256599)), closes [gravitee-io/issues#3037](https://github.com/gravitee-io/issues/issues/3037)
* fix: Height of gv-tree on low resolution ([05834b1](https://github.com/gravitee-io/gravitee-ui-components/commit/05834b1))
* fix: hide icon when loader is enabled on input ([01d513e](https://github.com/gravitee-io/gravitee-ui-components/commit/01d513e))
* fix: improve components for application's grant flow ([394a8b4](https://github.com/gravitee-io/gravitee-ui-components/commit/394a8b4)), closes [gravitee-io/issues#3543](https://github.com/gravitee-io/issues/issues/3543) [gravitee-io/issues#3570](https://github.com/gravitee-io/issues/issues/3570)
* fix: improve components for subscription ([21f10e6](https://github.com/gravitee-io/gravitee-ui-components/commit/21f10e6)), closes [gravitee-io/issues#3802](https://github.com/gravitee-io/issues/issues/3802)
* fix: improve components for subscription ([823af1a](https://github.com/gravitee-io/gravitee-ui-components/commit/823af1a)), closes [gravitee-io/issues#3802](https://github.com/gravitee-io/issues/issues/3802)
* fix: Improve doc of gv-select ([e68f577](https://github.com/gravitee-io/gravitee-ui-components/commit/e68f577))
* fix: Improve loader on gv-button ([1679282](https://github.com/gravitee-io/gravitee-ui-components/commit/1679282)), closes [gravitee-io/issues#3552](https://github.com/gravitee-io/issues/issues/3552)
* fix: improve search input results display ([bceaa90](https://github.com/gravitee-io/gravitee-ui-components/commit/bceaa90)), closes [gravitee-io/issues#3421](https://github.com/gravitee-io/issues/issues/3421)
* fix: JS error when refreshing the subscription's page ([78b65e9](https://github.com/gravitee-io/gravitee-ui-components/commit/78b65e9)), closes [gravitee-io/issues#3489](https://github.com/gravitee-io/issues/issues/3489)
* fix: Last updated at for API is not well formed ([9bd69e3](https://github.com/gravitee-io/gravitee-ui-components/commit/9bd69e3)), closes [gravitee-io/issues#3476](https://github.com/gravitee-io/issues/issues/3476)
* fix: Lint ([7aa4642](https://github.com/gravitee-io/gravitee-ui-components/commit/7aa4642))
* fix: manage my api-keys ([fa06107](https://github.com/gravitee-io/gravitee-ui-components/commit/fa06107)), closes [gravitee-io/issues#3483](https://github.com/gravitee-io/issues/issues/3483)
* fix: Pie charte is displaying NaN when no value ([d17b08b](https://github.com/gravitee-io/gravitee-ui-components/commit/d17b08b)), closes [gravitee-io/issues#3724](https://github.com/gravitee-io/issues/issues/3724)
* fix: remove auto submit on autocomplete ([60e134c](https://github.com/gravitee-io/gravitee-ui-components/commit/60e134c)), closes [gravitee-io/issues#3567](https://github.com/gravitee-io/issues/issues/3567)
* fix: remove max-width in cards ([0496e8d](https://github.com/gravitee-io/gravitee-ui-components/commit/0496e8d))
* fix: remove useless transition in gv-menu ([0dfd764](https://github.com/gravitee-io/gravitee-ui-components/commit/0dfd764)), closes [gravitee-io/issues#3495](https://github.com/gravitee-io/issues/issues/3495)
* fix: resolve category image position ([9a871c7](https://github.com/gravitee-io/gravitee-ui-components/commit/9a871c7)), closes [gravitee-io/issues#3467](https://github.com/gravitee-io/issues/issues/3467) [gravitee-io/issues#3453](https://github.com/gravitee-io/issues/issues/3453)
* fix: resolve design when data is loading ([b27904d](https://github.com/gravitee-io/gravitee-ui-components/commit/b27904d))
* fix: resolve gv-rating integration in gv-promote ([b6503a4](https://github.com/gravitee-io/gravitee-ui-components/commit/b6503a4)), closes [gravitee-io/issues#3364](https://github.com/gravitee-io/issues/issues/3364)
* fix: resolve multiple upload of same file in chrome ([84c9a79](https://github.com/gravitee-io/gravitee-ui-components/commit/84c9a79)), closes [gravitee-io/issues#3729](https://github.com/gravitee-io/issues/issues/3729)
* fix: resolve popover above position ([1794f01](https://github.com/gravitee-io/gravitee-ui-components/commit/1794f01)), closes [gravitee-io/issues#3472](https://github.com/gravitee-io/issues/issues/3472)
* fix: Sometimes, screen is loading indefinitely ([5bc2381](https://github.com/gravitee-io/gravitee-ui-components/commit/5bc2381)), closes [gravitee-io/issues#3478](https://github.com/gravitee-io/issues/issues/3478)
* fix: We should justify text on promote API ([964a7c5](https://github.com/gravitee-io/gravitee-ui-components/commit/964a7c5)), closes [gravitee-io/issues#3758](https://github.com/gravitee-io/issues/issues/3758)
* fix(gv-button): add space between icon and text ([b6a0b7c](https://github.com/gravitee-io/gravitee-ui-components/commit/b6a0b7c)), closes [gravitee-io/issues#2964](https://github.com/gravitee-io/issues/issues/2964)
* fix(gv-button): resolve rendering in column ([d76e260](https://github.com/gravitee-io/gravitee-ui-components/commit/d76e260)), closes [gravitee-io/issues#2816](https://github.com/gravitee-io/issues/issues/2816)
* fix(gv-card): resolve size of identidy-picture ([7c7b490](https://github.com/gravitee-io/gravitee-ui-components/commit/7c7b490)), closes [gravitee-io/issues#3464](https://github.com/gravitee-io/issues/issues/3464) [gravitee-io/issues#3484](https://github.com/gravitee-io/issues/issues/3484)
* fix(gv-date-picker): update input when value change ([37a6a3b](https://github.com/gravitee-io/gravitee-ui-components/commit/37a6a3b)), closes [gravitee-io/issues#3565](https://github.com/gravitee-io/issues/issues/3565)
* fix(gv-input): set background-color to transparent ([716e5e5](https://github.com/gravitee-io/gravitee-ui-components/commit/716e5e5))
* fix(gv-menu): compare size of active routes before updating ([704276f](https://github.com/gravitee-io/gravitee-ui-components/commit/704276f)), closes [gravitee-io/issues#3020](https://github.com/gravitee-io/issues/issues/3020)
* fix(gv-menu): resolve truncated text on right slots ([712a667](https://github.com/gravitee-io/gravitee-ui-components/commit/712a667)), closes [gravitee-io/issues#3571](https://github.com/gravitee-io/issues/issues/3571)
* fix(gv-nav): add lock until the click ends ([7bc8a49](https://github.com/gravitee-io/gravitee-ui-components/commit/7bc8a49)), closes [gravitee-io/issues#3025](https://github.com/gravitee-io/issues/issues/3025)
* fix(gv-plans): resolve single item display ([6925632](https://github.com/gravitee-io/gravitee-ui-components/commit/6925632)), closes [gravitee-io/issues#3301](https://github.com/gravitee-io/issues/issues/3301)
* fix(gv-rating-list): mark answer as require ([e490130](https://github.com/gravitee-io/gravitee-ui-components/commit/e490130)), closes [gravitee-io/issues#3824](https://github.com/gravitee-io/issues/issues/3824)
* fix(gv-select): reduce triangle ([79f6285](https://github.com/gravitee-io/gravitee-ui-components/commit/79f6285)), closes [gravitee-io/issues#3795](https://github.com/gravitee-io/issues/issues/3795)
* fix(gv-table): resolve columns alignment ([2d49a24](https://github.com/gravitee-io/gravitee-ui-components/commit/2d49a24)), closes [gravitee-io/issues#3784](https://github.com/gravitee-io/issues/issues/3784) [gravitee-io/issues#3659](https://github.com/gravitee-io/issues/issues/3659)
* fix(gv-table): resolve resolve selection with specific rowheight ([72f72f0](https://github.com/gravitee-io/gravitee-ui-components/commit/72f72f0)), closes [gravitee-io/issues#3797](https://github.com/gravitee-io/issues/issues/3797)
* fix(icon): add possibility to update dynamically color and size ([b5e565c](https://github.com/gravitee-io/gravitee-ui-components/commit/b5e565c)), closes [gravitee-io/issues#3119](https://github.com/gravitee-io/issues/issues/3119)
* fix(nav): resolve navigation state ([ac3f1b5](https://github.com/gravitee-io/gravitee-ui-components/commit/ac3f1b5)), closes [gravitee-io/issues#3045](https://github.com/gravitee-io/issues/issues/3045)
* fix(portal): change gv-metrics example labels ([d9c8df5](https://github.com/gravitee-io/gravitee-ui-components/commit/d9c8df5)), closes [gravitee-io/issues#3492](https://github.com/gravitee-io/issues/issues/3492)
* fix(portal): delete gv-info ([de5617d](https://github.com/gravitee-io/gravitee-ui-components/commit/de5617d)), closes [gravitee-io/issues#3760](https://github.com/gravitee-io/issues/issues/3760)
* fix(portal): fix ratings rendering when used in gv-info-api ([cfb0b9c](https://github.com/gravitee-io/gravitee-ui-components/commit/cfb0b9c)), closes [gravitee-io/issues#3046](https://github.com/gravitee-io/issues/issues/3046)
* fix(portal): generate a view default image with the right title ([1235c1e](https://github.com/gravitee-io/gravitee-ui-components/commit/1235c1e)), closes [gravitee-io/issues#3712](https://github.com/gravitee-io/issues/issues/3712)
* fix(portal): gv-list are now clickable to navigate to apis and apps ([2e52502](https://github.com/gravitee-io/gravitee-ui-components/commit/2e52502)), closes [gravitee-io/issues#3487](https://github.com/gravitee-io/issues/issues/3487)
* fix(portal): prevent gv-image to be rendered if no picture ([d740711](https://github.com/gravitee-io/gravitee-ui-components/commit/d740711)), closes [gravitee-io/issues#3757](https://github.com/gravitee-io/issues/issues/3757)
* fix(portal): reinit options list when input is empty ([179682b](https://github.com/gravitee-io/gravitee-ui-components/commit/179682b)), closes [gravitee-io/issues#3470](https://github.com/gravitee-io/issues/issues/3470)
* fix(portal): set right slot width to 100% ([53770cd](https://github.com/gravitee-io/gravitee-ui-components/commit/53770cd)), closes [gravitee-io/issues#3473](https://github.com/gravitee-io/issues/issues/3473)
* fix(portal): webcomponent translations can have parameters ([a35005d](https://github.com/gravitee-io/gravitee-ui-components/commit/a35005d)), closes [gravitee-io/issues#3491](https://github.com/gravitee-io/issues/issues/3491)
* fix(ui-components): allow customization of oidc and gravitee auth button ([48960c9](https://github.com/gravitee-io/gravitee-ui-components/commit/48960c9)), closes [gravitee-io/issues#3811](https://github.com/gravitee-io/issues/issues/3811)
* fix(ui-components): allow gv-button in gv-table and fix gv-code ([321b0b0](https://github.com/gravitee-io/gravitee-ui-components/commit/321b0b0)), closes [gravitee-io/issues#3611](https://github.com/gravitee-io/issues/issues/3611)
* fix(ui-components): change style for link with href ([c10db86](https://github.com/gravitee-io/gravitee-ui-components/commit/c10db86)), closes [gravitee-io/issues#3810](https://github.com/gravitee-io/issues/issues/3810)
* fix(ui-components): display labels on colors in theme ([05eec4c](https://github.com/gravitee-io/gravitee-ui-components/commit/05eec4c)), closes [gravitee-io/issues#3521](https://github.com/gravitee-io/issues/issues/3521)
* fix(ui-components): fix gv-card-category documentation in story ([4438683](https://github.com/gravitee-io/gravitee-ui-components/commit/4438683)), closes [gravitee-io/issues#2869](https://github.com/gravitee-io/issues/issues/2869)
* fix(ui-components): fix variable name ([0e944ed](https://github.com/gravitee-io/gravitee-ui-components/commit/0e944ed)), closes [gravitee-io/issues#3730](https://github.com/gravitee-io/issues/issues/3730)
* fix(ui-components): improve gv-tree ([0a1d37b](https://github.com/gravitee-io/gravitee-ui-components/commit/0a1d37b)), closes [gravitee-io/issues#3808](https://github.com/gravitee-io/issues/issues/3808)
* fix(ui-components): truncate description if too long ([6bd3e73](https://github.com/gravitee-io/gravitee-ui-components/commit/6bd3e73)), closes [gravitee-io/issues#3756](https://github.com/gravitee-io/issues/issues/3756)
* fix(ui): Generate the application picture using owner name ([c203325](https://github.com/gravitee-io/gravitee-ui-components/commit/c203325)), closes [gravitee-io/issues#3772](https://github.com/gravitee-io/issues/issues/3772)
* feat: Add a footer ([21a6405](https://github.com/gravitee-io/gravitee-ui-components/commit/21a6405)), closes [gravitee-io/issues#2969](https://github.com/gravitee-io/issues/issues/2969)
* feat: add animation on category list ([22eef9c](https://github.com/gravitee-io/gravitee-ui-components/commit/22eef9c)), closes [gravitee-io/issues#3010](https://github.com/gravitee-io/issues/issues/3010) [gravitee-io/issues#2991](https://github.com/gravitee-io/issues/issues/2991)
* feat: add api header component ([39e6103](https://github.com/gravitee-io/gravitee-ui-components/commit/39e6103)), closes [gravitee-io/issues#2983](https://github.com/gravitee-io/issues/issues/2983)
* feat: add autocomplete ([c464cd8](https://github.com/gravitee-io/gravitee-ui-components/commit/c464cd8)), closes [gravitee-io/issues#3009](https://github.com/gravitee-io/issues/issues/3009)
* feat: Add browsers notifications ([ff008d3](https://github.com/gravitee-io/gravitee-ui-components/commit/ff008d3)), closes [gravitee-io/issues#3152](https://github.com/gravitee-io/issues/issues/3152)
* feat: add components for rating an api ([1697216](https://github.com/gravitee-io/gravitee-ui-components/commit/1697216)), closes [gravitee-io/issues#3061](https://github.com/gravitee-io/issues/issues/3061)
* feat: add components for subscriptions ([6f02e05](https://github.com/gravitee-io/gravitee-ui-components/commit/6f02e05)), closes [gravitee-io/issues#2792](https://github.com/gravitee-io/issues/issues/2792)
* feat: add date-picker component ([8cc1e3a](https://github.com/gravitee-io/gravitee-ui-components/commit/8cc1e3a)), closes [gravitee-io/issues#3403](https://github.com/gravitee-io/issues/issues/3403)
* feat: add gv-button component ([30f4a82](https://github.com/gravitee-io/gravitee-ui-components/commit/30f4a82))
* feat: add gv-header component ([f779b8d](https://github.com/gravitee-io/gravitee-ui-components/commit/f779b8d)), closes [gravitee-io/issues#2758](https://github.com/gravitee-io/issues/issues/2758)
* feat: add gv-icon component ([984901e](https://github.com/gravitee-io/gravitee-ui-components/commit/984901e)), closes [gravitee-io/issues#2740](https://github.com/gravitee-io/issues/issues/2740)
* feat: add gv-menu component ([598a899](https://github.com/gravitee-io/gravitee-ui-components/commit/598a899)), closes [gravitee-io/issues#2849](https://github.com/gravitee-io/issues/issues/2849)
* feat: add i18n system ([5197560](https://github.com/gravitee-io/gravitee-ui-components/commit/5197560)), closes [gravitee-io/issues#2940](https://github.com/gravitee-io/issues/issues/2940)
* feat: add pagination component ([2c46d48](https://github.com/gravitee-io/gravitee-ui-components/commit/2c46d48)), closes [gravitee-io/issues#2947](https://github.com/gravitee-io/issues/issues/2947)
* feat: add promote api component ([1600690](https://github.com/gravitee-io/gravitee-ui-components/commit/1600690)), closes [gravitee-io/issues#2781](https://github.com/gravitee-io/issues/issues/2781)
* feat: add rounded attribute to gv-identity-picture ([36ae348](https://github.com/gravitee-io/gravitee-ui-components/commit/36ae348)), closes [gravitee-io/issues#3590](https://github.com/gravitee-io/issues/issues/3590)
* feat: add stepper component ([08b898a](https://github.com/gravitee-io/gravitee-ui-components/commit/08b898a)), closes [gravitee-io/issues#2990](https://github.com/gravitee-io/issues/issues/2990)
* feat: add tag & state component ([c441ae1](https://github.com/gravitee-io/gravitee-ui-components/commit/c441ae1)), closes [gravitee-io/issues#2785](https://github.com/gravitee-io/issues/issues/2785)
* feat: add theme generator ([cf948b0](https://github.com/gravitee-io/gravitee-ui-components/commit/cf948b0)), closes [gravitee-io/issues#2840](https://github.com/gravitee-io/issues/issues/2840)
* feat: Allow a user to change his avatar ([409bb57](https://github.com/gravitee-io/gravitee-ui-components/commit/409bb57)), closes [gravitee-io/issues#2806](https://github.com/gravitee-io/issues/issues/2806)
* feat: Allow a user to consult analytics of an application ([52f0735](https://github.com/gravitee-io/gravitee-ui-components/commit/52f0735)), closes [gravitee-io/issues#2804](https://github.com/gravitee-io/issues/issues/2804)
* feat: Allow a user to consult analytics of an application ([9e78ce4](https://github.com/gravitee-io/gravitee-ui-components/commit/9e78ce4)), closes [gravitee-io/issues#2804](https://github.com/gravitee-io/issues/issues/2804)
* feat: Allow a user to consult its applications ([5a8d066](https://github.com/gravitee-io/gravitee-ui-components/commit/5a8d066)), closes [gravitee-io/issues#2797](https://github.com/gravitee-io/issues/issues/2797)
* feat: Allow a user to consult logs of an application ([9e84883](https://github.com/gravitee-io/gravitee-ui-components/commit/9e84883)), closes [gravitee-io/issues#2805](https://github.com/gravitee-io/issues/issues/2805)
* feat: Allow a user to consult subscriptions of an application ([de4df38](https://github.com/gravitee-io/gravitee-ui-components/commit/de4df38)), closes [gravitee-io/issues#3114](https://github.com/gravitee-io/issues/issues/3114)
* feat: Allow a user to consult/edit global settings of an application ([cf365d4](https://github.com/gravitee-io/gravitee-ui-components/commit/cf365d4)), closes [gravitee-io/issues#2799](https://github.com/gravitee-io/issues/issues/2799)
* feat: Allow a user to contact owner of the platform ([6ecc409](https://github.com/gravitee-io/gravitee-ui-components/commit/6ecc409)), closes [gravitee-io/issues#2795](https://github.com/gravitee-io/issues/issues/2795)
* feat: Allow a user to create an application ([2b941b8](https://github.com/gravitee-io/gravitee-ui-components/commit/2b941b8)), closes [gravitee-io/issues#2798](https://github.com/gravitee-io/issues/issues/2798)
* feat: Allow a user to create an application ([5095386](https://github.com/gravitee-io/gravitee-ui-components/commit/5095386)), closes [gravitee-io/issues#2798](https://github.com/gravitee-io/issues/issues/2798)
* feat: Allow a user to subscribe to notifications on an application ([1c3cd0e](https://github.com/gravitee-io/gravitee-ui-components/commit/1c3cd0e)), closes [gravitee-io/issues#3115](https://github.com/gravitee-io/issues/issues/3115)
* feat: Autofocus on input / textarea ([5e680ed](https://github.com/gravitee-io/gravitee-ui-components/commit/5e680ed)), closes [gravitee-io/issues#2972](https://github.com/gravitee-io/issues/issues/2972)
* feat: change gv-tree default colors ([c6b9ffe](https://github.com/gravitee-io/gravitee-ui-components/commit/c6b9ffe)), closes [gravitee-io/issues#3442](https://github.com/gravitee-io/issues/issues/3442)
* feat: Change the default colors to blue instead of green ([a687c8b](https://github.com/gravitee-io/gravitee-ui-components/commit/a687c8b)), closes [gravitee-io/issues#3396](https://github.com/gravitee-io/issues/issues/3396)
* feat: Create a checkbox component ([48f76a6](https://github.com/gravitee-io/gravitee-ui-components/commit/48f76a6)), closes [gravitee-io/issues#2931](https://github.com/gravitee-io/issues/issues/2931)
* feat: Create a text component ([db18e5b](https://github.com/gravitee-io/gravitee-ui-components/commit/db18e5b)), closes [gravitee-io/issues#2930](https://github.com/gravitee-io/issues/issues/2930)
* feat: create api cards component ([31fdefd](https://github.com/gravitee-io/gravitee-ui-components/commit/31fdefd)), closes [gravitee-io/issues#2726](https://github.com/gravitee-io/issues/issues/2726)
* feat: design homepage ([632ba8c](https://github.com/gravitee-io/gravitee-ui-components/commit/632ba8c)), closes [gravitee-io/issues#2787](https://github.com/gravitee-io/issues/issues/2787)
* feat: Display a global loader when calling server ([44df84d](https://github.com/gravitee-io/gravitee-ui-components/commit/44df84d)), closes [gravitee-io/issues#2935](https://github.com/gravitee-io/issues/issues/2935)
* feat: Display a spinner when the application is loading ([5f005a6](https://github.com/gravitee-io/gravitee-ui-components/commit/5f005a6)), closes [gravitee-io/issues#3123](https://github.com/gravitee-io/issues/issues/3123)
* feat: display a sticky menu on scroll ([49b3675](https://github.com/gravitee-io/gravitee-ui-components/commit/49b3675)), closes [gravitee-io/issues#2982](https://github.com/gravitee-io/issues/issues/2982)
* feat: Handle empty states ([ea64c6b](https://github.com/gravitee-io/gravitee-ui-components/commit/ea64c6b)), closes [gravitee-io/issues#2955](https://github.com/gravitee-io/issues/issues/2955)
* feat: Implement the gv-select component ([70e422b](https://github.com/gravitee-io/gravitee-ui-components/commit/70e422b)), closes [gravitee-io/issues#2888](https://github.com/gravitee-io/issues/issues/2888)
* feat: improve components for autocomplete integration ([a94a626](https://github.com/gravitee-io/gravitee-ui-components/commit/a94a626)), closes [gravitee-io/issues#3009](https://github.com/gravitee-io/issues/issues/3009)
* feat: improve components for display API ([b941b5a](https://github.com/gravitee-io/gravitee-ui-components/commit/b941b5a)), closes [gravitee-io/issues#2941](https://github.com/gravitee-io/issues/issues/2941) [gravitee-io/issues#2886](https://github.com/gravitee-io/issues/issues/2886)
* feat: improve components for login form ([09b8c79](https://github.com/gravitee-io/gravitee-ui-components/commit/09b8c79)), closes [gravitee-io/issues#2885](https://github.com/gravitee-io/issues/issues/2885)
* feat: improve components for subscription ([1688d3a](https://github.com/gravitee-io/gravitee-ui-components/commit/1688d3a)), closes [gravitee-io/issues#3078](https://github.com/gravitee-io/issues/issues/3078)
* feat: improve date picker selection ([4cc7ffe](https://github.com/gravitee-io/gravitee-ui-components/commit/4cc7ffe)), closes [gravitee-io/issues#3604](https://github.com/gravitee-io/issues/issues/3604)
* feat: improve display of metrics ([de66a9e](https://github.com/gravitee-io/gravitee-ui-components/commit/de66a9e)), closes [gravitee-io/issues#3632](https://github.com/gravitee-io/issues/issues/3632)
* feat: Improve gv-checkbox's design ([f5a8ea7](https://github.com/gravitee-io/gravitee-ui-components/commit/f5a8ea7)), closes [gravitee-io/issues#3179](https://github.com/gravitee-io/issues/issues/3179)
* feat: improve gv-tree ([a5732ef](https://github.com/gravitee-io/gravitee-ui-components/commit/a5732ef)), closes [gravitee-io/issues#3131](https://github.com/gravitee-io/issues/issues/3131)
* feat: improve readonly mode on inputs ([ae9dd43](https://github.com/gravitee-io/gravitee-ui-components/commit/ae9dd43)), closes [gravitee-io/issues#3538](https://github.com/gravitee-io/issues/issues/3538)
* feat: update AM logo on button provider ([45d2213](https://github.com/gravitee-io/gravitee-ui-components/commit/45d2213)), closes [gravitee-io/issues#3766](https://github.com/gravitee-io/issues/issues/3766)
* feat: use same file-upload component ([03dd309](https://github.com/gravitee-io/gravitee-ui-components/commit/03dd309)), closes [gravitee-io/issues#3463](https://github.com/gravitee-io/issues/issues/3463)
* feat: User dashboard ([1bca24d](https://github.com/gravitee-io/gravitee-ui-components/commit/1bca24d)), closes [gravitee-io/issues#3526](https://github.com/gravitee-io/issues/issues/3526)
* feat(cards): improve hover animation & add missing translation ([bb668dd](https://github.com/gravitee-io/gravitee-ui-components/commit/bb668dd)), closes [gravitee-io/issues#3003](https://github.com/gravitee-io/issues/issues/3003)
* feat(chore): replace 'start' by 'serve' ([5de720b](https://github.com/gravitee-io/gravitee-ui-components/commit/5de720b)), closes [gravitee-io/issues#3624](https://github.com/gravitee-io/issues/issues/3624)
* feat(gv-input): allow clipboard with password ([993d4cf](https://github.com/gravitee-io/gravitee-ui-components/commit/993d4cf)), closes [gravitee-io/issues#3544](https://github.com/gravitee-io/issues/issues/3544)
* feat(gv-menu): improve UX ([698a77e](https://github.com/gravitee-io/gravitee-ui-components/commit/698a77e)), closes [gravitee-io/issues#3004](https://github.com/gravitee-io/issues/issues/3004)
* feat(gv-message): add default background transparent mode ([2af99a8](https://github.com/gravitee-io/gravitee-ui-components/commit/2af99a8)), closes [gravitee-io/issues#3742](https://github.com/gravitee-io/issues/issues/3742)
* feat(gv-metrics): add clickable option ([dfc8d8a](https://github.com/gravitee-io/gravitee-ui-components/commit/dfc8d8a)), closes [gravitee-io/issues#3791](https://github.com/gravitee-io/issues/issues/3791)
* feat(gv-metrics): improve with column mode ([db962e7](https://github.com/gravitee-io/gravitee-ui-components/commit/db962e7)), closes [gravitee-io/issues#3812](https://github.com/gravitee-io/issues/issues/3812)
* feat(gv-nav): add dynamic compact mode ([ff598b5](https://github.com/gravitee-io/gravitee-ui-components/commit/ff598b5)), closes [gravitee-io/issues#3751](https://github.com/gravitee-io/issues/issues/3751)
* feat(gv-stepper): add invalid state ([5ef47bf](https://github.com/gravitee-io/gravitee-ui-components/commit/5ef47bf)), closes [gravitee-io/issues#3778](https://github.com/gravitee-io/issues/issues/3778)
* feat(gv-tree): improve display with scrollbar ([d6d7641](https://github.com/gravitee-io/gravitee-ui-components/commit/d6d7641)), closes [gravitee-io/issues#3645](https://github.com/gravitee-io/issues/issues/3645)
* feat(input): add autocomplete attribute ([27da931](https://github.com/gravitee-io/gravitee-ui-components/commit/27da931)), closes [gravitee-io/issues#2827](https://github.com/gravitee-io/issues/issues/2827)
* feat(portal): add a default logo for gravitee theme ([57ba9bc](https://github.com/gravitee-io/gravitee-ui-components/commit/57ba9bc)), closes [gravitee-io/issues#2810](https://github.com/gravitee-io/issues/issues/2810)
* feat(portal): add a message component for info, succes and error ([d041a14](https://github.com/gravitee-io/gravitee-ui-components/commit/d041a14)), closes [gravitee-io/issues#2750](https://github.com/gravitee-io/issues/issues/2750)
* feat(portal): add a provider signin component ([955f86b](https://github.com/gravitee-io/gravitee-ui-components/commit/955f86b)), closes [gravitee-io/issues#2754](https://github.com/gravitee-io/issues/issues/2754)
* feat(portal): add input components ([7094934](https://github.com/gravitee-io/gravitee-ui-components/commit/7094934)), closes [gravitee-io/issues#2725](https://github.com/gravitee-io/issues/issues/2725)
* feat(portal): add name to gv-input tag, allowing field autocompletion ([dad8558](https://github.com/gravitee-io/gravitee-ui-components/commit/dad8558)), closes [gravitee-io/issues#2810](https://github.com/gravitee-io/issues/issues/2810)
* feat(portal): allow a user to display an API ([604661f](https://github.com/gravitee-io/gravitee-ui-components/commit/604661f)), closes [gravitee-io/issues#2789](https://github.com/gravitee-io/issues/issues/2789)
* feat(portal): change gv-card-category to fit new portal design ([e2f807f](https://github.com/gravitee-io/gravitee-ui-components/commit/e2f807f)), closes [gravitee-io/issues#2788](https://github.com/gravitee-io/issues/issues/2788)
* feat(portal): change the way metrics are loaded ([0709b69](https://github.com/gravitee-io/gravitee-ui-components/commit/0709b69)), closes [gravitee-io/issues#2960](https://github.com/gravitee-io/issues/issues/2960)
* feat(portal): create a tree-view component ([10468a8](https://github.com/gravitee-io/gravitee-ui-components/commit/10468a8)), closes [gravitee-io/issues#2796](https://github.com/gravitee-io/issues/issues/2796)
* feat(portal): display Views picture ([95f1454](https://github.com/gravitee-io/gravitee-ui-components/commit/95f1454)), closes [gravitee-io/issues#3178](https://github.com/gravitee-io/issues/issues/3178)
* feat(portal): fix some CSS for login page ([b52a4d5](https://github.com/gravitee-io/gravitee-ui-components/commit/b52a4d5)), closes [gravitee-io/issues#2725](https://github.com/gravitee-io/issues/issues/2725)
* feat(portal): generate default picture for apis, applications and users ([2a45bb1](https://github.com/gravitee-io/gravitee-ui-components/commit/2a45bb1)), closes [gravitee-io/issues#2853](https://github.com/gravitee-io/issues/issues/2853)
* feat(portal): gv-link can now refer to an external link ([315f355](https://github.com/gravitee-io/gravitee-ui-components/commit/315f355)), closes [gravitee-io/issues#3048](https://github.com/gravitee-io/issues/issues/3048)
* feat(portal): make gv-message closable & add a closeEvent to gvPopover ([3083e46](https://github.com/gravitee-io/gravitee-ui-components/commit/3083e46)), closes [gravitee-io/issues#2956](https://github.com/gravitee-io/issues/issues/2956)
* feat(portal): manage application members ([04d3429](https://github.com/gravitee-io/gravitee-ui-components/commit/04d3429)), closes [gravitee-io/issues#2803](https://github.com/gravitee-io/issues/issues/2803)
* feat(portal): throw a custom submit event when enterKey is pressed ([d8dec0e](https://github.com/gravitee-io/gravitee-ui-components/commit/d8dec0e)), closes [gravitee-io/issues#2793](https://github.com/gravitee-io/issues/issues/2793)
* feat(portal): use api version to generate default picture ([f7374f1](https://github.com/gravitee-io/gravitee-ui-components/commit/f7374f1)), closes [gravitee-io/issues#3436](https://github.com/gravitee-io/issues/issues/3436)
* feat(ui-components): add a card component ([f066a38](https://github.com/gravitee-io/gravitee-ui-components/commit/f066a38)), closes [gravitee-io/issues#2851](https://github.com/gravitee-io/issues/issues/2851)
* feat(ui-components): create a user-menu ([c17d221](https://github.com/gravitee-io/gravitee-ui-components/commit/c17d221)), closes [gravitee-io/issues#2870](https://github.com/gravitee-io/issues/issues/2870)
* refactor: clean var css documentation & theme ([fb64d32](https://github.com/gravitee-io/gravitee-ui-components/commit/fb64d32)), closes [gravitee-io/issues#3808](https://github.com/gravitee-io/issues/issues/3808)
* refactor: Extract contact as a component ([831749b](https://github.com/gravitee-io/gravitee-ui-components/commit/831749b)), closes [gravitee-io/issues#3011](https://github.com/gravitee-io/issues/issues/3011)
* refactor: improve gv-menu ([c16938f](https://github.com/gravitee-io/gravitee-ui-components/commit/c16938f)), closes [gravitee-io/issues#2967](https://github.com/gravitee-io/issues/issues/2967)
* refactor: improve stories with knobs ([5061fe8](https://github.com/gravitee-io/gravitee-ui-components/commit/5061fe8))
* refactor: Remove borders of gv-message ([cb769d9](https://github.com/gravitee-io/gravitee-ui-components/commit/cb769d9)), closes [gravitee-io/issues#2934](https://github.com/gravitee-io/issues/issues/2934)
* refactor: rename gv-nav-link to gv-link ([007aca1](https://github.com/gravitee-io/gravitee-ui-components/commit/007aca1)), closes [gravitee-io/issues#2954](https://github.com/gravitee-io/issues/issues/2954)
* refactor: use search input menu ([52b4466](https://github.com/gravitee-io/gravitee-ui-components/commit/52b4466))
* refactor(gv-rating-list): change permissions system ([40e3098](https://github.com/gravitee-io/gravitee-ui-components/commit/40e3098)), closes [gravitee-io/issues#3302](https://github.com/gravitee-io/issues/issues/3302)
* chore: add lint task ([961ec58](https://github.com/gravitee-io/gravitee-ui-components/commit/961ec58)), closes [gravitee-io/issues#2743](https://github.com/gravitee-io/issues/issues/2743)
* chore: add task to check & extract variables css ([eca6b98](https://github.com/gravitee-io/gravitee-ui-components/commit/eca6b98))
* chore: Dockerize UI projects ([edc97ca](https://github.com/gravitee-io/gravitee-ui-components/commit/edc97ca)), closes [gravitee-io/issues#2855](https://github.com/gravitee-io/issues/issues/2855)
* chore: Enable gzip and add favicon ([b8c122c](https://github.com/gravitee-io/gravitee-ui-components/commit/b8c122c))
* chore: export gravitee icons ([933403b](https://github.com/gravitee-io/gravitee-ui-components/commit/933403b)), closes [gravitee-io/issues#2810](https://github.com/gravitee-io/issues/issues/2810)
* chore: improve dist generation ([a2881b2](https://github.com/gravitee-io/gravitee-ui-components/commit/a2881b2)), closes [gravitee-io/issues#3138](https://github.com/gravitee-io/issues/issues/3138)
* chore: improve npm tasks ([b19b44e](https://github.com/gravitee-io/gravitee-ui-components/commit/b19b44e)), closes [gravitee-io/issues#2709](https://github.com/gravitee-io/issues/issues/2709)
* chore: init project ([7869fa5](https://github.com/gravitee-io/gravitee-ui-components/commit/7869fa5))
* chore: Mavenize UI projects ([847fd04](https://github.com/gravitee-io/gravitee-ui-components/commit/847fd04)), closes [gravitee-io/issues#2843](https://github.com/gravitee-io/issues/issues/2843)
* chore: remove useless "tachyons" library ([c21a247](https://github.com/gravitee-io/gravitee-ui-components/commit/c21a247)), closes [gravitee-io/issues#3036](https://github.com/gravitee-io/issues/issues/3036)
* chore: rename project to gravitee-ui-components ([29e8e49](https://github.com/gravitee-io/gravitee-ui-components/commit/29e8e49)), closes [gravitee-io/issues#2764](https://github.com/gravitee-io/issues/issues/2764)
* chore: some eslint/jshint fixes ([0c2cef9](https://github.com/gravitee-io/gravitee-ui-components/commit/0c2cef9))
* chore: upgrade storybook version to 5.2.8 ([1045a3f](https://github.com/gravitee-io/gravitee-ui-components/commit/1045a3f)), closes [gravitee-io/issues#3013](https://github.com/gravitee-io/issues/issues/3013)
* chore: use webpack dynamic import in charts ([88076d0](https://github.com/gravitee-io/gravitee-ui-components/commit/88076d0)), closes [gravitee-io/issues#3138](https://github.com/gravitee-io/issues/issues/3138)
* chore(portal): pagination data are now numbers ([ea92d9d](https://github.com/gravitee-io/gravitee-ui-components/commit/ea92d9d)), closes [gravitee-io/issues#2965](https://github.com/gravitee-io/issues/issues/2965)
* test: fix unit test ([8ebd6b5](https://github.com/gravitee-io/gravitee-ui-components/commit/8ebd6b5))
* ci: fix build ([090153c](https://github.com/gravitee-io/gravitee-ui-components/commit/090153c))
* docs: add README.md ([97d0e18](https://github.com/gravitee-io/gravitee-ui-components/commit/97d0e18))

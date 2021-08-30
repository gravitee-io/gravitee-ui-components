# Components usages

| Components                      | Portal |     | APIM | Cockpit | AM  |
| ------------------------------- | ------ | --- | ---- | ------- | --- |
| ATOMS                           | ------ | --- | ---- | ------- | --- |
| `gv-autocomplete`               | X      |     |      | X       |     |
| `gv-button`                     | X      |     | X    | X       | X   |
| `gv-checkbox`                   | X      |     |      |         |     |
| `gv-date-picker`                | X      |     | X    | X       |     |
| `gv-date-picker-calendar`       |        |     |      |         |     |
| `gv-date-picker-cell`           |        |     |      |         |     |
| `gv-file-upload`                | X      |     |      | X       |     |
| `gv-icon`                       | X      |     | X    | X       |     |
| `gv-image`                      | X      |     | X    | X       |     |
| `gv-input`                      | X      |     | X    | X       |     |
| `gv-input-message`              |        |     |      |         |     |
| `gv-link`                       | X      |     |      | X       |     |
| `gv-message`                    | X      |     |      | X       |     |
| `gv-metric`                     | X      |     |      |         |     |
| `gv-relative-time`              | X      |     |      |         |     |
| `gv-select`                     | X      |     |      | X       |     |
| `gv-switch`                     | X      |     | X    | X       |     |
| `gv-tag`                        | X      |     |      | X       |     |
| `gv-text`                       | X      |     |      |         |     |
| MOLECULES                       | ------ | --- | ---- | ------- | --- |
| `gv-card`                       | X      |     |      | X       |     |
| `gv-card-full`                  | X      |     |      |         |     |
| `gv-card-list`                  | X      |     |      |         |     |
| `gv-category`                   | X      |     |      |         |     |
| `gv-category-list`              | X      |     |      |         |     |
| `gv-code`                       | X      |     | X    | X       |     |
| `gv-code-hint`                  |        |     |      |         |     |
| `gv-confirm`                    | X      |     |      | X       |     |
| `gv-cron-editor`                |        |     | X    |         |     |
| `gv-dropdown-menu`              |        |     |      |         |     |
| `gv-expandable`                 |        |     | X    |         |     |
| `gv-expression-language`        |        |     | X    |         | X   |
| `gv-identity-picture`           | X      |     |      | X       |     |
| `gv-list`                       | X      |     |      |         |     |
| `gv-metrics`                    | X      |     |      |         |     |
| `gv-modal`                      |        |     |      | X       |     |
| `gv-nav`                        | X      |     |      | X       | X   |
| `gv-option`                     | X      |     | X    |         |     |
| `gv-plans`                      | X      |     |      |         |     |
| `gv-popover`                    |        |     | X    | X       |     |
| `gv-promote`                    | X      |     |      |         |     |
| `gv-rating`                     | X      |     |      | `       |     |
| `gv-rating-list`                | X      |     |      |         |     |
| `gv-row`                        | X      |     | X    |         |     |
| `gv-row-expandable`             |        |     |      | X       |     |
| `gv-stats`                      | X      |     | X    |         |     |
| `gv-stepper`                    | X      |     |      | X       |     |
| `gv-table`                      | X      |     | ?    | X       | ?   |
| `gv-tree`                       | X      |     |      |         |     |
| ORGANISMS                       | ------ | --- | ---- | ------- | --- |
| `gv-documentation`              | X      |     | X    |         |     |
| `gv-header`                     | X      |     |      |         |     |
| `gv-http-client`                |        |     |      |         |     |
| `gv-menu`                       | X      |     | ?    | ?       |     |
| `gv-newsletter-subscription`    |        |     | X    |         | X   |
| `gv-pagination`                 | X      |     |      | X       |     |
| `gv-properties`                 |        |     |      |         |     |
| `gv-resizable-views`            |        |     |      |         |     |
| `gv-resources`                  |        |     |      |         |     |
| `gv-schema-form`                |        |     | X    |         | ?   |
| `gv-schema-form-array`          |        |     |      |         |     |
| `gv-schema-form-control`        |        |     |      |         |     |
| `gv-schema-form-control-object` |        |     |      |         |     |
| `gv-tabs`                       |        |     |      | X       |     |
| `gv-user-menu`                  | X      |     |      | X       |     |
| `gv-vertical-menu`              |        |     |      | X       |     |
| POLICY STUDIO                   | ------ | --- | ---- | ------- | --- |
| `gv-flow`                       |        |     |      |         |     |
| `gv-flow-step`                  |        |     |      |         |     |
| `gv-policy-studio`              |        |     | X    |         | X   |
| `gv-policy-studio-menu`         |        |     |      |         |     |
| CHARTS                          | ------ | --- | ---- | ------- | --- |
| `gv-chart-bar`                  |        |     | X    |         |     |
| `gv-chart-gauge`                |        |     | X    | X       |     |
| `gv-chart-histogram`            |        |     |      | X       |     |
| `gv-chart-line`                 | X      |     | X    | X       |     |
| `gv-chart-map`                  | X      |     | X    |         |     |
| `gv-chart-pie`                  | X      |     | X    |         |     |

# Components internal usage

The following list has been generated with a script, to run it again just open your favorite terminal and run:
```bash
node tasks/list-component-dependencies.mjs
```

**RESULT**
- gv-autocomplete:
- gv-button: gv-icon
- gv-card: gv-image, gv-button, gv-icon
- gv-card-full: gv-image, gv-button, gv-metrics, gv-rating, gv-state, gv-tag, gv-icon, gv-metric
- gv-card-list: gv-card-full, gv-image, gv-button, gv-metrics, gv-rating, gv-state, gv-tag, gv-icon, gv-metric
- gv-category:
- gv-category-list: gv-category
- gv-chart-bar: gv-button, gv-tag, gv-icon
- gv-chart-gauge:
- gv-chart-histogram:
- gv-chart-line: gv-button, gv-tag, gv-icon
- gv-chart-map: gv-button, gv-tag, gv-icon
- gv-chart-pie: gv-button, gv-tag, gv-icon
- gv-checkbox:
- gv-code:
- gv-code-hint:
- gv-confirm: gv-button, gv-icon
- gv-cron-editor: gv-date-picker, gv-tabs, gv-input, gv-tag, gv-date-picker-calendar, gv-option, gv-icon, gv-popover, gv-date-picker-cell, gv-button
- gv-date-picker: gv-date-picker-calendar, gv-date-picker-cell
- gv-date-picker-calendar: gv-date-picker-cell
- gv-date-picker-cell:
- gv-documentation:
- gv-dropdown-menu:
- gv-expandable:
- gv-expression-language: gv-code, gv-code-hint
- gv-file-upload:
- gv-flow: gv-image
- gv-flow-step: gv-image, gv-dropdown-menu, gv-switch
- gv-header: gv-button, gv-tag, gv-icon
- gv-http-client: gv-schema-form, gv-resizable-views, gv-documentation, gv-table, gv-button, gv-option, gv-switch, gv-icon, gv-schema-form-control, gv-image, gv-pagination, gv-input, gv-input-message, gv-select, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-popover, gv-code-hint, gv-date-picker, gv-tabs, gv-tag, gv-date-picker-calendar, gv-date-picker-cell
- gv-icon:
- gv-identity-picture: gv-image
- gv-image:
- gv-input: gv-icon, gv-popover
- gv-input-message: gv-icon
- gv-link: gv-icon
- gv-list: gv-identity-picture, gv-image
- gv-menu: gv-nav, gv-link, gv-icon
- gv-message: gv-icon
- gv-metric: gv-icon
- gv-metrics: gv-metric, gv-icon
- gv-modal: gv-icon
- gv-nav: gv-link, gv-icon
- gv-newsletter-subscription:
- gv-option: gv-button, gv-icon
- gv-pagination: gv-button, gv-icon
- gv-plans: gv-icon
- gv-policy-studio: gv-button, gv-icon, gv-option, gv-documentation, gv-resizable-views, gv-schema-form, gv-http-client, gv-tabs, gv-row, gv-flow, gv-flow-step, gv-policy-studio-menu, gv-schema-form-control, gv-table, gv-switch, gv-image, gv-dropdown-menu, gv-state, gv-popover, gv-input, gv-input-message, gv-select, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-code-hint, gv-date-picker, gv-tag, gv-date-picker-calendar, gv-pagination, gv-date-picker-cell
- gv-policy-studio-menu: gv-image, gv-state, gv-popover, gv-flow-step, gv-dropdown-menu, gv-switch
- gv-popover:
- gv-promote: gv-image, gv-button, gv-rating, gv-metrics, gv-icon, gv-metric
- gv-properties: gv-schema-form, gv-resizable-views, gv-table, gv-button, gv-input, gv-icon, gv-text, gv-input-message, gv-select, gv-schema-form-control, gv-image, gv-pagination, gv-popover, gv-switch, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-code-hint, gv-date-picker, gv-tabs, gv-tag, gv-date-picker-calendar, gv-option, gv-date-picker-cell
- gv-rating: gv-icon
- gv-rating-list: gv-relative-time, gv-identity-picture, gv-rating, gv-confirm, gv-image, gv-icon, gv-button
- gv-relative-time:
- gv-resizable-views:
- gv-resources: gv-schema-form, gv-resizable-views, gv-documentation, gv-table, gv-button, gv-option, gv-switch, gv-icon, gv-schema-form-control, gv-image, gv-pagination, gv-input, gv-input-message, gv-select, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-popover, gv-code-hint, gv-date-picker, gv-tabs, gv-tag, gv-date-picker-calendar, gv-date-picker-cell
- gv-row:
- gv-row-expandable:
- gv-schema-form: gv-schema-form-control, gv-input, gv-input-message, gv-select, gv-switch, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-icon, gv-popover, gv-code-hint, gv-date-picker, gv-tabs, gv-tag, gv-date-picker-calendar, gv-option, gv-date-picker-cell, gv-button
- gv-schema-form-array:
- gv-schema-form-control: gv-input, gv-input-message, gv-select, gv-switch, gv-code, gv-expression-language, gv-cron-editor, gv-autocomplete, gv-schema-form-array, gv-schema-form-control-object, gv-icon, gv-popover, gv-code-hint, gv-date-picker, gv-tabs, gv-tag, gv-date-picker-calendar, gv-option, gv-date-picker-cell, gv-button
- gv-schema-form-control-object:
- gv-select: gv-icon
- gv-spinner:
- gv-state:
- gv-stats: gv-button, gv-tag, gv-icon
- gv-stepper:
- gv-switch:
- gv-table: gv-image, gv-pagination, gv-button, gv-icon
- gv-tabs: gv-option, gv-button, gv-icon
- gv-tag: gv-icon
- gv-text:
- gv-theme:
- gv-tree: gv-button, gv-icon
- gv-user-menu: gv-nav, gv-link, gv-icon
- gv-vertical-menu: gv-nav, gv-image, gv-link, gv-icon

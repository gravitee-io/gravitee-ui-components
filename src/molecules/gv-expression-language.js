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
import { GvCode } from '../molecules/gv-code';
import { dispatchCustomEvent } from '../lib/events';
import { pickedCompletion, startCompletion } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { EditorSelection, Prec } from '@codemirror/state';
import { get } from 'object-path';

/**
 * Expression Language component
 *
 * @fires gv-expression-language:input - input events with the `value` on `detail`
 * @fires gv-expression-language:ready - event dispatch when component is ready
 * @fires gv-expression-language:clipboard-copy - event dispatch when component the `value` has been copied to clipboard
 *
 * @attr {String} label - code language
 * @attr {String} value - code content to be highlighted
 * @attr {options} Object - options based on codemirror
 * @attr {String} placeholder - an example value to display in the input when empty
 * @attr {Number} rows - number of rows of the text element
 * @attr {Boolean} large - for a large input (only if the field has one row)
 * @attr {Boolean} medium - for a medium input (only if the field has one row) (Default)
 * @attr {Boolean} small - for a small input (only if the field has one row)
 * @attr {Object} grammar - The grammar for Expression Language support
 *
 * @attr {Boolean} [clipboard=false]- true if field has clipboard button
 * @attr {Boolean} [autofocus=false] - true to put the focus on the input
 * @attr {Boolean} [readonly=false] - true if field is readonly mode
 */
export class GvExpressionLanguage extends GvCode {
  static get properties() {
    return {
      ...super.properties,
      grammar: { type: Object },
    };
  }

  firstUpdated() {
    super.firstUpdated();
    dispatchCustomEvent(this, 'ready', { currentTarget: this });
  }

  getExtensions() {
    return [Prec.high(this.insertELKeymap())];
  }

  insertELKeymap() {
    return keymap.of([
      {
        key: 'Ctrl-Shift-e',
        mac: 'Cmd-Shift-e',
        run(view) {
          view.dispatch(
            view.state.changeByRange((range) => ({
              changes: [{ from: range.from, to: range.to, insert: '{#}' }],
              range: EditorSelection.range(range.from + 2, range.from + 2),
            })),
          );
          startCompletion(view);
          return true;
        },
      },
    ]);
  }

  buildMethods(type) {
    const modelType = this.getModelType(type);
    return modelType.methods.map(({ name, params = [], returnType }) => {
      const command = `${name}()`;
      const displayParams = params.map((p) => `${p.type} ${p.name}`);
      const label = `${name}(${displayParams.join(', ')})`;
      const detail = `return ${returnType}`;
      return {
        type: 'method',
        command,
        apply: (view, completion, from, to) => {
          const anchor = from + name.length + 1;
          view.dispatch({
            changes: { from, to, insert: completion.command },
            selection: { anchor },
            userEvent: 'input.complete',
            annotations: pickedCompletion.of(view),
          });
        },
        label,
        detail,
      };
    });
  }

  findBestAutocompleteHandler(completionContext) {
    return this.expressionLanguageCompletionHandlers
      .filter((handler) => (this.grammar != null && handler.supportEL === true) || handler.supportEL !== true)
      .map((handler) => {
        const match = handler.expr ? completionContext.matchBefore(handler.expr) : true;
        return { handler, match };
      })
      .find(({ match, expr }) => match);
  }

  getModelType(typeId) {
    if (this.grammar != null) {
      return get(this.grammar, `_types.${typeId}`);
    }
    return null;
  }

  isMap(typeId) {
    return ['Map', 'HttpHeaders', 'MultiValueMap'].includes(typeId);
  }

  getEnum(typeId) {
    if (this.grammar != null) {
      return get(this.grammar, `_enums.${typeId}`);
    }
    return [''];
  }

  convertType(type) {
    if (type) {
      const lowerType = type.toLowerCase();
      if (lowerType === 'string') {
        return 'text';
      } else if (lowerType === 'httpheaders' || lowerType === 'multivaluemap') {
        return 'type';
      } else if (lowerType === 'int' || lowerType === 'long') {
        return 'variable';
      } else if (lowerType.includes('[]')) {
        return 'enum';
      }
    }
    return 'variable';
  }

  get expressionLanguageCompletionHandlers() {
    return [
      {
        expr: /{#[a-z]*/,
        supportEL: true,
        run(completionContext, match) {
          const prefix = match.text.replaceAll('{#', '');
          const from = completionContext.pos - prefix.length;
          const options = Object.keys(this.grammar)
            .filter((command) => !command.startsWith('_') && command.startsWith(prefix))
            .map((command) => {
              return {
                type: 'variable',
                command,
                apply: command,
                label: command,
              };
            });
          return { from, options };
        },
      },
      {
        expr: /{#[a-z]*.[a-zA-Z]*/,
        supportEL: true,
        run(completionContext, match) {
          const tokens = match.text.split('.');
          const key = tokens[0].replaceAll('{#', '');
          const prefix = tokens[1];
          let candidate = this.grammar[key][prefix];
          let options = [];
          let from = completionContext.pos;
          if (candidate) {
            if (this.isMap(candidate._type)) {
              options = this.getEnum(candidate._type).map((value) => {
                const type = this.convertType(candidate._type);
                const command = `['${value}'][0]`;
                return {
                  type,
                  command,
                  apply: command,
                  label: value,
                };
              });
            }
          } else {
            from -= prefix.length;
            candidate = this.grammar[key];
            if (candidate._type) {
              options = this.buildMethods(candidate._type);
            } else {
              options = Object.keys(candidate)
                .filter((command) => !command.startsWith('_') && command.startsWith(prefix))
                .map((command) => ({
                  type: this.convertType(candidate[command]._type),
                  command,
                  apply: command,
                  label: command,
                }));
            }
          }
          return { from, options };
        },
      },
      {
        expr: /{#[a-z]*.[a-zA-Z]*.[a-zA-Z]*/,
        supportEL: true,
        run(completionContext, match) {
          const tokens = match.text.split('.');
          const key = tokens[0].replaceAll('{#', '');
          const word = tokens[1];
          const prefix = tokens[2];
          const candidate = this.grammar[key][word];
          let options = [];
          let from = completionContext.pos;
          if (candidate) {
            if (this.isMap(candidate._type)) {
              options = this.getEnum(candidate._type)
                .filter((command) => !command.startsWith('_') && command.startsWith(prefix))
                .map((label) => {
                  const type = this.convertType(candidate._type);
                  return {
                    type,
                    command: `['${label}'][0]`,
                    apply(view, completion, _from, to) {
                      from = _from - prefix.length - 1;
                      view.dispatch({
                        changes: { from, to, insert: completion.command },
                        selection: { anchor: from + completion.command.length },
                        userEvent: 'input.complete',
                        annotations: pickedCompletion.of(view),
                      });
                    },
                    label,
                  };
                });
            } else {
              if (candidate._type) {
                options = this.buildMethods(candidate._type);
              } else {
                from -= prefix.length;
                options = Object.keys(candidate)
                  .filter((command) => command.startsWith(prefix))
                  .map((command) => {
                    return {
                      type: this.convertType(candidate[command]._type),
                      command,
                      apply: command,
                      label: command,
                    };
                  });
              }
            }
          }
          return { from, options };
        },
      },
      this.defaultCompletionHandler,
    ];
  }
}

window.customElements.define('gv-expression-language', GvExpressionLanguage);

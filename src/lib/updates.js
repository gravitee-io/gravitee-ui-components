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

// A value travelling down a deep form costs one round per level, and a handful of levels is
// already more than any schema in use. The bound only exists so that two elements asking each
// other to update cannot hang the promise for good.
const maximumRounds = 20;

function collectPending(root, pending) {
  root.querySelectorAll('*').forEach((element) => {
    if (element.isUpdatePending === true) {
      pending.push(element);
    }
    if (element.shadowRoot != null) {
      collectPending(element.shadowRoot, pending);
    }
  });
  return pending;
}

/**
 * Resolves once neither `element` nor its shadow tree has an update pending.
 *
 * The schema form components hand their value down to their children once their own render is
 * over, and receiving a value schedules another update on the child, which in turn hands it down.
 * Awaiting the children a single time therefore resolves while the value is still on its way to
 * the bottom of the tree — precisely what `updateComplete` promises it is not. Rendering a child
 * can also send the parent back for another round, so the element itself is awaited again as long
 * as it asks for it.
 *
 * @param {Element} element the element whose shadow tree has to settle
 * @param {Function} updateComplete gives back `super.getUpdateComplete()`, awaited once per round
 * @returns {Promise<boolean>} what the last `super.getUpdateComplete()` resolved to
 */
export async function untilSettled(element, updateComplete) {
  let result = await updateComplete();
  for (let round = 0; round < maximumRounds; round++) {
    const pending = collectPending(element.shadowRoot, []);
    if (pending.length === 0 && !element.isUpdatePending) {
      return result;
    }
    await Promise.all(pending.map((child) => child.updateComplete));
    if (element.isUpdatePending) {
      result = await updateComplete();
    }
  }
  return result;
}

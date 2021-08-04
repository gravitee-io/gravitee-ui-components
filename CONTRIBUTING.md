# Contributing to Gravitee.io

You think Gravitee.io is awesome and want to contribute to the project?
Here are few guidelines that should help you get started.

## Using GitHub issues

Found a bug in the source code? Or wants to propose new features or enhancements?
You can help us by submitting an issue in the [repository](https://github.com/gravitee-io/gravitee-ui-components).
Before submitting your issue, search in the [archive issues](https://github.com/gravitee-io/issues/issues) if it doesn't have already been answered.

Providing the following information will help us to deal quickly with your issue :

* **Overview of the issue** : describe the issue and why this is a bug for you.
* **You have stack trace, screenshots, logs?** add these to the issue's description.

## Submitting changes

You've submitted an issue to the project and know how to fix it? You can contribute to the project by [forking the repository](https://guides.github.com/activities/forking) and [submitting your pull requests](https://guides.github.com/activities/forking/#making-a-pull-request).

Before submitting your pull request consider the following guidelines:

* Make your changes in a new git branch:

```shell
git checkout -b issue-<issue-id>-my-fix-branch master
```
	Note : issue-id reference the id generated by GitHub (#issue-id).

* Create your patch, **including appropriate test cases**.
* Update the documentation if you create new features or think the documentation needs to be updated/completed.
* Build your changes locally to **ensure all the linters rules and test pass**

```shell
npm run lint
npm run test
```
* Commit your changes using a descriptive commit message.

```shell
 git commit -a
```

* Push your branch to GitHub:

```shell
git push origin issue-<issue-id>-my-fix-branch
```

* In GitHub, send a pull request to `<gravitee-io/gravitee-ui-components>:master`.

* If we suggest changes then:
** Make the required updates.
** Re-run the test suite to ensure tests are still passing.
** Commit your changes to your branch (e.g. `issue/<issue-id>-my-fix-branch`).
** Push the changes to your GitHub repository (this will update your Pull Request).

If the PR gets too outdated we may ask you to rebase and force push to update the PR:

```shell
git rebase master
git push origin issue-<issue-id>-my-fix-branch -f
```

That's it! You've just contributed to the project, and we really appreciate it!

## Contributor License Agreement

Please sign our [Contributor License Agreement (CLA)](https://download.gravitee.io/cla.pdf) and send it to contact@graviteesource.com. For any code changes to be accepted, the CLA must be signed.

## Further Information

You can find more detailed information about contributing in the [Github guides](https://guides.github.com/activities/contributing-to-open-source).
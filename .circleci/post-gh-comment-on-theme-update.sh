#!/bin/bash


FORK_POINT=$(git merge-base --fork-point master)
THEME_HAS_CHANGED=$(git diff "$FORK_POINT" --exit-code --name-only src/theme/definition.json)

if [ "$THEME_HAS_CHANGED" = "" ]; then
  echo "🚀C'est parti!"
else
  echo "Attention le fichier de definition des styles a été modifié"
  MESSAGE=":robot:  Hey Dear Reviewer! I'm the Gravitee.io bot.\nI just to tell you that 'definition.json' has been updated in this PR.\nAs this file is used to theme clients' portals you should carefully review it to avoid regression as most as possible!"

  echo "Gravitee.io Bot will post the following comment on the PR to warn the reviewer: $MESSAGE"

  PR_NUMBER=$(echo "$CIRCLE_PULL_REQUEST" | sed "s/.*\/pull\///")

  API_GITHUB="https://api.github.com/repos/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME"
  PR_URL="$API_GITHUB/issues/$PR_NUMBER/comments"

  PR_COMMENTS=$(curl -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "$PR_URL")
  NB_OF_PREVIOUS_COMMENTS=$(echo "$PR_COMMENTS" | jq "map(select(.user.login == \"graviteeio\")) | map(select(.body|test(\"$MESSAGE\"))) | map(.id) | length")
  echo "Nb of comments already posted with this message: $NB_OF_PREVIOUS_COMMENTS"

  if [ "$NB_OF_PREVIOUS_COMMENTS" = 0 ]; then
    PR_RESPONSE=$(curl -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -d "{\"body\": \"$MESSAGE\"}" "$PR_URL")
    echo "PR_RESPONSE: $PR_RESPONSE"
  fi
fi

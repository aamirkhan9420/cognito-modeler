#/bin/bash

APP_VERSION=$(npm run --silent get-version)
echo "Artifact version::$APP_VERSION"
echo "APP_VERSION=$APP_VERSION" >> "$GITHUB_OUTPUT"

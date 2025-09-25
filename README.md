# pep621-badges

Serverless badges from your PEP-621 `pyproject.toml` with Github Actions.

![build](https://raw.githubusercontent.com/action-badges/pep621-badges/badges/.badges/main/build-status.svg)
![coverage](https://raw.githubusercontent.com/action-badges/pep621-badges/badges/.badges/main/coverage.svg)
![tag](https://raw.githubusercontent.com/action-badges/pep621-badges/badges/.badges/github-tag.svg)
![license](https://raw.githubusercontent.com/action-badges/pep621-badges/badges/.badges/main/package-license.svg)
![node](https://raw.githubusercontent.com/action-badges/pep621-badges/badges/.badges/main/package-node-version.svg)

Examples:

```yaml
name: Make PEP-621 Badges
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: action-badges/create-orphan-branch@0.1.1
        with:
          branch-name: badges

      - name: Make version Badge
        uses: action-badges/pep621-badges@0.2.0
        with:
          file-name: package-version.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: version

      - name: Make license badge
        uses: action-badges/pep621-badges@0.2.0
        with:
          file-name: package-license.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: license

      - name: Make python version badge
        uses: action-badges/pep621-badges@0.2.0
        with:
          file-name: python-version.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: python-version
```

All of the standard action-badges [parameters](https://github.com/action-badges/core/blob/main/docs/github-action.md#parameters) can also be used.


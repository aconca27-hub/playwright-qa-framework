# Playwright QA Framework

[![Playwright Tests](https://github.com/aconca27-hub/playwright-qa-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/aconca27-hub/playwright-qa-framework/actions/workflows/playwright.yml)

A TypeScript automation framework built with [Playwright](https://playwright.dev), covering UI flows and REST API contracts, with every push verified in GitHub Actions.

Built by Adolfo Conca, QA Engineer. Two years as sole QA on a HIPAA-regulated workers' compensation platform, plus QA lead roles in healthcare and title insurance. This repo is the framework I would stand up on day one at a new team.

## What is covered

| Layer | Target | Tests |
| --- | --- | --- |
| UI | [saucedemo.com](https://www.saucedemo.com) | Login (happy path, lockout, bad password, empty form), inventory (count, sort by name and price, cart badge, cart persistence across reload), data-driven checkout from JSON, checkout validation |
| API | [restful-booker](https://restful-booker.herokuapp.com) | Health check, full create/read/update/delete lifecycle with token auth, forbidden update without a token, 404 on unknown booking |

UI tests run in Chromium and WebKit. API tests run in their own project with no browser.

## Run it

```bash
npm ci
npx playwright install --with-deps   # first time only
npm test                              # everything
npm run test:ui                       # Chromium only
npm run test:api                      # API only
npm run report                        # open the last HTML report
```

## Structure

```
src/pages/       Page objects, one class per screen, locators by data-test attribute
src/fixtures/    Custom test fixture that injects page objects and a logged-in session
src/data/        Test users and data-driven checkout scenarios
tests/ui/        UI specs
tests/api/       API specs using Playwright's request context
.github/         CI workflow: runs on push and PR, uploads the HTML report
```

## Test strategy

These are the standards I apply to every suite, carried over from production QA work:

- **One action per step.** Each test step does one thing, so a failure points at one cause.
- **Locators by contract, not by layout.** `data-test` attributes first, roles second, CSS last. A redesign should not break a test.
- **Page objects own the how, tests own the what.** Tests read as the acceptance criteria they verify.
- **Data-driven where the inputs vary.** Checkout scenarios live in JSON; adding a case is a data change, not a code change.
- **Negative paths are first-class.** Every feature has at least one test for what should be refused.
- **API before UI.** Contract tests catch backend regressions in seconds; UI tests confirm the integration.
- **CI is the source of truth.** Retries on CI only, trace on first retry, report uploaded on every run so a red build is debuggable without rerunning.
- **Defect reporting default:** Medium severity, High priority, reproduction steps with one action per step, no suggested fix in the report.

## Next

The companion project, a workers' compensation claims demo app with this framework pointed at it, is in progress.

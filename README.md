# Playwright Test Automation Showcase

[![Playwright Tests](https://github.com/RenaAy2026/qara-automation-showcase/actions/workflows/playwright.yml/badge.svg)](https://github.com/RenaAy2026/qara-automation-showcase/actions/workflows/playwright.yml)

A test automation project built with Playwright and TypeScript. It covers UI and API testing against public practice sites, uses the Page Object Model, and runs automatically in GitHub Actions.

## What is tested

- **UI tests** against [Sauce Demo](https://www.saucedemo.com), a practice e-commerce site: login, shopping cart, sorting, checkout, and automated checks for two known defects found with its faulty `problem_user` account (13 tests)
- **API tests** against [Restful-Booker](https://restful-booker.herokuapp.com), a practice booking API: create, fetch, update, delete, and a rejected unauthorized update (5 tests)

Tests are tagged `@smoke` (quick checks of key flows) and `@regression` (broader coverage).

## Browsers and devices

The suite runs in four projects: Chromium and WebKit on desktop, plus Pixel 5 and iPhone 12 mobile emulation. The mobile projects use browser emulation, not real devices.

## Tech

Playwright, TypeScript, Node.js, GitHub Actions.


## Getting started

You need Node.js 20 or newer.

```bash
git clone https://github.com/RenaAy2026/qara-automation-showcase.git
cd qara-automation-showcase
npm install
npx playwright install
```

## Running the tests

```bash
# Run everything in all four projects
npx playwright test

# Run only the quick smoke tests
npx playwright test --grep @smoke

# Run one project
npx playwright test --project=chromium

# Open the HTML report from the last run
npx playwright show-report
```

## Continuous integration

Every push triggers the GitHub Actions workflow in `.github/workflows/playwright.yml`, which installs the project, runs the tests, and reports pass or fail.


## Documentation

- [Test strategy](docs/TEST_STRATEGY.md): what is automated and why, how flaky tests are handled, and how this would scale to a real product
- [Bug reports](docs/BUG_REPORTS.md): two defects found in Sauce Demo's `problem_user` account, with steps, evidence and a `standard_user` control check
- [AI-assisted workflow](docs/AI_WORKFLOW.md): how AI was used to draft tests, and real examples of what I had to fix
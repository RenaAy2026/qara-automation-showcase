# Test Strategy

This is the approach behind the automated tests in this repo. It is written for a small practice project, but the reasoning applies to a real product.

## Goals

- Catch regressions in the most important user flows quickly.
- Keep the suite fast and reliable enough that a failure means something.
- Make failures easy to diagnose from the report alone.

## What is automated, and why

| Area | Why it is automated |
| --- | --- |
| Login (valid, invalid, locked-out user) | Every user depends on it, and the rules are stable |
| Cart and sorting | High-traffic flow with clear expected results |
| Checkout, including form validation | The business-critical path, so it earns the most coverage |
| API create, fetch, update, delete | Fast and precise, and catches problems before the UI does |
| Unauthorized API update | A security-style negative check that is cheap to run |

## Test levels

- **UI tests** check that the main flows work end to end in a browser.
- **API tests** check business rules and responses directly, with no browser. They run in a fraction of a second, so they are the better place for detailed checks.
- The pattern is a few UI tests for the key journeys, with more detailed coverage pushed down to the API level.

## Tags and when they run

- `@smoke`: a small set of key-flow checks, meant to run on every change.
- `@regression`: broader coverage, meant for fuller runs.

## Design decisions

- **Page Object Model:** page details live in one place, so a change to the site means one fix, not many.
- **Independent tests:** each test sets up its own state, so tests can run in any order and in parallel.
- **No hardcoded expectations that can drift:** the sorting test computes the expected order instead of typing prices.
- **Test data created through the API:** API tests create the booking they need and do not depend on existing records.


## Handling flaky tests

- Playwright waits for elements automatically, so tests avoid fixed sleeps.
- In CI the config retries a failed test up to 2 times and records a trace on the first retry, so a failure can be inspected step by step.
- A test that only passes on retry is treated as a defect to fix, not a pass to ignore.
- Failures are checked to see whether they come from the product, the test, or the environment. For example, one CI run in this repo failed because GitHub could not start a runner machine, so no tests ran. The next run with the same code passed. That was an infrastructure outage and no test change was needed.

## What stays manual or exploratory

- Visual design, layout and "does this feel right" judgments
- New features, until their behavior is stable enough to automate
- Unusual device, network and interruption scenarios, such as poor signal, backgrounding the app, or low battery
- Usability and accessibility review

## Known limitations of this project

- The sites under test are public practice sites. They are shared and can be slow or reset their data.
- The mobile projects use browser emulation, not real devices, so they check layout and behavior at phone sizes, not native app behavior.
- There is no visual comparison testing, performance testing or accessibility scanning yet.

## How this would scale to a real product

- **Web, iOS and Android:** keep the same layering. Shared API tests at the base, UI tests for key journeys per platform, and native mobile automation (for example Appium) for flows that only exist in the app.
- **Real devices:** run mobile checks on a mix of physical devices and a cloud device service, chosen by usage data.
- **CI:** run smoke tests on every pull request, the full regression on a schedule, and block merges when smoke tests fail.
- **Ownership:** keep tests next to the code they cover, review them like product code, and track flaky tests so they do not pile up.
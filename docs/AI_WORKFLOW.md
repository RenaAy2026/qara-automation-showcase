# AI-Assisted Workflow

I used Claude to speed up writing the tests in this repo. This document describes how I used it and where I had to step in. AI produces a first draft quickly, but I am responsible for checking it.

## How I work with AI

1. **Describe the goal and the target.** For example, "page object and tests for the Sauce Demo checkout flow."
2. **Get a first draft** of the page object and tests.
3. **Read the draft before running it.** I check that each assertion tests something meaningful, and that locators and test data make sense.
4. **Run it and compare the result with what I expect.** A passing test is not proof that the test is good.
5. **Fix what is wrong, then re-run** and commit only when the result is what I expect.

## Real examples from this project

### 1. Missing types in generated helper functions
- **What happened:** The draft of `problem-user.spec.ts` had two helper functions with an untyped `page` parameter. The editor flagged it with a red underline.
- **Why it matters:** Playwright still ran the tests, so the problem could easily have been ignored. Untyped parameters hide mistakes in a TypeScript project.
- **What I did:** Added the `Page` type to both helpers, re-ran the suite (16 passed, same as before), then committed.

### 2. A wrong guess about a CI failure
- **What happened:** One GitHub Actions run failed after about 15 minutes, while normal runs take 1 to 2 minutes. The AI's first guess was that a slow public practice site had caused a timeout.
- **What I did:** Opened the failed run and read its annotations. They said the hosted runner was never acquired ("The job was not acquired by Runner of type hosted"), together with an internal server error from GitHub. No tests had run at all.
- **Result:** The cause was a GitHub infrastructure problem, not the tests, so the AI's guess was wrong. The next run with the same code passed. No test change was needed.
- **Lesson:** Check the evidence before accepting an explanation, including one from AI.

### 3. Excluding findings I could not reproduce
- **What happened:** While exploring the `problem_user` account, I saw two odd things once: correct product images after changing the sort, and being signed out on a page reload.
- **What I did:** Repeated both. Neither happened again, so I left them out of `BUG_REPORTS.md` and wrote up only the two defects that reproduced every time (BUG-001 and BUG-002), each compared against `standard_user`.
- **Lesson:** A bug report should contain only what can be reproduced. AI can help organize observations, but deciding what counts as a confirmed defect is a human job.

### 4. Checking that a pasted file is complete
- **What happened:** One API test file failed with a syntax error. The file had been cut off partway through when it was copied into the editor, so the closing brackets were missing.
- **What I did:** Compared the file against the intended code, found it ended early, replaced it with the full version, and confirmed that all 5 tests passed.
- **Lesson:** When a syntax error appears in AI-assisted code, first check that the file is complete and matches what was intended. This one was a copy problem and not a logic error.

### 5. A test that could pass without testing anything
- **What happened:** While reviewing these notes, I asked why a passing test is not proof that the test is good. The AI pointed to my own sorting test in `shopping.spec.ts`. It sorted the prices and compared them with a sorted copy, but it never checked that any products existed. With an empty product list, both lists would be empty and the test would pass while the page was broken.
- **What I did:** Added a check that at least one price is found before comparing the order, then re-ran the shopping tests (12 passed).
- **Lesson:** Review generated tests for assertions that can be satisfied by accident, not only for ones that fail. A green result on its own does not show that a test is checking anything.

### 6. A CI job that kept stalling during setup
- **What happened:** After a README-only commit, a GitHub Actions run stayed "in progress" for an hour and was cancelled at the 60-minute limit. Earlier runs of the same tests had passed in under 2 minutes. At first glance it looked like the earlier runner outage, but that one had failed because no machine was ever assigned.
- **What I did:** Read the step-by-step log. Setup, checkout, Node and dependency install passed in about a second each. The step "Install Playwright Browsers" ran for over an hour and stopped partway through downloading system packages. The tests never started.
- **First fix attempt (did not solve it):** Pinned the runner to `ubuntu-24.04`, since the log showed Ubuntu 26.04 package sources and GitHub was moving its default image, and lowered the job timeout to 15 minutes. One run passed, but the next two hit the 15-minute limit, and the one I checked had stalled at the same step. The Ubuntu 26 theory was wrong, or at least not enough.
- **Second attempt (also did not solve it):** Installed only the two browsers the config uses and added a 5-minute limit to that step. It stalled again, this time while downloading a font package from the Ubuntu mirror, and failed after 5 minutes.
- **Fix that has worked so far:** Ran the job inside Playwright's official container image, which already contains the browsers and system packages, and removed the install step. The next run passed in about 1.5 minutes.
- **What I can't claim:** I do not know why the package downloads stalled, and one green run on the new setup does not prove it is fixed for good. I will keep watching the next runs.
- **Lesson:** Read the log to find the failing step, test a theory with a small change, and drop the theory when the evidence says no. Timeouts turn a long hang into a quick, readable failure.

## Rules I follow
- I read every generated test before running it.
- I do not trust a passing test until I know what it asserts.
- I check failures against real evidence (reports, logs, annotations) before deciding what caused them.
- I keep the page object model and naming consistent, so generated code looks like the rest of the project.
- I only document and claim what I have run myself.
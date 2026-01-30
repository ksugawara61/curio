# GitHub Issue Investigation & Action Plan

Investigate the specified GitHub issue and organize an action plan.

## Instructions

1. **Fetch the issue** using `gh issue view $ARGUMENTS --repo ksugawara61/curio` to retrieve the title, body, labels, and comments.

2. **Analyze the issue** by understanding:
   - What is the problem or feature request?
   - What are the acceptance criteria or expected behavior?
   - Are there any related issues or PRs mentioned?

3. **Research the codebase** to find:
   - Which files and modules are relevant to this issue?
   - How the current implementation works in the affected area
   - Any existing tests covering the affected area

4. **Organize the action plan** with the following format:

---

## Issue Summary
- **Title**: (issue title)
- **Type**: Bug / Feature / Improvement / Refactoring
- **Scope**: (affected apps/packages)

## Current Behavior
(Describe what currently happens or what is missing)

## Expected Behavior
(Describe the desired outcome based on the issue)

## Relevant Files
(List key files that will need changes, with brief descriptions)

## Action Plan
(Numbered list of concrete implementation steps)

## Considerations
(Any risks, edge cases, breaking changes, or migration needs to be aware of)

---

Use the `gh` CLI for all GitHub operations. Thoroughly explore the codebase to provide accurate file references.

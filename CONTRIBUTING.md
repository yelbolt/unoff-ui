# Contributing to Unoff UI

Thank you for your interest in contributing to Unoff UI! This guide explains how the project is organised and how to participate effectively.

---

## Before you start

This is a community-driven project. The process matters as much as the outcome. **Please read this guide fully before opening a pull request.**

> **Important:** Opening an issue or a discussion before writing any code is not a suggestion — it is a requirement. A pull request submitted without a prior issue will be closed without review, regardless of its quality. This process exists to protect your time as much as the project's.

---

## Supported platforms

Unoff UI targets Figma, Framer, Penpot, and Sketch. **No platform is prioritised over another.** Contributions that improve coverage or parity across platforms are especially welcome.

---

## How to participate

### Reporting a bug

Open a [GitHub Issue](https://github.com/yelbolt/unoff-ui/issues/new) using the Bug report template. Include:

- A clear description of the problem
- Steps to reproduce it
- Expected vs. actual behaviour
- Environment details (platform, version, browser if relevant)

### Requesting a feature or improvement

Open a [GitHub Issue](https://github.com/yelbolt/unoff-ui/issues/new) using the Feature request template. Describe:

- The problem you are trying to solve
- Your proposed solution
- Any alternatives you have considered

### Asking a question or starting a casual conversation

Use [GitHub Discussions](https://github.com/yelbolt/unoff-ui/discussions) for questions, ideas, and open-ended topics that do not require an immediate action. Discussions are the right place to explore a need before it becomes an issue. Good examples of discussion topics include:

- Proposing the addition of a new platform theme (e.g., a new design tool or brand variant)
- Exploring a design direction before committing to an approach
- Sharing feedback or ideas that are not yet ready to become an actionable request
- Asking for guidance on how to contribute effectively

> **In short:** Issues for bugs, requests, and questions with a defined scope. Discussions for everything else — including theme proposals.

---

## The contribution workflow

```
Discussion (encouraged — explore the idea with the community)
    ↓
Issue (required — defines the problem or need clearly)
    ↓
Fork + Branch
    ↓
Pull Request (must reference the issue — no exceptions)
```

This flow is not bureaucracy. It ensures that work is needed, scoped, and aligned with the project before anyone spends time on it.

### Step 1 — Open a discussion or an issue first

**Do not start coding before the community has had a chance to weigh in.**

If your idea is exploratory or you are unsure whether it fits the project, open a [Discussion](https://github.com/yelbolt/unoff-ui/discussions) first. Once there is alignment, convert or follow up with a proper issue.

If the need is clear and well-defined — a bug, a missing feature, a concrete request — open an [Issue](https://github.com/yelbolt/unoff-ui/issues/new) directly.

**Every pull request must be linked to an open issue.** Pull requests submitted without a corresponding issue will be closed without review, no matter the quality of the code.

Wait for the issue to be acknowledged or assigned before investing significant effort into implementation. This protects your time.

### Step 2 — Fork the repository

Fork [yelbolt/unoff-ui](https://github.com/yelbolt/unoff-ui) to your own GitHub account. You may also fork the repository to run experiments, test ideas, or prototype solutions — this is encouraged. Forks are a safe space to iterate freely.

```bash
git clone https://github.com/<your-username>/unoff-ui.git
cd unoff-ui
npm install
```

### Step 3 — Create a branch

Use a descriptive branch name:

```bash
git checkout -b fix/button-hover-figma
git checkout -b feat/penpot-select-tokens
```

### Step 4 — Make your changes

Refer to [CLAUDE.md](./CLAUDE.md) for project conventions, SCSS token guidelines, component structure, and available scripts. Key points:

- Components use `React.Component` (class-based) — do not introduce function components or hooks.
- All visual values must come from CSS custom properties — no hardcoded colours or spacing.
- Use path aliases (`@components/`, `@styles/`, `@tps/`) — never relative cross-directory imports.
- Every component needs a Storybook story with a `play` function.

Run the relevant checks before pushing:

```bash
npm run lint          # TypeScript / TSX linting
npm run lint:css      # SCSS linting
npm run format        # Prettier check
npm run test:storybook # Interaction tests
npm run build         # Full build check
```

### Step 5 — Open a pull request

When opening a pull request:

1. Reference the issue it resolves: `Closes #<issue-number>`
2. Describe what changed and why
3. Note any platform-specific implications (Figma / Framer / Penpot / Sketch)
4. Confirm that all checks pass

> Pull requests that are not linked to an issue will be closed without review. This is a firm rule, not a guideline.

---

## What to expect

- A maintainer will review your pull request and may request changes or ask clarifying questions.
- Reviews are collaborative. Feedback is not personal.
- Larger changes may require more discussion before being merged.

---

## Not sure where to start?

When in doubt, open a [Discussion](https://github.com/yelbolt/unoff-ui/discussions). It is always the safest first step — especially for ideas like adding support for a new theme or platform. We would rather have one extra conversation than see effort go in the wrong direction.

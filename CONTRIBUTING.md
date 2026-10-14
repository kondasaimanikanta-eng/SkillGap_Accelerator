# Contributing to SkillGap to Action

Thank you for your interest in contributing to **SkillGap to Action**!

## Development Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Run tests locally to ensure existing test suites pass:
   ```bash
   npm test
   npm run test:e2e
   ```
4. Verify frontend build integrity:
   ```bash
   npm run build:frontend
   ```

## Code Quality Standards

- Maintain clean separation of concerns (Models, Controllers, Middleware, Routes, Utilities).
- Write comprehensive unit and integration tests under `tests/unit/` and `tests/integration/`.
- Ensure all read queries leverage `.lean()` for high throughput and memory efficiency.
- Follow defensive programming standards and enforce sanitization on user-supplied inputs.
- Ensure all responsive components maintain WCAG AA accessibility standards.

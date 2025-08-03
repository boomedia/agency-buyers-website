# AI Assistant Instructions

This file contains specific instructions for AI assistants working on this project.

## Package Manager
**CRITICAL: Always use `pnpm`, never `npm` or `yarn`**
- Always use `pnpm` for list functions or other terminal /package information commands

## Payload CMS Guidelines
- After modifying collection configs, run `pnpm run generate:types`
- Collection slugs are defined in each collection's `slug` property
- Use collection slugs in `relationTo` fields exactly as defined

## Project Context
- Real estate website with property management
- Payload CMS for content management
- TypeScript throughout
- Modern Next.js architecture

## Available Collections

See `.github/DEVELOPMENT.md` for full list and details.

## Git Commit Guidelines

**Follow Conventional Commits specification:**

- Format: `<type>[optional scope]: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Examples:
  - `feat(properties): add zone data validation`
  - `fix(auth): resolve login redirect issue`
  - `docs: update API documentation`
  - `chore(deps): update payload cms to v3.49.0`

## Coding Standards

- Follow existing patterns in the codebase
- Use TypeScript strictly
- Maintain consistency with Payload CMS conventions

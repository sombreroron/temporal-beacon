# Contributing to Temporal Beacon

Thank you for your interest in contributing to Temporal Beacon! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/sombreroron/temporal-beacon.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- kubectl configured with access to a Kubernetes cluster (for testing)

### Installation

```bash
npm install
```

### Building

```bash
npm run build
```

This command will:
1. Build the TypeScript library
2. Build the React client interface

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Linting

```bash
npm run lint
```

### Development Mode

```bash
npm run dev
```

## Project Structure

```
temporal-beacon/
├── src/
│   ├── client/          # React UI components
│   ├── nodes/           # Node abstraction layer
│   ├── index.ts         # Main CLI entry point
│   ├── kubectl-proxy-manager.ts
│   ├── service-discovery.ts
│   └── temporal-registry-manager.ts
├── dist/                # Built output
├── index.html           # Client HTML template
└── tests/              # Test files
```

## Code Style

- We use ESLint for code linting
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing Guidelines

- Write tests for new features
- Maintain or improve code coverage
- Tests should be clear and descriptive
- Use meaningful test names

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md following the existing format
3. Ensure all tests pass and code is linted
4. The PR will be merged once you have the sign-off of a maintainer

## Commit Message Guidelines

We follow conventional commits:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that don't affect code meaning (formatting, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example:
```
feat: add support for filtering by namespace
```

## Reporting Bugs

When reporting bugs, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Environment details (Node.js version, OS, etc.)
6. Any relevant logs or error messages

## Feature Requests

We welcome feature requests! Please provide:

1. A clear description of the feature
2. Use cases for the feature
3. Any relevant examples or mockups

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

## Questions?

If you have questions, feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


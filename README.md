# Temporal Beacon 🔦

[![npm version](https://badge.fury.io/js/temporal-beacon.svg)](https://badge.fury.io/js/temporal-beacon)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://github.com/sombreroron/temporal-beacon/actions/workflows/ci.yml/badge.svg)](https://github.com/sombreroron/temporal-beacon/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/sombreroron/temporal-beacon/branch/main/graph/badge.svg)](https://codecov.io/gh/sombreroron/temporal-beacon)

A powerful discovery and visualization tool for Temporal workflows and activities in Kubernetes environments.

## Features

- 🔍 **Automatic Discovery**: Scans Kubernetes services to find Temporal workflow registries
- 📊 **Visual Interface**: Beautiful Material-UI based visualization of workflows and activities
- 🔗 **Dependency Tracking**: Shows relationships between workflows and activities
- 🎯 **Usage Analysis**: Identifies where activities are used across workflows
- 🚀 **Easy to Use**: Single command to discover and visualize

## Installation

```bash
npm install -g temporal-beacon
```

## Usage

Run the beacon command from your terminal:

```bash
beacon
```

This will:
1. Start a kubectl proxy to access your Kubernetes cluster
2. Discover all Temporal workflow registries in your cluster
3. Generate workflow and activity data
4. Launch a web interface at `http://localhost:7237`

## Requirements

- Node.js >= 18.0.0
- Access to a Kubernetes cluster with `kubectl` configured
- Temporal services running in your cluster with registry endpoints

## Development

### Building

```bash
npm run build
```

This builds both the library and the client interface.

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Development Mode

```bash
npm run dev
```

## Architecture

Temporal Beacon consists of:

- **Service Discovery**: Scans Kubernetes namespaces for Temporal registry endpoints
- **Registry Manager**: Aggregates and processes workflow/activity data
- **Web UI**: React-based interface for visualization
- **CLI**: Command-line tool that orchestrates everything

## Configuration

Temporal Beacon automatically ignores common system namespaces:
- kube-system
- kube-public
- ingress-nginx
- cert-manager
- And more...

## Screenshots

<!-- Add screenshots here when available -->

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

MIT - see [LICENSE](LICENSE) for details

## Support

- 📖 [Documentation](https://github.com/sombreroron/temporal-beacon#readme)
- 🐛 [Issue Tracker](https://github.com/sombreroron/temporal-beacon/issues)
- 💬 [Discussions](https://github.com/sombreroron/temporal-beacon/discussions)

## Acknowledgments

Built with ❤️ for the Temporal community


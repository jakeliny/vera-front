# V.E.R.A — Value Effective Revenue Analyzed

V.E.R.A is an acronym for **Value Effective Revenue Analyzed**, a service that processes income and work time of a professional to support credit analysis. The application was developed with a componentized and data-oriented approach, designed to be performant and easy to maintain.

## Technology Stack

- **React** - JavaScript library for creating user interfaces
- **TypeScript** - Static typing to improve development experience
- **Vite** - Fast build tool for development
- **Tailwind CSS** - CSS library for styling
- **Shadcn/ui** - Component library based on Radix UI
- **pnpm** - Fast and efficient package manager
- **SWR** - Data fetching with cache and revalidation
- **React Router** - Route management
- **Tanstack Table** - Table with sorting and pagination
- **React Hook Form + Zod** - Forms with validation
- **Cypress** - End-to-end testing

## Project Architecture

The project follows a clean architecture, following separation of concerns principles, ensuring that business logic `hooks`, data layer `api`, and presentation `components` are decoupled.

```
src/
├── api/           # API layer
├── components/    # UI components
├── hooks/         # Custom hooks
├── lib/           # Utility functions and configurations
├── pages/         # Route components
└── types/         # TypeScript type definitions
```

### Main Features

- **Filters**: Search with debounce and multiple criteria
- **Column Sorting**: All columns with asc/desc sort
- **Responsive Design**: Mobile-first approach with breakpoints
- **Data Validation**: Client-side validation with Zod schemas
- **Updates and Cache**: SWR cache management for real-time updates
- **View-Only Mode**: Support for mock data to view UI without backend
- **End-to-End Tests**: Test coverage with Cypress

## Setup and Installation

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env_example .env

# Initialize the application
pnpm dev
```

## View-Only Mode (Mock)

The application supports view-only mode for data visualization without backend, controlled by the `VITE_VIEW_ONLY` environment variable.

- `VITE_VIEW_ONLY=true`: Displays mock data.

- `VITE_VIEW_ONLY=false`: Displays real data.

### Behavior in View-Only Mode

- **Data Display**: The table shows 10 records (mock)
- **Interactive Elements**: Buttons and forms remain functional
- **No API Calls**: Requests return mock with realistic delays
- **Form Interactions**: You can type and submit, with success messages
- **Static Detail**: Detail pages always show the same record (mock)
- **Filters**: You can type in filters, but there is no real filtering

## Main Scripts

| Script              | Description                                |
| :------------------ | :----------------------------------------- |
| `pnpm dev`          | Starts the application in development mode |
| `pnpm build`        | Generates the production build             |
| `pnpm preview`      | Serves the production build locally        |
| `pnpm lint`         | Runs code linting                          |
| `pnpm cypress:open` | Runs the Cypress Test Runner               |
| `pnpm cypress:run`  | Runs Cypress in headless mode              |

## Tests

For development and debug:

```bash
pnpm cypress:open
```

For CI/CD and automation:

```bash
pnpm cypress:run
```

## Work Pattern

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Make sure all tests pass
5. Send a pull request

## License

This project is licensed under the MIT License.

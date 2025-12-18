# Retirement Tax Plan

## Mission
The **Retirement Tax Plan** application is designed to help retired individuals, and those planning for retirement, visualize and understand the complex tax implications of their withdrawal strategies.

Specifically, it addresses the **"Stacking"** of different income types—Ordinary Income vs. Long-Term Capital Gains—and how they interact with the unique taxability rules of Social Security.

The goal is to provide a clear, instant feedback loop on how increasing withdrawals from one source (e.g., an IRA) affects the marginal tax rate of another source (e.g., Social Security or Capital Gains), empowering users to make tax-efficient decisions.

> **Note**: This tool currently supports **Federal Tax** calculations for the years **2025** and **2026**.

## Features

-   **Multi-Year Support**: Toggle between **2025** (current law) and **2026** (projected post-TCJA expirations).
-   **Income Stacking Visualization**: See exactly how Ordinary Income, Capital Gains, and Social Security stack up in the tax brackets.
-   **Social Security Optimization**: Interactive dashboard showing the "Tax Torpedo" effect—where $1 of income can cause $1.85 of taxable income.
-   **Real-time Calculation**: Instant updates as you modify income streams or filing status.
-   **Privacy Focused**: All calculations happen client-side. No data is stored or transmitted.

## Architecture

This project is architected using **Feature-Sliced Design (FSD)**, a methodology that organizes code by business domain rather than technical function. This ensures scalability and maintainability as the application grows.

### Directory Structure (`src/`)

*   **`app/`**: Next.js App Router configuration, pages, and global layouts.
*   **`widgets/`**: Large, self-contained UI blocks that combine multiple features.
    *   `tax-summary`: The main results dashboard.
    *   `optimization-dashboard`: The interactive charts and insights.
*   **`features/`**: User interactions and forms.
    *   `tax-form`: Components for inputting personal details and income streams.
*   **`entities/`**: The core business logic and data models.
    *   `tax`:
        *   `model`: Global state definitions (Zustand store).
        *   `lib`: Pure calculation engines (`taxEngine.ts`) and unit tests.
        *   `config`: Tax brackets and rules (`tax_config.json`).
*   **`shared/`**: Reusable primitives and UI components.
    *   `ui`: Generic components like `NumberInput`, `Tooltip`, etc.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Run Tests**:
    ```bash
    npm test
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Documentation

Detailed documentation on the tax math used in this project can be found in the `docs/` directory:

*   [Federal Tax 2025 Logic](docs/federal_tax_2025.md)
*   [Federal Tax 2026 Logic](docs/federal_tax_2026.md)

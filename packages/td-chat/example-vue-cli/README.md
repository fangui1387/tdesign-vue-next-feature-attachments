# TDesign Chat Vue 2.7 Example

This project demonstrates the usage of `td-chat` (Vue 2.7 compatible) in a Vue CLI / Vite environment.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Verification Script

To verify the installation and functionality:

1. Ensure `packages/td-chat` is built:
   ```bash
   cd ../
   npm install
   npm run build
   ```

2. Run the example:
   ```bash
   cd example-vue-cli
   npm install
   npm run dev
   ```

3. Open the browser (usually http://localhost:5173) and check:
   - Chat interface is rendered.
   - Sending a message works (echo response).
   - "Clear" button clears history.
   - Layout matches TDesign Chat specifications.

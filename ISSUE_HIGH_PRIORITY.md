## Issue: Stabilize New Pricing, Calculation, and Classes Features

### Summary
Recent changes introduced new dashboards and backend endpoints for prices, financial calculations, and classes. During review we found three high-severity regressions that blocked those experiences. This issue tracks the fixes so they can be referenced during deployment planning.

### Tasks
- [x] Update `requireRole` usage in prices and calculations routes to pass role strings individually (`backend/src/routes/prices.ts`, `backend/src/routes/calculations.ts`).
- [x] Normalise teacher pagination metadata on the frontend so that `pageSize` is derived from the API's `limit` response (`frontend/app/dashboard/teachers/page.tsx`).
- [x] Align the classes API contract with the new Prisma schema by updating validation, shared types, and service logic to handle `defaultEntryTime`, `defaultExitTime`, and `active` (`backend/src/utils/validation.ts`, `backend/src/types/index.ts`, `backend/src/services/academicService.ts`).

### Notes
- After these fixes, price/calculation endpoints honour role checks correctly, teacher pagination renders without `NaN`, and class CRUD accepts the new schedule fields.
- If further adjustments are needed (e.g., updating occupancy calculations or adding UI validation for time ranges), open follow-up tasks referencing this issue.

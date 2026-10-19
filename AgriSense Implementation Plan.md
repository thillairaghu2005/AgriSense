# Indian Farmers Web Application --- Full Implementation Plan

## 1. Project Overview

**Project type:** Frontend-only web application prototype\
**Working name:** Indian Farmers Digital Assistant\
**Primary goal:** Build a responsive, multilingual agricultural platform
that helps Indian farmers explore crop guidance, weather information,
market prices, government schemes, soil information, farming costs, and
educational resources.

### 1.1 Technology stack

-   **Frontend framework:** React
-   **Language:** TypeScript
-   **Build tool:** Vite
-   **Styling:** Tailwind CSS
-   **Routing:** React Router
-   **Icons:** Lucide React
-   **Charts:** Recharts
-   **Forms and validation:** React Hook Form and Zod, if form
    complexity justifies the dependencies
-   **State:** React state and context; use a small state library only
    if the app grows enough to need it
-   **Persistence:** Browser `localStorage` for demo preferences and
    locally entered records
-   **Testing:** Vitest and React Testing Library; Playwright for
    optional end-to-end tests

### 1.2 Non-goals and prototype boundaries

This implementation is a **frontend prototype**. It must not include a
backend, database, API server, server-side authentication, or a real
machine-learning pipeline.

-   Use realistic, clearly labelled mock data.
-   Simulate assistant responses and disease-detection results.
-   Never represent sample weather or market prices as live data.
-   Never claim that an uploaded photo measures soil nutrients or proves
    a disease.
-   Keep the code structured so real services can be added later without
    pretending they already exist.
-   Scheme information and eligibility must be described as guidance,
    not official approval.

------------------------------------------------------------------------

## 2. Product Goals and Success Criteria

The finished application should:

1.  Let a farmer navigate every major module from desktop, tablet, and
    mobile layouts.
2.  Make the most important information understandable without technical
    knowledge.
3.  Support a language selector and a maintainable translation
    dictionary.
4.  Use the selected state and district to personalise sample content.
5.  Provide meaningful interactions for every visible control.
6.  Persist appropriate demo preferences and records locally.
7.  Distinguish actual user-entered/laboratory values from illustrative
    estimates.
8.  Include loading, empty, error, validation, and success states.
9.  Maintain accessible keyboard navigation, focus indicators, and
    readable contrast.
10. Build successfully with documented commands and no TypeScript
    errors.

------------------------------------------------------------------------

## 3. Scope and Feature Priorities

### P0 --- Foundation and core navigation

-   Responsive application shell
-   Dashboard
-   Global search
-   Language selector
-   State and district selectors
-   Profile and settings
-   Reusable UI components
-   Mock data and local persistence
-   Responsive and accessible design tokens

### P1 --- Essential farming modules

-   Crop catalogue and crop details
-   Crop recommendation prototype
-   Weather and rainfall dashboard
-   Market prices
-   Government schemes directory
-   Farming calendar and reminders
-   Farming cost and profit calculator
-   Knowledge centre
-   Notifications

### P2 --- Extended prototype modules

-   Soil profile and soil-test report interface
-   Pest and disease library
-   Simulated crop-image assessment flow
-   Simulated farming assistant
-   Expense and income tracking
-   Sample soil report visualisations
-   Low-internet experience for previously viewed content

### P3 --- Optional enhancements

-   Crop-yield estimate interface with explicit assumptions
-   More complete regional translation coverage
-   Voice input and text-to-speech exploration
-   Progressive Web App (PWA) caching, after verifying the chosen data
    and offline strategy
-   Automated end-to-end tests

**Implementation rule:** Complete and test each phase before expanding
scope. Do not implement simulated advanced features at the expense of
reliable navigation and core usability.

------------------------------------------------------------------------

## 4. User Roles and Main Journeys

The prototype has no server-backed accounts. It can still provide a
local demo profile.

### 4.1 Main user journey

1.  Open the dashboard.
2.  Select a preferred language, state, and district.
3.  Review the localised sample weather, crop reminders, and market
    highlights.
4.  Open crop management or crop recommendations.
5.  Enter available land, soil information, and growing season.
6.  Review the top three illustrative crop recommendations and their
    assumptions.
7.  Compare sample market prices and estimate potential revenue.
8.  Review relevant government schemes and their checklists.
9.  Save a farm activity, expense, reminder, or preference locally.

### 4.2 Secondary journeys

-   Browse crop-specific pest and disease information.
-   Use the farming assistant prototype to ask a question.
-   Enter soil-test results or preview a report upload.
-   Calculate cultivation cost and potential profit.
-   Read a seasonal guide.
-   Review and dismiss mock notifications.
-   Change language, region, farm size, and accessibility preferences.

------------------------------------------------------------------------

## 5. Information Architecture and Routes

Use React Router with dedicated pages. Suggested routes:

  -----------------------------------------------------------------------
  Route                   Page                    Main purpose
  ----------------------- ----------------------- -----------------------
  `/`                     Dashboard               Personalised overview
                                                  and shortcuts

  `/crops`                Crop catalogue          Search and filter crops

  `/crops/:cropId`        Crop details            Growth stages, sowing,
                                                  irrigation, and
                                                  guidance

  `/recommendations`      Crop recommendations    Top-three mock
                                                  recommendations based
                                                  on form inputs

  `/calendar`             Farming calendar        Sowing, irrigation,
                                                  fertiliser, and harvest
                                                  tasks

  `/market-prices`        Market prices           Crop, region, market,
                                                  and date filters

  `/weather`              Weather                 Sample current
                                                  conditions and
                                                  seven-day forecast

  `/assistant`            Farming assistant       Simulated
                                                  conversational Q&A

  `/schemes`              Government schemes      Search, filter,
                                                  details, and checklist

  `/pests-diseases`       Pest and disease        Symptoms and prevention
                          library                 guidance

  `/soil`                 Fertiliser and soil     Soil profile, nutrient
                                                  explanations, and
                                                  report interface

  `/farm-finances`        Expenses and income     Transactions and
                                                  cost/profit summaries

  `/knowledge`            Knowledge centre        Articles and seasonal
                                                  guides

  `/notifications`        Notifications           Alerts and reminders

  `/profile`              Profile and settings    Local demo profile,
                                                  language, region, and
                                                  preferences

  `*`                     Not found               Friendly recovery route
  -----------------------------------------------------------------------

Route names can be adjusted during implementation, but each module
should have one clear route and consistent navigation labels.

------------------------------------------------------------------------

## 6. Application Shell and Navigation

### 6.1 Desktop

-   Fixed or sticky left sidebar with clear active-route styling.
-   Top bar with page title or breadcrumbs, global search, language
    selector, notification access, and profile menu.
-   Main content area with a readable maximum width and consistent
    spacing.
-   Sidebar grouping for Overview, Farm Management, Discover, and
    Settings.

### 6.2 Mobile

-   Compact top bar.
-   Sidebar becomes a drawer opened by an accessible menu button.
-   Use a compact bottom navigation for the most frequent destinations,
    such as Dashboard, Crops, Weather, Market, and More.
-   Keep forms single-column and buttons large enough to tap.
-   Tables should become cards or use deliberate horizontal scrolling
    with clear labels.

### 6.3 Global interactions

-   Navigation items change routes and indicate the active page.
-   Global search shows matching crops, schemes, articles, and pages
    from local mock data.
-   Language selection updates translated UI strings.
-   Region selection updates the selected state/district used by
    relevant mock-data views.
-   Notification access opens the notification page or a small
    notification panel.
-   Profile menu links to settings and provides a local demo-profile
    action.
-   All dialogs and menus support keyboard use, visible focus, and
    appropriate dismissal behaviour.

------------------------------------------------------------------------

## 7. Design System

### 7.1 Visual direction

-   Minimal, professional, agriculture-focused interface.
-   Neutral backgrounds, subtle borders, and one restrained primary
    accent.
-   Avoid gradients, multicolour decoration, excessive shadows,
    unnecessary animation, and generic admin-template styling.
-   Use whitespace and clear hierarchy instead of decorative effects.

### 7.2 Typography

-   Primary: Geist with appropriate weights for readable body text and
    headings.
-   Secondary/fallback: Inter and system sans-serif.
-   Use the lightest font weights only for large headings; normal body
    text must remain legible.
-   Verify regional-language glyph coverage and provide robust fallback
    fonts.

### 7.3 Design tokens

Define central tokens in Tailwind theme/CSS variables:

-   Primary accent and its hover/focus variants
-   Page background and surface backgrounds
-   Primary, secondary, and muted text
-   Border and divider colours
-   Success, warning, error, and information colours
-   Spacing scale, border radius, and shadow levels
-   Focus-ring style
-   Breakpoints and content-width conventions

Use semantic tokens rather than hard-coded colour values throughout
components.

### 7.4 Reusable UI components

Build and standardise these early:

-   `Button`
-   `IconButton`
-   `Input`
-   `Textarea`
-   `Select`
-   `SearchInput`
-   `Checkbox` and `RadioGroup`
-   `FormField` with label, hint, and error
-   `Card` and `StatCard`
-   `Badge` / status label
-   `Tabs`
-   `Modal` / `Dialog`
-   `DropdownMenu`
-   `Toast` / inline feedback
-   `Skeleton`
-   `EmptyState`
-   `ErrorState`
-   `PageHeader`
-   `FilterBar`
-   `DataTable` with a mobile alternative
-   `ChartContainer`
-   `ConfirmDialog`
-   `FileUploadPreview`

Use Lucide icons consistently and pair important icons with text labels.

------------------------------------------------------------------------

## 8. Suggested Project Structure

``` text
indian-farmers-app/
├── public/
│   ├── images/
│   └── locales/                 # Optional static translation assets
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── charts/
│   │   └── feedback/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── crops/
│   │   ├── recommendations/
│   │   ├── weather/
│   │   ├── market/
│   │   ├── assistant/
│   │   ├── schemes/
│   │   ├── pests-diseases/
│   │   ├── soil/
│   │   ├── calendar/
│   │   ├── finances/
│   │   ├── knowledge/
│   │   ├── notifications/
│   │   └── profile/
│   ├── data/
│   │   ├── crops.ts
│   │   ├── weather.ts
│   │   ├── marketPrices.ts
│   │   ├── schemes.ts
│   │   ├── pestsDiseases.ts
│   │   ├── articles.ts
│   │   ├── locations.ts
│   │   └── translations/
│   ├── hooks/
│   ├── lib/
│   │   ├── storage.ts
│   │   ├── formatters.ts
│   │   ├── validation.ts
│   │   └── recommendationRules.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── index.css
│   ├── test/
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
└── README.md
```

Keep feature-specific components near their feature. Move a component
into the shared UI folder only when it is genuinely reusable.

------------------------------------------------------------------------

## 9. Initial Project Setup

1.  Install a current supported Node.js LTS release.
2.  Create the Vite React TypeScript project.
3.  Install and configure Tailwind CSS using the setup appropriate to
    the selected Tailwind version.
4.  Install React Router, Lucide React, and Recharts.
5.  Add React Hook Form and Zod only if used for real form validation.
6.  Configure TypeScript strictness and linting.
7.  Add a global stylesheet, font loading strategy, design tokens, and
    base reset.
8.  Create the app provider, router, responsive shell, and not-found
    route.
9.  Confirm the project starts locally and builds before adding feature
    pages.

Example initial commands (adjust for the installed package versions):

``` bash
npm create vite@latest indian-farmers-app -- --template react-ts
cd indian-farmers-app
npm install
npm install react-router-dom lucide-react recharts
npm install react-hook-form zod @hookform/resolvers
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

Tailwind configuration differs by major version. Follow the installed
version's official setup rather than mixing configuration steps from
different versions.

------------------------------------------------------------------------

## 10. Shared Data Types and Local Persistence

### 10.1 Core TypeScript models

Define shared types before implementing the feature pages. Suggested
models:

-   `FarmerProfile`: display name, preferred language, state, district,
    village (optional), land area, area unit, soil type, and
    accessibility preferences.
-   `Crop`: ID, name, local names, seasons, duration, water needs, soil
    suitability, growth stages, and general guidance.
-   `CropRecommendationInput`: state, district, land area, season, soil
    type, pH, N, P, K, rainfall, and temperature.
-   `CropRecommendation`: crop ID, illustrative suitability score or
    reason list, estimated duration, water needs, and assumptions.
-   `WeatherDay`: date label, minimum/maximum temperature, humidity,
    wind speed, rain probability, and expected rainfall.
-   `MarketPrice`: crop, state, district, market/APMC, date, unit,
    minimum price, maximum price, modal price, and source label.
-   `Scheme`: name, level, state applicability, eligibility summary,
    benefits, documents, application steps, official URL, and
    last-verified date.
-   `FarmTask`: title, crop ID, task type, due date, status, and notes.
-   `Transaction`: type, category, amount, date, crop ID, and notes.
-   `SoilTest`: test date, soil type, pH, N, P, K, source (laboratory or
    sample), and notes.
-   `Notification`: type, title, message, date, read status, and
    optional destination route.
-   `Article`: title, category, reading time, season, summary, and body.

Keep IDs stable so local records and route parameters remain consistent.

### 10.2 Local-storage rules

-   Centralise persistence in `lib/storage.ts`; do not call
    `localStorage` directly throughout the app.
-   Use versioned keys, for example `farmer-app:v1:profile`.
-   Validate parsed data and handle malformed or outdated values safely.
-   Catch storage access failures and continue with in-memory state.
-   Persist only appropriate demo data: preferences, profile, saved
    tasks, transactions, and notification read states.
-   Do not store secrets or sensitive documents.
-   Provide a reset-demo-data action with confirmation.
-   Explain in the UI that local records are stored only in the current
    browser and are not synced to a server.

------------------------------------------------------------------------

## 11. Detailed Module Implementation Plan

### 11.1 Dashboard

**Purpose:** Give the farmer a concise, useful overview.

Components: - Greeting and selected region - Weather preview with
sample-data label - Crop summary and growth-stage cards - Market-price
highlights - Upcoming farm tasks - Government scheme highlights -
Seasonal guidance - Quick actions

Interactions: - Change region. - Navigate from cards to the relevant
module. - Mark a task complete. - Open a weather or market detail. -
Dismiss a dashboard notice where appropriate.

Acceptance: - The dashboard adapts to the saved profile and selected
region. - Each card has a clear destination or action. - Sample data is
labelled wherever it could be mistaken for live data.

### 11.2 Crop Management

Pages: - Searchable crop catalogue - Crop detail page - Growth-stage and
activity timeline - Sowing and harvesting guidance - Irrigation and
fertiliser task entry

Interactions: - Search and filter by season, category, duration, and
region. - Open crop details. - Add a crop to the local farm plan. -
Create or complete a crop task. - Show an empty state when filters match
nothing.

Acceptance: - Crop details use a consistent data model. - Guidance is
described as general guidance and can vary by region and conditions.

### 11.3 Crop Prediction and Recommendation Prototype

Inputs: - State and district - Land area and unit - Season: Kharif,
Rabi, or other relevant season - Soil type - Soil pH - Nitrogen,
phosphorus, and potassium values when available - Rainfall and
temperature assumptions

Implementation: 1. Validate required fields and numeric ranges. 2. Keep
a small, transparent rules-based sample dataset. 3. Compare inputs with
illustrative crop suitability ranges. 4. Return up to three
recommendations with a plain-language explanation. 5. Show duration,
water needs, cultivation notes, and missing-data warnings. 6. Allow a
recommendation to be saved to the local farm plan.

Important: - Call this a **demo recommendation**, not a validated
prediction model. - Do not invent scientific precision or present a
score as an agricultural guarantee. - Explain which values are missing
and which assumptions were used. - Recommend local agricultural
extension expertise for high-impact decisions.

Acceptance: - Invalid values are rejected with helpful field messages. -
Recommendations can be reproduced from the same inputs. - No backend or
ML model is implied.

### 11.4 Weather and Rainfall

Display: - Sample current temperature, humidity, and wind speed -
Seven-day sample forecast - Rain probability and expected rainfall -
Heavy rain, heat, or wind alert examples - Farming advice cards

Interactions: - Switch selected region. - Select a forecast day. - Open
an alert detail. - Show the sample data's last-updated label.

Important: - Use labels such as "Illustrative forecast --- not live
weather." - Advice must be cautious and conditional; do not tell users
to spray chemicals or apply fertiliser solely from fabricated weather
data. - Real warning data requires a reliable provider and is out of
scope for this frontend-only build.

Acceptance: - The UI distinguishes forecast examples from real alerts. -
Empty/error states are designed for future data-provider integration.

### 11.5 Market Prices

Display: - Searchable crop prices - State, district, market/APMC, crop,
and date filters - Minimum, maximum, and modal prices - Price comparison
chart - Historical sample chart - Revenue estimator - Separate MSP
information panel if sample values are included

Interactions: - Change filters and update the displayed local dataset. -
Sort table columns. - Compare selected markets. - Change chart period. -
Estimate gross revenue from quantity × selected price. - Reset filters.

Important: - Every sample price must include market, date, unit, and an
"Illustrative sample data" label. - MSP announcements must not be
conflated with actual mandi transactions. - Do not claim current or live
prices.

Acceptance: - Filters, sorting, and calculator work with local data. -
Charts have units, labels, and accessible summaries.

### 11.6 Farming Assistant UI

Interface: - Conversation history - Text input and send button -
Suggested questions - Answer cards with topic tags - Clear conversation
action - Optional simulated typing/loading state

Implementation: - Use a small local set of prompt-to-response examples
and safe fallback responses. - Clearly label the feature as a simulated
assistant prototype. - Do not claim access to a live AI model. - Do not
claim certainty for disease, chemical, or crop-management advice. - For
potentially harmful or uncertain cases, encourage verification with a
qualified local agriculture professional.

Acceptance: - Sending a message produces a visible response. - Empty
messages are not submitted. - Clear-history and suggested-question
controls work. - The interface is usable with a keyboard and screen
reader.

### 11.7 Government Schemes

Features: - Search by scheme name and description - Filters for
central/state scope, state, scheme category, and relevant farmer
criteria - Scheme detail view - Eligibility summary - Benefits -
Required documents - Application steps - Official website link -
Personal checklist - Last-verified date

Important: - Use only verified official URLs when preparing the final
content. - If a scheme detail has not been verified, mark it as a sample
or needing verification. - Show "Potentially relevant" rather than
"Eligible" or "Approved." - Do not invent deadlines or guarantee
benefits.

Acceptance: - Search and filters work. - Checklist items can be checked
locally. - External links are clearly identified and open safely.

### 11.8 Pest and Disease Library

Features: - Search by crop and symptom - Pest/disease detail pages or
dialogs - Symptoms, likely causes, prevention, and general management
guidance - Image upload preview - Example simulated result

Important: - Uploading a photo does not run a real prediction model. - A
simulated result must be labelled as illustrative. - Do not claim a
disease is confirmed from an image. - Use crop-specific, cautious
guidance and recommend expert verification for uncertain cases. - Do not
prescribe pesticide dosage without authoritative, crop-specific support.

Acceptance: - Upload selection and preview work. - The user can clear or
replace the preview. - A demo result is visibly distinguished from a
real diagnosis.

### 11.9 Soil, Fertiliser, and Soil-Test Reports

Features: - Soil-type reference cards - Explanations of pH, nitrogen,
phosphorus, and potassium - Sample soil-test chart or report - Form for
entering lab results - Soil-report upload preview - General
soil-improvement suggestions

Important: - Clearly distinguish laboratory-entered results from
illustrative estimates. - Do not claim to infer pH or NPK values from a
photo alone. - Fertiliser recommendations should be presented as general
guidance that depends on crop, soil test, and local expert advice.

Acceptance: - Lab values can be entered, edited, and saved locally. -
Sample report values are labelled. - Missing values are not silently
replaced with fabricated measurements.

### 11.10 Farming Calendar and Irrigation

Features: - Calendar/list views of farm tasks - Crop-specific task
templates - Sowing, irrigation, fertiliser, field maintenance, and
harvest reminders - Task creation/editing/completion - Filter by crop
and status

Interactions: - Add, edit, complete, and delete tasks. - Filter by date
range, crop, or status. - Show upcoming and overdue tasks. - Persist
tasks locally.

Important: - Clearly identify generated schedules as templates. - Let
the farmer adjust dates and task details. - Avoid presenting one fixed
irrigation schedule as appropriate for every field.

Acceptance: - CRUD operations work locally. - Date and required-field
validation is present. - Completed tasks are visually distinguishable
without relying on colour alone.

### 11.11 Farm Expenses, Income, and Profit Calculator

Features: - Expense and income transaction forms - Categories for seed,
fertiliser, labour, irrigation, equipment, transport, and sales -
Crop-wise summaries - Monthly summary charts - Cultivation cost
calculator - Potential revenue and profit estimate

Calculation: - `total cost = sum of selected cultivation expenses` -
`estimated revenue = assumed yield × area × selected market price`, with
compatible units - `estimated profit = estimated revenue − total cost`

Interactions: - Add, edit, and delete a transaction. - Filter by crop
and period. - Change calculation assumptions. - Show a breakdown of
costs and revenue.

Important: - State yield and price assumptions clearly. - Check unit
conversions before calculating. - Label outputs as estimates, not
guaranteed income. - Keep all demo financial records in local browser
storage.

Acceptance: - Totals recalculate when inputs change. - Currency uses
Indian rupee formatting. - Empty and zero-value cases are handled
safely.

### 11.12 Knowledge Centre

Features: - Article catalogue - Search and category filters - Seasonal
guides and best-practice articles - Article detail view - Reading-time
label - Related content

Interactions: - Search and filter articles. - Open and navigate article
details. - Save/bookmark an article locally if implemented.

Acceptance: - Content is readable on small screens. - Articles have
clear headings, summaries, and source/verification labels where needed.

### 11.13 Notifications

Notification categories: - Weather examples - Market-price updates -
Crop reminders - Scheme announcements

Interactions: - Mark one/all as read. - Filter by category or read
state. - Navigate to a related page. - Dismiss a notification. - Persist
read/dismissed state locally.

Important: - Do not imply that mock notifications were generated from
live events.

### 11.14 Profile and Settings

Fields: - Display name for the local demo - State, district, and
optional village - Preferred language - Land area and unit - Soil type -
Accessibility preferences - Display preferences - Reset demo data

Interactions: - Edit and save profile. - Change language and region. -
Toggle supported interface preferences. - Reset local data with
confirmation.

Acceptance: - Changes persist locally. - Missing profile information is
handled gracefully. - Reset clearly explains what will be cleared.

### 11.15 Multilingual Interface

Start with English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi,
Bengali, Gujarati, and Punjabi. Add other major Indian languages through
the same dictionary structure.

Implementation: - Use stable translation keys, not translated text as
identifiers. - Store dictionaries in separate files by locale. - Provide
a fallback to English for missing keys. - Persist the selected language
locally. - Format dates and numbers with `Intl` where appropriate. -
Test longer translated strings, line wrapping, buttons, navigation, and
mobile layouts. - Verify that the selected font stack supports the
scripts. - Keep crop names and official scheme names accurate;
translations may include the original name where clarity matters.

Acceptance: - The selector changes all translated interface strings
covered by the dictionaries. - Missing translations do not break the
UI. - The language can be changed without reloading the application.

------------------------------------------------------------------------

## 12. Mock Data Strategy

Create small but realistic datasets before building charts and tables.

Recommended initial sample coverage: - Several crops, including
paddy/rice, groundnut, cotton, maize, millets, pulses, sugarcane, and
vegetables. - Example regions from multiple states, with Tamil Nadu as
one regional example. - Multiple markets/APMCs per selected region. -
Seven sample weather days per region. - Several central and state scheme
entries. - Crop-specific pest and disease reference records. - Sample
articles and seasonal guides. - Example tasks and transactions.

Data rules: - Use stable IDs. - Include units and dates where
applicable. - Include source and verification metadata where needed. -
Mark all illustrative prices, forecasts, recommendations, and prediction
outputs. - Keep datasets in `src/data/`; do not hard-code large arrays
inside page components. - Avoid representing the mock dataset as
exhaustive coverage of all Indian regions.

------------------------------------------------------------------------

## 13. State Management and Interaction Patterns

Use the simplest state solution that meets the requirements:

-   Component state for local UI behaviour.
-   Context/provider for shared profile, language, and region.
-   Feature-level state for filters, forms, tabs, dialogs, and chart
    periods.
-   Local storage for persistent demo preferences and records.
-   Derived values for totals, filtered lists, and charts; do not store
    duplicate derived state unless necessary.

Create reusable hooks where they remove repeated logic, for example: -
`useLocalStorage` - `useFarmerProfile` - `useLanguage` - `useRegion` -
`useNotifications` - `useFarmTasks` - `useTransactions`

All interactive controls should provide feedback and a clear outcome.
Avoid buttons that appear functional but do nothing.

------------------------------------------------------------------------

## 14. Accessibility, Responsiveness, and Performance

### Accessibility

-   Use semantic HTML landmarks and heading hierarchy.
-   Associate every form control with a label.
-   Provide accessible names for icon-only buttons.
-   Keep keyboard focus visible.
-   Support keyboard operation and sensible focus management in dialogs
    and menus.
-   Do not use colour alone to convey status.
-   Maintain readable contrast and scalable text.
-   Provide useful alternative text for meaningful images.
-   Respect reduced-motion preferences.

### Responsive design

Test at minimum: - Small mobile: approximately 320--375 px - Typical
mobile: approximately 390--430 px - Tablet: approximately 768 px -
Laptop: approximately 1280 px - Wide desktop: approximately 1440 px and
above

Check: - No horizontal overflow - Sidebar/drawer behaviour - Forms and
tables - Charts and legends - Long translations - Dialog height and
scrolling - Tap target size

### Performance

-   Avoid unnecessary dependencies and repeated component
    implementations.
-   Lazy-load page routes where useful.
-   Keep chart data sets small for the prototype.
-   Avoid heavy animation and oversized imagery.
-   Use stable keys in React lists.
-   Avoid recalculating large derived datasets on every render when
    memoisation is warranted.

------------------------------------------------------------------------

## 15. Testing Plan

### Unit and component tests

Test: - Local-storage parsing, validation, and fallback behaviour - Crop
recommendation rules and input validation - Revenue/profit calculations
and unit assumptions - Search and filtering helpers - Translation
fallback behaviour - Form validation - Task and transaction CRUD
operations - Notification read/dismiss behaviour

### Page-level tests

Verify: - Each route renders. - Navigation changes routes. - Forms show
validation messages. - Empty states appear for empty results. - Filters
change visible content. - Charts have useful labels or summaries. -
Language and region changes propagate. - Local changes persist after a
refresh.

### End-to-end smoke tests (optional)

1.  Open dashboard.
2.  Change language and region.
3.  Save a crop task.
4.  Filter market prices.
5.  Calculate potential cultivation profit.
6.  Mark a notification as read.
7.  Refresh and verify appropriate demo data remains.

### Manual acceptance pass

-   Test with keyboard only.
-   Test on narrow and wide screens.
-   Test long regional-language labels.
-   Test invalid forms and empty datasets.
-   Test local-storage failure/reset.
-   Check browser console and production build output.

------------------------------------------------------------------------

## 16. Step-by-Step Implementation Sequence

### Phase 1 --- Foundation

1.  Create the Vite React TypeScript project.
2.  Install and configure Tailwind, React Router, Lucide, and Recharts.
3.  Set up strict TypeScript and linting.
4.  Define design tokens and font fallbacks.
5.  Create reusable UI primitives.
6.  Build the desktop sidebar, top bar, mobile navigation, and page
    container.
7.  Add routes and a not-found page.
8.  Confirm a production build succeeds.

**Deliverable:** Navigable shell with consistent visual design.

### Phase 2 --- Types, data, and persistence

1.  Define shared TypeScript models.
2.  Add mock data modules.
3.  Implement safe local-storage helpers and versioned keys.
4.  Add shared profile, language, and region state.
5.  Build state/district selectors and language dictionaries.
6.  Add a reset-demo-data action.
7.  Test persistence and fallback behaviour.

**Deliverable:** Stable data foundation used by all pages.

### Phase 3 --- Dashboard and core information pages

1.  Build the dashboard cards.
2.  Implement crop catalogue and details.
3.  Implement weather overview and seven-day sample forecast.
4.  Implement market prices, filters, and charts.
5.  Add loading, empty, and error states.
6.  Verify mobile layouts.

**Deliverable:** Useful core pages with working local interactions.

### Phase 4 --- Farming workflows

1.  Implement crop recommendation inputs and transparent mock rules.
2.  Implement farming calendar and task CRUD.
3.  Implement farm expenses/income and the profit calculator.
4.  Implement soil profile and sample report interface.
5.  Test calculations, units, validation, and persistence.

**Deliverable:** Interactive farm-planning workflows.

### Phase 5 --- Learning and support

1.  Implement the farming assistant with simulated responses.
2.  Implement the pest and disease library and upload preview.
3.  Implement scheme search, filters, detail views, and checklist.
4.  Implement the knowledge centre.
5.  Implement notifications and local read state.
6.  Add disclaimers and verification labels.

**Deliverable:** All major feature modules present and navigable.

### Phase 6 --- Polish and quality

1.  Complete translations for all key UI strings.
2.  Check typography and font fallback for each supported script.
3.  Review accessibility and keyboard navigation.
4.  Check responsive breakpoints and horizontal overflow.
5.  Add unit/component tests for critical calculations and state
    changes.
6.  Fix console warnings and TypeScript errors.
7.  Run production build and preview.
8.  Update the README with setup, limitations, and demo-data notes.

**Deliverable:** Consistent, testable frontend prototype.

### Phase 7 --- Optional enhancements

1.  Add route-level lazy loading if needed.
2.  Add PWA/offline support for static guides only after defining cache
    behaviour.
3.  Add more region and translation coverage.
4.  Add end-to-end tests.
5.  Prepare a future integration plan for verified weather, market, and
    scheme data providers.
6.  Treat real image diagnosis and yield prediction as future projects
    requiring model validation and appropriate data.

------------------------------------------------------------------------

## 17. Definition of Done

A module is complete when:

-   [ ] Its route is reachable from the application navigation.
-   [ ] Its main content uses typed mock data.
-   [ ] Its visible controls have meaningful behaviour.
-   [ ] Forms validate required and numeric inputs.
-   [ ] Loading, empty, error, and success feedback are handled where
    relevant.
-   [ ] The page works on mobile, tablet, and desktop.
-   [ ] Keyboard focus and accessible labels are present.
-   [ ] Illustrative data and simulated features are clearly labelled.
-   [ ] Appropriate local changes persist after refresh.
-   [ ] No uncaught errors or broken navigation remain.

The project is complete when all P0 and P1 requirements are met, all 12
core modules and the extended feature pages are navigable, the build
passes, and the key manual acceptance journey works from start to
finish.

------------------------------------------------------------------------

## 18. Final Verification Checklist

### Build and code quality

-   [ ] `npm install` completes successfully.
-   [ ] Development server starts.
-   [ ] TypeScript check passes.
-   [ ] Lint passes.
-   [ ] Production build passes.
-   [ ] No broken imports or missing routes.
-   [ ] No avoidable console errors or React key warnings.

### Functionality

-   [ ] Sidebar, mobile navigation, global search, language selector,
    and profile menu work.
-   [ ] State/district selection updates relevant views.
-   [ ] Crop catalogue and crop detail routes work.
-   [ ] Recommendation form validates and returns explanatory sample
    results.
-   [ ] Weather filters/day selection work.
-   [ ] Market filters, sorting, charts, and revenue calculator work.
-   [ ] Scheme filters, details, and checklist work.
-   [ ] Calendar tasks can be added, edited, completed, and removed.
-   [ ] Transactions and profit calculations work.
-   [ ] Soil values can be entered and saved.
-   [ ] Upload previews can be selected and cleared.
-   [ ] Assistant messages return simulated responses.
-   [ ] Notifications can be read and dismissed.
-   [ ] Profile preferences persist.
-   [ ] Reset demo data works with confirmation.

### UX and trust

-   [ ] No UI implies that mock data is live.
-   [ ] MSP and mandi prices are distinguished.
-   [ ] Crop recommendations show assumptions and limitations.
-   [ ] Image upload does not claim to provide real diagnosis.
-   [ ] Soil photos are not represented as laboratory tests.
-   [ ] Scheme eligibility is not represented as official approval.
-   [ ] Financial calculations display assumptions and units.
-   [ ] External scheme links are official and verified, or clearly
    marked for verification.
-   [ ] All key pages are usable on small screens and with a keyboard.

------------------------------------------------------------------------

## 19. README Content to Include

The repository README should explain:

1.  Project overview and feature list.
2.  Technology stack.
3.  Requirements and installation commands.
4.  How to run the development server.
5.  How to run tests, lint, and production build.
6.  Main source-folder structure.
7.  How mock data and local storage work.
8.  How to add a translation.
9.  How to add a crop, scheme, article, or market sample.
10. Prototype limitations and future integration points.
11. Clear note that weather, market prices, assistant responses,
    recommendations, and image assessment are illustrative unless
    explicitly connected to verified real services.

## 20. Final Product Principle

Prioritise **clarity, trust, accessibility, and practical farming
workflows** over feature count. A small number of complete, well-tested
interactions is more valuable than many polished-looking controls that
do nothing. Every recommendation, forecast, price, eligibility result,
and simulated AI output must communicate what it is based on and what it
cannot guarantee.

# المكتبة · Al-Maktaba — Front-end build specification

**For:** Claude Code
**Deliverable:** A deployable demo front end (Next.js on Vercel). Not end-to-end software. Every screen must be explorable and every interaction must resolve to something — no dead links, no "coming soon".
**Audience for the demo:** a project team of six, then executives at Saudi Digital Academy and the Ministry of Communications and Information Technology (MCIT).

---

## 1. What the product is

A shared library of reusable AI work methods for Saudi organisations.

Someone works out how to get AI to do a piece of their job properly. Today that stays with them and they rebuild it every time. Al-Maktaba is where they publish it once, tagged by sector and role, so a colleague — or someone in another organisation doing the same job — can pick it up and run it.

The library counts two things: **how many distinct people reused a method**, and **how much time it saved them**. Those two numbers are the product's reason to exist. They are visible everywhere and they are never buried in a report.

**The one-line positioning:** Saudi Arabia has a national AI adoption framework and a national index measuring institutional readiness. Neither tells you whether one person's work actually changed. Al-Maktaba operates below that line.

---

## 2. Non-negotiable integrity rules

This demo will be shown to a government audience. Two rules protect it.

### 2.1 Every illustrative number is visibly marked

All figures in this build are **sample data**. Do not present any number as measured.

- A persistent, dismissible banner on the dashboard and benchmarks pages: *"Sample data. Figures illustrate the interface, not measured results."*
- Every benchmark chart carries an inline `Illustrative` chip in its header.
- The footer of every page carries the same one-line disclosure.

Do not soften this. Do not remove it to make the demo look cleaner. A single unmarked number in front of this audience costs more than the whole demo is worth.

### 2.2 Never fabricate model benchmarks

Do **not** generate a table claiming one model outperforms another on accuracy, quality or any measured dimension. That is invented evidence and it will be challenged.

Model information is **author-reported provenance**, not benchmarking. On a method page it reads:

> **Built and tested on:** Claude Sonnet 4.5
> **Also reported working:** GPT-5, Gemini 2.5 Pro
> *Reported by the author and by people who reused it. Not a benchmark.*

Community ratings are user opinions, labelled as such, with the count of raters always shown next to the score. A 4.8 from 3 people is displayed as `4.8 · 3 ratings`, never as a bare `4.8`.

---

## 3. Design direction

**Do not build the default AI-generated SaaS look.** Specifically avoid: cream `#F4F1EA` backgrounds with terracotta accents, identical rounded cards with soft grey shadows, tracked-out all-caps eyebrow labels above every heading, meta strings joined with middle dots, gradient washes as decoration, and arrows appended to button text.

### 3.1 Where the aesthetic comes from

This is a *library* — a place of catalogued, shelved, retrievable knowledge — for regulated Saudi enterprises. The vernacular to draw on is the catalogue and the index: precise, dense, legible, quietly authoritative. Think reference volume, not startup landing page.

The distinctive move: **the sector is the shelf.** Structure is expressed through a persistent left-hand sector index rather than through a grid of identical cards. Content is catalogued, not merchandised.

### 3.2 Tokens

Propose your own final palette, but hold to these constraints:

- **Base:** a cool neutral, not warm cream. A very light grey-blue paper (`#F7F8F9`-ish) with true white cards.
- **Ink:** a deep desaturated ink for text, not tinted near-black clichés.
- **One accent only**, used for actions and reuse counts. Pick a considered mid-tone — a deep teal or an ink blue reads as institutional without reading as a bank template. Do not use terracotta or acid green.
- **Sector colours:** one muted hue per sector, used only as a 3px shelf marker on the left edge of a catalogue row and in the sector index. Never as card backgrounds.
- **Semantic:** a single success tone for time-saved figures. Nothing else coloured.

**Type.** Two families, clearly distinct. The display face should have real character — a transitional or slab serif suits the catalogue idea. Body and UI in a clean grotesque. **Arabic is a first-class citizen, not a fallback:** pair with IBM Plex Sans Arabic or Noto Kufi Arabic and make sure Arabic method titles render at proper size and weight alongside Latin ones in the same list. Do not let Arabic text render smaller or lighter than its Latin neighbours.

**Radius and shadow.** Small radius (4px) on controls, 8px on cards. Hairline borders at 1px. No drop shadows anywhere except focus rings.

**Motion.** One orchestrated moment on the landing page only. No fade-and-slide on every section. Hover states are colour and border changes, not transforms.

### 3.3 Responsive

Mobile-first breakpoints, but the desktop view is the one being demoed to executives — design it as the primary and make sure it uses the width rather than centring a narrow column in a sea of grey.

- **Mobile (< 768px):** single column. Sector index collapses into a horizontal scrolling filter row pinned under the header. Bottom tab bar: Browse · Create · Insights.
- **Tablet (768–1024px):** two-column catalogue, sector index as a collapsible drawer.
- **Desktop (> 1024px):** persistent left sector index (240px), catalogue centre, method preview panel on the right when a row is selected.

---

## 4. The taxonomy

Use these exactly. They come from the team's existing scoring model and using them keeps the demo consistent with the rest of the project.

### 4.1 Sectors

| Sector | Data sensitivity |
|---|---|
| Telecom & Technology | Medium |
| Professional Services | High |
| Banking & Finance | Very high |
| Energy & Petrochemicals | High |
| Retail & E-commerce | Medium |
| Logistics & Transport | Medium |
| Government & Public Sector | Very high |
| Education | High |
| Healthcare | Very high |
| Construction & Real Estate | Low |

### 4.2 Role families

Fifteen, with the share of their work that is AI-addressable. Show this percentage in the role filter — it is genuinely useful context and it sets expectations honestly.

| Role family | AI-addressable | Arabic intensity |
|---|---|---|
| Marketing & Communications | 85% | High |
| Data & Analytics | 80% | Low |
| Software Engineering | 75% | Low |
| Customer Service | 70% | Very high |
| Sales & Business Development | 65% | Medium |
| Admin & Support | 65% | High |
| HR & People | 60% | High |
| Executive & Strategy | 60% | Medium |
| Finance & Accounting | 55% | Medium |
| Teaching & Academic | 55% | High |
| Legal & Compliance | 50% | High |
| Procurement & Supply Chain | 50% | Medium |
| Engineering (non-software) | 40% | Low |
| Healthcare Clinical | 30% | High |
| Operations & Field | 25% | Medium |

### 4.3 Other filters

- **Language:** Arabic · English · Bilingual
- **Data sensitivity of inputs:** Public · Internal · Confidential — with a rule stated in the UI that Confidential methods are exported and run inside the organisation's own approved tool rather than in Al-Maktaba.
- **Maturity:** New · Proven (5+ reuses) · Established (20+ reuses)

---

## 5. Screens

### 5.1 Landing page (`/`)

Public, unauthenticated. This is what gets shown first in November.

**Hero.** Do not open with a big number and a gradient. Open with the library itself: a live, quietly animating catalogue strip showing real method titles scrolling — Arabic and English interleaved — with their reuse counts. The product's premise is visible in three seconds without a paragraph of explanation.

Headline, sentence case, no single-word accenting:

> Someone in your organisation has already solved this.

Subhead:

> A shared library of AI work methods for Saudi organisations. Published once, reused by anyone doing the same job.

Two actions: `Browse the library` (primary) and `Publish a method` (secondary).

**Sections below, in order:**

1. **The problem, in three plain statements.** Not cards. Set as a short indented passage in the display face: AI use is personal. Methods die with the person who built them. Nothing measures whether the work changed.
2. **How it works.** Three steps — publish, reuse, measure. This genuinely is a sequence, so numbering is appropriate here and only here.
3. **The catalogue at a glance.** Sector coverage shown as a horizontal bar of shelf markers with method counts. Links into the dashboard filtered by sector.
4. **What gets measured.** Two figures only: reuse per method, and hours returned. Marked illustrative.
5. **Footer** with the sample-data disclosure and a line positioning the project relative to the national AI adoption framework.

### 5.2 Dashboard / catalogue (`/library`)

The main screen. Three regions on desktop.

**Left — sector index (240px, persistent).** Sectors listed with method counts and their shelf-marker colour. Below it, role family filter as a searchable checkbox list showing each role's AI-addressable percentage. Below that, language, sensitivity and maturity filters. A `Clear all` action appears only when a filter is active.

**Centre — the catalogue.** Not a card grid. A dense list of catalogue rows, each with:

- 3px sector shelf marker on the left edge
- Method title (Arabic renders right-to-left in place, at full size)
- One-line description
- Role family · sector, as plain text
- **Reuse count**, in the accent colour, the most prominent number on the row
- **Time delta** — `4.5h → 1.2h` — with the saving in the success tone
- **Rating** — score with rater count, never bare
- Language chip and sensitivity chip

Sort control: Most reused · Most time saved · Highest rated · Newest. Default is Most reused.

Above the list, four summary tiles — methods published, total reuses, hours returned, average reuse per method — each carrying the illustrative marker.

**Right — preview panel.** Selecting a row opens the method summary here without navigating away. On mobile this becomes a full-screen sheet.

**Empty state.** When filters return nothing: *"No methods here yet. This is where the first one goes."* with a `Publish a method` action. Not an apology.

### 5.3 Method detail (`/library/[id]`)

- Title, author, organisation, version, publish date
- What it does — two or three sentences
- Inputs required
- What stays human — an explicit section. This is the project's whole thesis and it belongs on every method page.
- **Provenance block** — built and tested on, also reported working, per §2.2
- **Performance panel** — typical time before, typical time after, number of runs contributing, accuracy notes as author-reported text rather than a score. Marked illustrative.
- **Reuse trail** — anonymised: `Reused by 14 people across 3 organisations`, with a small sector breakdown. Never name individuals.
- Ratings with distribution and the rater count
- Version history — v3 current, with prior versions listed and original author credited. Improvements create a new version; they never overwrite.
- Actions: `Run this method`, `Export for internal use`, `Suggest an improvement`

### 5.4 Create a method (`/publish`)

Four steps, with progress shown and back navigation working. Stepper, not a single long form.

1. **What do you do repeatedly?** Title (Arabic or English), description, role family, sector, language.
2. **How long does it take you now?** A single question with banded options and a free-entry field. Explain in one line why it is asked: this is what the reuse number is measured against.
3. **The method.** A large text area for the prompt or instructions, an input-definition field, an output-format field, and a quality checklist builder (add/remove rows). Alongside: the model it was built on, and a sensitivity selection which, if set to Confidential, shows the export-and-run-internally rule.
4. **Review and publish.** Renders exactly as the method detail page will look, with an edit action per section.

Include an assist affordance — `Draft this from an example` — which, in the demo, accepts a pasted example output and fills the fields with plausible content. Implement it against the Anthropic API if a key is available; otherwise stub it with a clearly-labelled sample fill. Do not fake it silently.

### 5.5 Insights / benchmarks (`/insights`)

The executive view. Everything here is marked illustrative.

- **Reuse per method by sector** — horizontal bars against a reference line at 2.0, with a note that below roughly 2.0 a library has become a dumping ground.
- **Time reduction by role family** — before and after, sorted by saving, with the AI-addressable percentage shown beside each so low-addressability roles are read fairly rather than looking like laggards.
- **Adoption ladder distribution** — five rungs: access, activation, habit, integration, impact. Population at each rung. This connects the library back to the wider programme.
- **Cross-organisation versus internal reuse** — a single honest chart showing that most reuse happens inside an organisation. Do not inflate the cross-organisation figure. If the real answer turns out to be near zero, that is a finding worth presenting, and the chart should be able to show it.
- **Arabic versus English method coverage** by role family.

Charts: Recharts or Visx. Muted palette, no gradients, direct labelling instead of legends where possible.

---

## 6. Suggested additional features

Build 1 and 2. Treat 3 and 4 as optional if time allows.

1. **Export for internal use.** Downloads a method as a self-contained markdown file to run inside the organisation's own approved AI tool. This is what makes the library usable by people whose data cannot leave their tenancy, and it is the single feature most likely to determine adoption in a bank or an energy company.
2. **Request a method.** Someone posts a task they wish existed as a method; others claim it. Solves the cold-start problem — an empty library with a request queue is more inviting than an empty library.
3. **Team view.** Methods published and reused by a named team, for managers. Team-level only, never individual leaderboards.
4. **Collections.** Curated sets — "starting in Legal & Compliance", "Arabic correspondence" — as an onboarding path.

Do not build: individual leaderboards, points, badges, streaks, or any personal scoring. That reintroduces employee-monitoring exposure the project is deliberately avoiding.

---

## 7. Icon and wordmark

Typographic, built on the Arabic letter **م** (meem).

The letter's form is a closed loop with a descending tail. Draw it so the loop reads simultaneously as the meem and as the end-on view of a rolled or bound volume, with the tail extending horizontally into a single shelf rule that the wordmark sits on.

- Deliver as SVG at 512×512 with a 32px safe margin, plus a favicon set.
- Monochrome. One ink weight. No gradient, no container circle, no gloss.
- Wordmark lockup: the mark, then `المكتبة` in the Arabic face and `Al-Maktaba` in the Latin display face, on the same shelf rule. Provide horizontal and stacked lockups.
- Must remain legible at 24px. Test it before finishing.

---

## 8. Technical

- Next.js App Router, TypeScript, Tailwind. shadcn/ui is acceptable for primitives but restyle to the tokens above — the default shadcn look is the templated appearance this brief is avoiding.
- No database. Seed data in typed TypeScript files under `/data`. All state in React.
- Deploy to Vercel.
- Seed with **24 methods** spread across at least 8 sectors and 10 role families, with a realistic distribution: a few with high reuse, most with low, and several with zero. Do not make every method look successful — a library where everything is popular is obviously fake and undermines the credibility of the insights page.
- At least 8 methods with Arabic titles and descriptions, drawn from the highest-Arabic-intensity roles: Customer Service, Admin & Support, HR & People, Legal & Compliance, Teaching & Academic.
- Draw the seed method topics from the sector table's own first use cases: credit memo drafting and KYC narrative for banking; technical document search and HSE report drafting for energy; Arabic correspondence and policy drafting for government; proposal and RFP drafting for professional services; customer service response drafting for telecom; tender documentation for construction and procurement.
- Accessibility floor: visible keyboard focus, `prefers-reduced-motion` respected, AA contrast, correct `dir="rtl"` on Arabic text nodes.

---

## 9. Process

Follow this order. Do not start coding at step 1.

1. Write a short design plan: 4–6 named hex values, the two typefaces and their roles, a layout concept with ASCII wireframes for desktop and mobile catalogue views.
2. Review that plan against §3.1. For any part that reads as the generic default you would produce for any similar brief, revise it and state what changed and why.
3. Build the landing page and the catalogue first. These are what get demoed.
4. Then method detail, then publish, then insights.
5. Screenshot each screen at 390px and 1440px and critique your own work before declaring it done.

Ship the quality floor without announcing it in the UI.


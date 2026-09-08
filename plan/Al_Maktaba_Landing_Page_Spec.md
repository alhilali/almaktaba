# المكتبة · Al-Maktaba — Landing page specification

**For:** Claude Code. Companion to `Al_Maktaba_Frontend_Build_Spec.md`. This file **supersedes §3 and §5.1** of that document.

---

## 1. What this page has to do

Three jobs, in this order. If a section does not serve one of them, cut it.

1. **Explain the idea in ten seconds** to someone who has never heard it.
2. **Show that it sits inside existing national frameworks**, not beside or above them.
3. **Look like it came from an institution**, so that nothing on the page has to argue for its own credibility.

It is not a marketing page. There is no pricing, no testimonials, no logo wall, no "trusted by".

---

## 2. Attribution — read this before writing any copy

This library is one component of a wider programme designed by a colleague. The page must read as a contribution to that programme, never as a replacement for it. Three rules:

**2.1 The absorption ladder is credited, not claimed.** Wherever the five rungs appear — access, activation, habit, integration, impact — they are introduced as the programme's model, with the line: *from the AI Absorption framework developed by the programme team.* Al-Maktaba is described as an instrument that operates on one rung of it.

**2.2 The library's stated purpose is to serve the wider model.** The programme's scoring model identifies asset reuse as its central lever and records, as its highest-rated risk, that no system currently exists to verify that reuse. Say so plainly on the page. Al-Maktaba's positioning is: *this is the missing instrument, built so the framework has something real to measure.*

**2.3 Use the programme's own vocabulary throughout.** Contribution rather than consumption. Reuse per method. Role denominators. Integration as the bottleneck. Do not invent parallel terms for concepts the programme has already named — that is what makes a contribution read as a takeover.

---

## 3. The differentiator — the argument the page has to make

This is the intellectual core. Get the copy right here and the rest of the page is presentation.

### 3.1 Against national indexes

Saudi Arabia already measures AI adoption. SDAIA's AI Adoption Framework sets staged maturity levels for entities. The National AI Index assesses institutional readiness across three pillars, seven dimensions and twenty-three subcategories, and returns a maturity level per entity.

These are assessments. They answer *how ready is this organisation.* They are periodic, top-down, scored about you, and their unit is the institution.

Al-Maktaba answers a different question: *did the work change.* Continuous rather than periodic, bottom-up rather than top-down, and its unit is the task rather than the entity. It is not scored about anyone — it is used, and the measurement is a by-product of the use.

**The line for the page:** an index tells an entity where it stands. It does not move it. Al-Maktaba operates below the index, at the level where work actually changes, and produces the evidence an index asks for.

Say explicitly that this is complementary. That sentence is what makes the page safe to show to the people who built the index.

### 3.2 Against creator-led prompt libraries and marketplaces

Global prompt libraries rank by popularity: downloads, stars, follower counts. Four differences, and the page states them as differences rather than as criticism:

| | Creator libraries | Al-Maktaba |
|---|---|---|
| What is counted | Downloads and follows | Distinct people who ran it, verified by the run |
| What is rewarded | Audience size | Time returned to someone else |
| Context | None — a prompt is a prompt | Role family and sector, with the addressable share of that role stated |
| Language | English-first, Arabic translated | Arabic and English as equals |

**The line for the page:** popularity measures attention. Reuse measures usefulness. Only one of them can be checked.

### 3.3 What none of them do

No framework, index or library currently measures whether a single person's work changed. That gap is the reason this exists, and it is the last sentence of the differentiator section.

---

## 4. Design system

Follow this exactly. It is the deliverable, not a starting point.

### 4.1 Concept

**The catalogue.** A reference institution — ruled index cards, shelf markers, a brass plaque. Precise, dense, legible, unhurried. Authority comes from restraint and from the quality of the typographic setting, never from decoration.

Deliberately not: the SaaS card kit, cream-and-terracotta, gradient washes, glassmorphism, all-caps eyebrows, or arrows appended to buttons.

### 4.2 Palette

```
--paper           #F5F7F8   page background, cool grey
--surface         #FFFFFF   cards, catalogue rows
--surface-sunk    #EDF0F2   sunken wells, filter rails
--ink             #16202A   primary text, blue-slate
--ink-muted       #5A6672   secondary text
--ink-faint       #8B959E   metadata, disclosures
--rule            #DDE2E6   1px hairlines
--rule-strong     #C3CAD1   emphasised dividers
--accent          #0F5450   deep teal — actions, reuse counts, links
--accent-sunk     #E4EFED   accent tint for chips only
--measure         #8A6516   brass — time saved, and nothing else
--measure-sunk    #F5EEDC
```

Rules of use:
- **One accent.** `--accent` marks actions and reuse counts. `--measure` marks time returned. Nothing else on the page is coloured.
- The brass tone is the page's single warm note. It carries the number the whole product exists to produce, and it gives the page its library quality. Do not spread it.
- Text on any tint uses the corresponding solid at full darkness, never grey.
- Dark mode is out of scope. Do not build it.

**Sector shelf markers** — ten muted hues at low saturation, used only as a 3px left edge on a catalogue row and as a dot in the sector index. Never as a background fill.

```
Telecom & Technology        #4A6D8C
Professional Services       #6B5B8A
Banking & Finance           #2F5D50
Energy & Petrochemicals     #7A5B3A
Retail & E-commerce         #8A5570
Logistics & Transport       #4F6B5A
Government & Public Sector  #3D5470
Education                   #7A6B45
Healthcare                  #5A7A78
Construction & Real Estate  #6E6A5E
```

### 4.3 Type

Two families. The Arabic requirement decides the pairing — this is a real constraint, not a preference.

- **Display:** Source Serif 4. Weights 400 and 600. Headlines, section openers, pull statements.
- **Interface and body:** IBM Plex Sans. Weights 400, 500, 600.
- **Arabic, all sizes:** IBM Plex Sans Arabic. Same family, so Arabic and Latin sit at matching weight and colour in the same list rather than one looking like a translation of the other. This is the reason for the choice — state it in the design plan.

Scale, on a 1.25 ratio:

```
display-1   48/1.1   Source Serif 4 600   hero headline
display-2   34/1.2   Source Serif 4 600   section openers
display-3   26/1.3   Source Serif 4 400   pull statements
body-lg     19/1.65  IBM Plex Sans 400    lead paragraphs
body        16/1.7   IBM Plex Sans 400    default
label       14/1.5   IBM Plex Sans 500    UI labels, chips
meta        13/1.5   IBM Plex Sans 400    metadata, counts
disclosure  12/1.5   IBM Plex Sans 400    sample-data notices
```

Mobile: display-1 drops to 34, display-2 to 26, everything else holds.

Sentence case everywhere. No all-caps. No accenting a single word inside a headline. Measure capped at 68 characters for body text.

### 4.4 Structure and space

- 8px base unit. Section vertical rhythm: 96px desktop, 56px mobile.
- Max content width 1180px. Text columns never exceed 680px.
- Radius: 4px on controls, 8px on cards, 0 on catalogue rows — rows are ruled, not floated.
- Borders 1px `--rule`. **No shadows anywhere** except a 2px `--accent` focus ring.
- Buttons: primary is solid `--accent` with white text; secondary is 1px `--rule-strong` on transparent. No arrows in labels.
- Chips: 4px radius, tint background, solid text from the same family, 12px.

### 4.5 Motion

One orchestrated moment: the hero catalogue strip, described below. Everything else is static. No scroll reveals, no card hover lifts. Hover changes border colour and nothing more. `prefers-reduced-motion` freezes the strip on a static frame.

---

## 5. Page structure

### Header
Wordmark left, three links right — Library, Insights, Publish — and a `Browse the library` button. 1px bottom rule. Not sticky.

### Section 1 — Hero

Left column, 58% width. Headline in display-1:

> Someone in your organisation has already solved this.

Lead paragraph in body-lg:

> A shared library of AI work methods for Saudi organisations. One person works out how to get AI to do a piece of their job properly, publishes it once, and anyone doing the same job can run it. The library counts how many people reused it and how much time it gave them back.

Two buttons: `Browse the library`, `Publish a method`.

Right column, 42%: **the catalogue strip.** A vertical column of six catalogue rows, Arabic and English interleaved, each with its sector shelf marker, title, role, and reuse count in `--accent`. It scrolls upward slowly and continuously, looping. This is the only motion on the page and it shows the entire product premise without a word of explanation.

On mobile the strip moves below the buttons and becomes a horizontal scroll.

### Section 2 — The problem

No cards. Three short statements set in display-3, stacked, each on its own line with generous leading, indented from the left margin with a single 1px rule running down the left edge:

> AI use today is personal. Everyone solves the same problem alone.
>
> Methods die with the person who built them. The next person starts over.
>
> Nothing measures whether the work actually changed.

### Section 3 — How it works

The only place on the page where numbering is used, because this genuinely is a sequence. Three steps, horizontal on desktop, stacked on mobile. Numerals set in Source Serif 4 at 34px in `--rule-strong`, small and quiet.

1. **Publish** — describe the task, say how long it takes you today, paste the method.
2. **Reuse** — someone doing the same job runs it. The library records that they did.
3. **Measure** — time before, time after, counted per run rather than self-reported.

One line beneath, in meta: *The measurement is a by-product of the use. Nobody fills in a form.*

### Section 4 — Where this sits

The attribution and frameworks section. Two parts.

**Part A — the programme.** A short passage crediting the wider work:

> Al-Maktaba is one component of the AI Absorption programme developed by the team. That programme measures how far AI has been absorbed into an organisation using a five-rung ladder — access, activation, habit, integration, impact — and normalises scores against the share of each role's work that AI can realistically address.
>
> Its central finding is that access spreads on its own and integration does not. Its central lever is asset reuse. Its highest-rated risk is that no system exists to verify that reuse is happening.
>
> This library is that system.

Below, the five rungs rendered as a horizontal ladder, with rung four — integration — marked as the one Al-Maktaba operates on. Muted, structural, small. Not a hero graphic.

**Part B — national and international frameworks.** A two-column list, plain text with hairline separators, no logos:

*Saudi Arabia*
- **SDAIA AI Adoption Framework** — national roadmap for AI adoption, with staged maturity levels and readiness assessment templates
- **SDAIA National AI Index** — institutional readiness assessed across three pillars, seven dimensions and twenty-three subcategories
- **SDAIA AI Ethics Principles** and the **Generative AI Guidelines**, issued in separate versions for government employees and for the public
- **Personal Data Protection Law (PDPL)** — governs how anything measured here may be collected and retained
- **National Strategy for Data and AI**, under Vision 2030

*International*
- **NIST AI Risk Management Framework**
- **ISO/IEC 42001** — AI management systems
- **Bass diffusion model (1969)** — the mathematics underneath the programme's adoption simulation

**Verify before publishing.** These references are drawn from secondary sources. Confirm the exact document reference and version of the SDAIA framework against SDAIA's own published document before this page goes in front of anyone from MCIT. Do not print a reference number that has not been checked at source.

### Section 5 — What makes this different

Two blocks, each opening with a display-2 line, followed by short body copy. Then the comparison table from §3.2, set as a real table with hairline rules — not cards.

**Block one: "An index tells you where you stand. It does not move you."**

> National indexes assess institutional readiness. They are periodic, top-down, and their unit is the entity. Al-Maktaba works below that line: continuous rather than periodic, and its unit is the task. It does not compete with an index — it produces the kind of evidence an index asks for.

**Block two: "Popularity measures attention. Reuse measures usefulness."**

> Prompt libraries rank creators by downloads and followers. A download is not a use, and neither can be checked. Here, reuse is counted when someone actually runs a method, in the context of their own role and sector, and the number that matters is the time it gave back to a person who did not write it.

Closing line, display-3, standing alone:

> No framework, index or library currently measures whether one person's work changed.

### Section 6 — The catalogue at a glance

Ten sector rows. Each: shelf-marker dot, sector name, method count, a thin bar showing relative share, and reuse per method. Clicking any row opens `/library` filtered to that sector.

Header carries the `Illustrative` chip.

### Section 7 — Close

Single line in display-2:

> Publish one method. See who uses it.

Two buttons. Nothing else.

### Footer

Three columns: product links, the framework references repeated as links, and the disclosure block.

Disclosure text, always present, in `--ink-faint` at 12px:

> Sample data throughout. Figures illustrate the interface and are not measured results. Al-Maktaba is a component of the AI Absorption programme and is complementary to, not a substitute for, national AI adoption frameworks and assessments.

---

## 6. Copy rules

- Sentence case. Contractions allowed. No exclamation marks.
- Never: leverage, seamless, unlock, empower, revolutionise, transform, journey, ecosystem.
- Never claim measurement the demo has not performed. Every figure is marked.
- Arabic strings render right-to-left in place with correct `dir` and `lang` attributes, at the same size and weight as their Latin neighbours.

---

## 7. Process

1. Write the design plan first — palette, type roles, ASCII wireframes for the hero at 1440px and 390px.
2. Check it against §4.1: anything that reads as the default you would build for any similar brief gets revised, with a note on what changed.
3. Build the hero and the catalogue strip. Screenshot both widths and critique before continuing.
4. Then sections 2 through 7.
5. Final pass: keyboard focus visible throughout, reduced motion respected, AA contrast confirmed, Arabic rendering checked on a real device width.


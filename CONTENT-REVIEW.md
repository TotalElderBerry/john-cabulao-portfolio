# Content review — for John

Everything below was entered from your drawings, BOQs and resume. Please tick each item or send corrections.
Nothing here is published yet: `public/media/` (the rendered sheets and screenshots) stays out of the repository until you give written OK.

## 1. Site copy (`content/site.yml`)

- [ ] Role line: "Construction estimator". Bio is rewritten from your resume summary — please read it.
- [ ] Statement: "I measure every wall, door and square metre on your drawings — so the price is right before the first trade is booked." (from the approved mockup)
- [ ] Location shown as "Cebu City, Philippines — working Australian hours". Phone is hidden (`phone: null`); your street address is not shown.
- [ ] Software list: PlanSwift, Cubit Estimating, CostX, Excel, AutoCAD (Bluebeam was in an early draft but is not on your resume, so it is out).
- [ ] Credentials: Registered Civil Engineer; BS Civil Engineering, Cum Laude (2023); Construction Estimator at Costimate; freelance estimator. OK to name Costimate publicly?
- [ ] Your professional reference is not on the site. Please confirm that is what you want.
- [ ] Services: four cards (Single-trade BOQ, Multi-trade BOQ, Cost plan estimate, Quote vetting), each with "you send" and "you get" text written by us. Only Single-trade BOQ links an example job (plastering-01). Do you have a priced cost plan or a vetted quote you could show as an example later?
- [ ] Form success message: "Thanks — John will reply within one working day."

## 2. Flagship jobs (shown with "drawing to BOQ line" links)

- [ ] **plastering-01**: BOQ lines 2.01 (PT1, 335.05 m²), 2.03 (PT2, 70.55 m²), 2.09 (external angle, 72.60 Lm), 2.11 (skirting, 280.08 Lm), with the mockup wording.
- [ ] **painting-03** (townhouses, Unit 1 ground floor sheet): 5 lines: internal walls (1,680.80 m²), ceilings (525.32 m²), internal doors (59 ea), alfresco soffit (57.21 m²), porch soffit (12.82 m²).
- [ ] **carpentry-05** (school classroom upgrade): 4 lines: decking (108.60 m²), structural floorboard (203.08 m²), timber packers (971.30 m), window reveals (85.86 m).
- [ ] The painting and carpentry BOQs have an empty Ref column. We numbered lines by their position in the BOQ (painting-03: 1, 6, 11, 12, 13; carpentry-05: 1, 4, 5, 6). OK, or do you want different refs?
- [ ] Notes under each line ("This sheet: 33.4 m²" and similar) are ours, written from the legend on sheet 1. Totals are for the whole job, so they are larger than the sheet figure.
- [ ] Hotspot boxes on the sheets are rough. They will be fine-tuned when the page is built.

## 3. Single-trade jobs: inferred project type and scope ("inferred, please confirm")

All 39 jobs are `public: true` for local development, and the tool is PlanSwift for all of them. Legends were transcribed from page 1 of each markup; colours are sampled from the swatches.

| Job | Project type (inferred) | Scope (inferred) | Legend items | Redactions | Flagship |
|---|---|---|---|---|---|
| plastering-01 | Office fit-out | Partitions, ceilings, glazing | 16 | 0 | yes |
| plastering-02 | Tenancy fit-out | Accessible WC partitions, ceilings, doors | 4 | 2 |  |
| plastering-03 | Office floor refurbishment | Grid and tile ceilings | 1 | 1 |  |
| plastering-04 | Office fit-out | Partitions, glazed partitions, doors | 8 | 0 |  |
| plastering-05 | School administration refurbishment | Internal and external wall linings | 40 | 1 |  |
| plastering-06 | Office tenancy fit-out | Partitions, glazed partitions | 7 | 0 |  |
| plastering-07 | Office fit-out | Partitions, part-height walls, glazed partitions, doors | 7 | 1 |  |
| plastering-08 | Office fit-out | Partitions, amenities walls | 6 | 0 |  |
| plastering-09 | Gallery refurbishment | Stud walls, wall linings, patch and repair | 27 | 1 |  |
| plastering-10 | Retail podium refurbishment | Partitions to untagged walls | 4 | 13 |  |
| plastering-11 | Community building upgrade | Plasterboard ceilings, soffit linings, access hatches | 7 | 0 |  |
| plastering-12 | Co-working office fit-out | Partitions, glazed partitions, doors | 13 | 0 |  |
| plastering-13 | Office and amenities new build | Partitions, wet-area walls, doors | 20 | 0 |  |
| plastering-14 | Office fit-out | Partitions, glazed partitions, acoustic insulation | 11 | 0 |  |
| plastering-15 | Office fit-out | Partitions, glazed partitions | 8 | 0 |  |
| plastering-16 | Office fit-out | Partitions, windows, doors | 10 | 0 |  |
| plastering-17 | Warehouse and office new build | Steel-framed partitions, wet-area walls, doors | 13 | 1 |  |
| plastering-18 | Fitness centre fit-out | Partitions, wet-area walls | 11 | 0 |  |
| plastering-19 | Office fit-out | Partitions, glazed partitions, wall junctions | 16 | 2 |  |
| plastering-20 | Office fit-out | Partitions, skirting | 5 | 0 |  |
| painting-01 | Department store refurbishment | Render paint to internal walls | 2 | 2 |  |
| painting-02 | Residential new build | Render to external walls | 3 | 3 |  |
| painting-03 | Townhouse development | Internal and external painting | 13 | 0 | yes |
| painting-04 | Multi-residential new build (basement) | Render to internal walls | 6 | 3 |  |
| painting-05 | Residential podium landscaping | Render to retaining walls, edges and planters | 10 | 1 |  |
| painting-06 | Residential new build | External render to planter boxes and brick walls | 2 | 2 |  |
| painting-07 | Warehouse units new build | Internal painting, concrete sealer | 9 | 0 |  |
| painting-08 | Residential new build | Internal and external painting, decking and coatings | 18 | 0 |  |
| painting-09 | Multi-residential new build | Internal and external painting | 1 | 0 |  |
| painting-10 | Modular building new build | Internal and external painting | 1 | 0 |  |
| carpentry-01 | Education building new build | Window reveals, doors and hardware, wall and ceiling linings, cladding, toilet accessories | 5 | 0 |  |
| carpentry-02 | School gymnasium new build | Wall framing and linings | 17 | 0 |  |
| carpentry-03 | School science building new build | Wall framing and linings | 20 | 1 |  |
| carpentry-04 | School classroom building new build | Wall framing and linings, timber doors | 12 | 0 |  |
| carpentry-05 | School classroom upgrade | Timber decking, flooring, packers, window reveals, skirting, battens | 5 | 0 | yes |
| carpentry-06 | Childcare centre extension | Timber stud partitions, skirting | 2 | 1 |  |
| tiling-01 | Food and beverage tenancy fit-out | Floor and wall tiling, caulking, waterstops | 12 | 1 |  |
| tiling-02 | Entertainment venue fit-out | Wet-area wall tiling, caulking, waterstops | 3 | 0 |  |
| masonry-01 | Community building extension | Honed blockwork, lintels | 3 | 0 |  |

Notes on legends:
- No legend was left empty. All 39 sheets had a readable legend on page 1.
- Some sheets repeat a label with different quantities (e.g. plastering-11 "CL-01" twice, painting-01 the same render line twice, carpentry-02 "WT-AW02 @4600mm ht" three times). These are copied as printed.
- A few pale swatches were too light to sample; their colours are estimates (plastering-14 baffle insulation, painting-03 ceilings in general areas, painting-04 waste room, painting-07 floor sealer, painting-08 external soffit).
- carpentry-06 has no BOQ PDF, only the spreadsheet; its scope comes from the legend.

## 4. Published sheets and redactions

**Only the main sheet (PDF page 1) of each job is published in v1** (`pages: [1]` on all 39 jobs). Later pages are opt-in. Once you have checked a page, we add it to that job's `pages` list, and any redactions it needs get their own `page:` number.

Every published page 1 was read by eye at 3200 px, quadrant by quadrant. That covered the title lines, notes boxes, the text near and under the legend, and the edges.

Later pages you could clear (238 pages across 35 jobs):

| Job | PDF pages | Candidate later pages for your review |
|---|---|---|
| plastering-01 | 3 | 2–3 |
| plastering-02 | 1 | — |
| plastering-03 | 9 | 2–9 |
| plastering-04 | 9 | 2–9 |
| plastering-05 | 4 | 2–4 |
| plastering-06 | 7 | 2–7 |
| plastering-07 | 1 | — |
| plastering-08 | 7 | 2–7 |
| plastering-09 | 2 | 2 |
| plastering-10 | 6 | 2–6 |
| plastering-11 | 6 | 2–6 |
| plastering-12 | 2 | 2 |
| plastering-13 | 6 | 2–6 |
| plastering-14 | 3 | 2–3 |
| plastering-15 | 3 | 2–3 |
| plastering-16 | 3 | 2–3 |
| plastering-17 | 12 | 2–12 |
| plastering-18 | 21 | 2–21 |
| plastering-19 | 11 | 2–11 |
| plastering-20 | 2 | 2 |
| painting-01 | 3 | 2–3 |
| painting-02 | 3 | 2–3 |
| painting-03 | 21 | 2–21 |
| painting-04 | 8 | 2–8 |
| painting-05 | 6 | 2–6 |
| painting-06 | 5 | 2–5 |
| painting-07 | 9 | 2–9 |
| painting-08 | 12 | 2–12 |
| painting-09 | 12 | 2–12 |
| painting-10 | 8 | 2–8 |
| carpentry-01 | 12 | 2–12 |
| carpentry-02 | 7 | 2–7 |
| carpentry-03 | 11 | 2–11 |
| carpentry-04 | 12 | 2–12 |
| carpentry-05 | 12 | 2–12 |
| carpentry-06 | 14 | 2–14 |
| tiling-01 | 1 | — |
| tiling-02 | 2 | 2 |
| masonry-01 | 1 | — |

What earlier review rounds found on later pages, kept here so you know what to look out for:
- street names and neighbouring addresses on site and floor plans
- a client's title strip with logo, email, phone and site address running behind the legend
- consultant names in notes and drawing-production lines, including fire engineer, designer, energy assessor and services consultant
- architect copyright lines and revision schedules in the right-hand strip
- tenant and brand names on shopping-centre plans
- engineers' title blocks on structural sheets

Redactions on the published sheets, painted white:
- plastering-01: a note naming the interior designer.
- plastering-02: a street name above the plan; a tenant name at the rear entry.
- plastering-03: the project file reference printed down the left edge.
- plastering-05: title-block remnants at the bottom right; an emblem drawn in the paving (possibly a school crest).
- plastering-07: a street name to the left of the plan.
- plastering-08: two notes naming the client (a wall-schedule row and a landlord-works note).
- plastering-09: the BIM model file path along the bottom; two "entry to …" labels naming the client.
- plastering-10: three street names, ten tenant or brand names, and a telecom-company label.
- plastering-14: a faint designer logo behind the legend. This also blanks the printed "External angles" label on the sheet; the legend data on the site is unaffected.
- plastering-15: cut-off title-block headings below the legend.
- plastering-16: cut-off title-block text along the bottom edge.
- plastering-17: the fire-engineering note naming the consultant and their project number.
- plastering-19: two street names.
- painting-01: two schedule headings, two plan labels and a drawing reference that name the client.
- painting-02: two street names, the architect copyright line, and a neighbouring house number.
- painting-04: two neighbouring property addresses; a bus-stop note naming the street.
- painting-05: a consultant name in the "new scope" note; the visible tail of a street name below the legend.
- painting-06: a neighbouring house number, a strata plan number, and a cut-off number at the left edge (possibly a lot number).
- painting-07: two lines naming the telecom consultant.
- carpentry-03: the revision schedule, the architect copyright, and faint fragments of both next to the legend.
- carpentry-06: consultant initials in the insulation table note; the revision schedule at the top right.
- tiling-01: title-block remnants along the bottom.
- tiling-02: approver initials in a legend note.

Still visible:
- Product and supplier names (paint, plasterboard, furniture and fittings brands) are left as they are.
- The "CONFIDENTIAL" watermark is still on every sheet. Is it OK to show, or should we ask for clean exports?

## 5. Multi-trade projects (`content/multi-trade/`)

- [ ] **Aged care residence hero:** the hero image is Render 1, a recognisable real building. Please give explicit OK to show it, or pick another image.
- [ ] Titles are **placeholders**: "Aged care residence", "Events gallery fit-out", "Community pavilion". Please send the descriptive titles you want.
- [ ] Types (New build / Refurbishment / New build), trade lists and the one-line blurbs are ours. Please confirm.
- [ ] Screenshots are trimmed to the drawing viewport; the ribbon, estimate panel, file tabs and title blocks are cut away.
- Left out on purpose, because trimming could not remove a client name, address or title block:
  - Aged care residence: Render 2 and Render 3 (client signage on the building), and the 3D landscape view (a neighbouring street address is legible).
  - Events gallery fit-out: the 3D architectural view (the sheet's title strip with the architect's logo runs through it).
  - Community pavilion: the 3D architecture view (its title block shows the client and site address).
- The aged care 2D landscape view is cropped tighter to cut off street addresses.
- The community pavilion render is small (612 px wide), so it will look soft as a large hero. Do you have a larger render?
- The events gallery fit-out "renders" are presentation boards with several small views. Is a single large interior image available?

## 6. Other items needing your OK

- [ ] All sheets and screenshots come from client work. Are you comfortable showing them publicly with the redactions above?
- [ ] BOQ downloads are off for every job (`boqDownload: false`).

# Airport Airside Manager (AAM)

**An integrated airport operations management platform by JSR Communications.**

Airport Airside Manager (AAM) is being developed to help small and medium-sized airports coordinate daily airside operations from one connected system. Rather than relying on disconnected spreadsheets, group messages and paper records, AAM is designed to bring flight schedules, airport resource assignments, inspections, issue management, permits, NOTAM requests and operational reporting into a role-based management hub.

AAM is initially focused on Caribbean airports, with each airport's configuration intended to reflect its own facilities, procedures, approved workflows and regulatory requirements.

**Project status:** AAM is in development. This repository currently hosts an interactive, **fictional JSR International Airport (JIA) demonstration** of selected workflows; it is not a complete production application or an airport-certified operational system.

## AAM product scope

| Area | Intended capability |
|---|---|
| Flight schedules and assignments | Airline flight requests, Operations acceptance, parking stands and alternates, check-in counters, boarding gates, baggage belts and clashes |
| General aviation | Multi-day parking register, position allocation and overlapping-stay checks |
| Inspections | Configurable airfield, runway, apron and terminal checklists; remarks, follow-up actions, reports and appropriate runway-condition information |
| Issues and defects | Report, assign, track, remind, escalate and sign off defects; link failed inspection items to tracked issues |
| Permits | Requests, approvals, conditions and close-out for hot works, airside works and relevant driving/airside permissions |
| NOTAM requests | Prepare, review and route requests to authorised personnel/AIS; the platform does not itself issue an official NOTAM |
| Operations dashboards | Flights, resource use, inspection follow-ups, defects, active permits and other operational information |
| Airline private workspace | Each airline can maintain, annotate, add private rows to and print its own internal schedules without sharing private changes with Airport Operations |
| Core platform | Airport-specific configuration, role-based access for Operations, airlines, handlers, Maintenance, ATC, managers and other approved teams, plus audit trails and separation of customer data |

These are **product requirements and development objectives**, not claims that every capability has already been implemented or verified.

## JIA demonstration — currently available

The demonstration uses invented flights, aircraft, airport geometry and operational records.

| Component | Current status |
|---|---|
| Operations Hub, flight movement board and assignment-linked fictional apron map | Interactive browser demonstration |
| Daily stand, counter and gate assignment controls and GA parking | Interactive browser demonstration |
| Airfield inspection and runway-condition entry | Standalone browser-based inspection demonstration |
| Terminal inspection | Standalone browser-based inspection demonstration |
| Issues, permit requests and internal NOTAM request preparation | Browser-only workflow demonstration with fictional records and a simulated role selector; **no real authorisations, messaging or official NOTAMs** |
| Shared role-based sign-in, multi-airport database, automatic issue reminders, inspection-to-issue integration, official permit routing, AIS submission and airline-private server workspace | **Not implemented in this static demonstration** |

The interactive apron schematic covers Stands 1–10, Stand 7L, general aviation positions G1–G9 and Cargo. Saved assignment data informs its indicators where available. The map is **invented and not to scale**.

### Demonstration files

- `index.html` — AAM Operations Hub landing page, interactive apron map and flight movement board.
- `assignments.html` — Flight schedule, resource allocation, GA parking and rules demonstration.
- `airfield-inspection.html` — Airfield inspection demonstration and reporting.
- `terminal-inspection.html` — Terminal inspection demonstration and reporting.
- `workflows.html` — Fictional issue reporting, permit lifecycle and internal NOTAM request preview using local browser storage.
- `assets/jia-demo-apron.svg` — Original fictional schematic for the interactive map.

## View the demonstration

GitHub Pages can publish the fictional website from the `main` branch, `/ (root)`, in **Settings → Pages**. Once enabled, the anticipated URL is:

https://HTLearn2022.github.io/AAM/

The source can also be viewed locally by opening `index.html` or serving the repository as a static directory.

## Development and operational safeguards

- This is a **public demonstration repository**, not the intended production deployment or a substitute for approved airport procedures.
- The demonstration stores some data locally within the visitor's browser; records are **not shared between users or devices**.
- Weather conditions, METAR/TAF and NOTAM-style airport notices are fabricated fixed examples, not current aviation data.
- The role switcher in the workflow preview only simulates different permissions. It is not a login, cannot enforce access control and must not be used with real airport information.
- The flight and inspection modules currently operate as separate browser applications. There is no production login, shared database or live airport-data service.
- Some inspection controls can generate or prepare downloadable reports or emails. They do not replace an airport's formal approval, notification, recordkeeping or NOTAM-issuance processes.
- Safety-relevant functions will require airport-specific validation, access controls, auditability and applicable procedural/regulatory review before live operational use.
- Do not enter live airport schedules, confidential records, passwords, API tokens or other restricted operational information into the public demonstration.
- Proprietary source-code rights, third-party data licensing and commercial use are separate considerations; publication of this demonstration is not a claim that the entire AAM SaaS product is open source.

## Developer

**JSR Communications** — Saint Vincent and the Grenadines  
Website: https://www.jsrsvg.com  
Product: **Airport Airside Manager (AAM)**

The JIA demonstration illustrates the direction of the product; AAM itself is the broader airport operations management platform.

© JSR Communications. All rights reserved.

Copyright notice: 2026.

Airport Airside Manager (AAM) — Proprietary Notice

The source code, documentation, original artwork and other materials in this repository are proprietary to JSR Communications, except where a file or third-party component expressly states otherwise.

This repository is made publicly accessible for demonstration and evaluation. Public access does not grant a licence to copy, modify, redistribute, sublicense or commercially exploit these materials. No open-source licence is granted. Any permission to use or reproduce proprietary materials must be obtained in writing from JSR Communications, subject to applicable law and third-party rights.

All third-party software, assets and data remain subject to their respective terms and licences.

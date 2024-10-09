# Hermes' Loom

Driving regenerative societal transformation through humanist artificial intelligence.

## Overview

Please see https://hermesloom.org/ for the general motivation for this project and its inherent connection to AI safety.

In the most general sense, this platform shall serve **capability building** and **capability matching** purposes, with a sole focus on **philanthropic, non-profit projects**. After all, every project needs certain resources to be executed successfully, for example:

- money
- locations (incl. plots of land or buildings) for physically hosting spaces
- expertise in certain areas and contact to motivated collaborators
- contact to the right existing networks to leverage collective strengths and share resources
- technology and tools
- logistical support
- appropriate legal and regulatory setup, incl. risk management as well as financial and contingency planning
- support in governance, project management, conflict resolution etc.

While many people would be incredibly motivated to work on philanthropic projects, they often actually cannot dedicate much time to these endeavors, simply because these projects wouldn't generate direct income and acquiring funding through other means (e.g. acquiring donors, writing applications to funding tenders) is simply too complex and work-intensive. At the same time, when projects start growing and complex flows of communication start emerging and well thought-out methods for decentralized conflict resolution, policy- and decision-making become essential.

Some basic principles for this project include:

- Keep it open source. Licensed under the [Unlicense](https://unlicense.org/).
- Keep it non-profit. No paywalls for anything, ever.
- Keep it globally accessible and super easy to use (no login required, multilingual interface etc.).
- Keep it general (i.e. for all philanthropic projects, interfaith, interdisciplinary).

## Current status

As a very first step, we built the proof of concept for the _Thread of Wealth_. More specifically:

1. We have scraped the "foundation purposes" of all ~30,000 German foundations and calculated the embedding vectors for them.
2. On https://app.hermesloom.org (built with Next.js, NextUI, MongoDB, Pinecone, Vercel, OpenAI), anyone can enter any project description, which gets converted to a "hypothetical" foundation purpose.
3. This is then matched against the purposes of all real German foundations using cosine similarity ([semantic matching](https://en.wikipedia.org/wiki/Semantic_matching)), thus presumably making it trivial to find the best foundation to fund this project.

See [#2](https://github.com/henophilia/hermesloom/issues/2) as well as the slide deck [Enhancing Accessibility to Non-Profit Funding Through AI](https://docs.google.com/presentation/d/1dKf9l3JTdssQXnSpVuIboeOEqy9rVFIqIfidVvdiB_g/edit) for more details and concrete ideas for expanding this, in order to make it actually useful.

For the _Thread of Agreement_, [Polis](https://github.com/compdemocracy/polis) can be seen as a solution which already exists, though right now, no actual collaboration has been established yet.

Apart from the technological developments, we are currently working on reaching out to global leaders in various domains, starting with AI safety and philanthropy. See [#3](https://github.com/hermesloom/hermesloom/issues/3) for the ongoing progress on this.

## Setup

1. Install Node.js >= 20
2. `cp .env.template .env` and insert the respective keys
3. `npm install`
4. `npm run dev`

## Co-creation

Please contact synergies@henophilia.org for collaboration and co-creation.

## License

[Unlicense](https://unlicense.org/)

# Build a functional, responsive Chinese-language web MVP called:

“Bay Eco Detective —...

Build a functional, responsive Chinese-language web MVP called:

“Bay Eco Detective — Shenzhen Bay Interactive Science Map”

IMPORTANT: The user interface and all public-facing content must be in Simplified Chinese, even though this prompt is written in English.

1. Product concept

This is an interactive environmental science map for Shenzhen Bay.

It is not a standard navigation map or a static environmental education website. It should combine:

- Real locations

- Historical changes

- Environmental data layers

- Location-based stories

- Public participation tasks

The product should help users actively explore environmental evidence instead of passively reading educational content.

Core tagline:

“一张能探索、会讲故事、还能参与保护的深圳湾生态地图。”

Meaning:

“A Shenzhen Bay ecological map that users can explore, that tells stories, and that enables public participation in conservation.”

Core user journey:

Choose a location → Compare changes → Understand the causes → Take action

Prioritize a realistic and demonstrable MVP. Do not add universal AI recognition, complex social features, hardware sensors, or coverage of the entire city.

2. Project background

The project is proposed by the Shenzhen Luyuan Environmental Protection Volunteers Association, a local environmental NGO involved in coastal wetland restoration, ecological conservation, public education, and environmental monitoring.

The organization has accumulated:

- 14 years of mangrove restoration experience

- 8 mangrove restoration sites

- 30 monitored drainage outlets around Shenzhen Bay

- Water-environment monitoring data from 2015 to 2025

- Project materials about mangroves, water quality, biodiversity, and public participation

The product should transform information currently scattered across reports, spreadsheets, and project documents into interactive public-facing map stories.

There is no complete production database or API yet. Use realistic mock data and keep the data layer separate from the interface so that real APIs can replace it later.

3. Target users

A. Students and families

They explore real locations, discover stories about mangroves, water quality, and biodiversity, and complete short educational activities.

B. Volunteers and members of the public

They explore observation routes, document environmental conditions, upload photographs, and submit public observation records.

C. Schools and nature-education organizations

They use themed routes, location stories, and task cards to organize outdoor environmental education activities.

4. Core MVP feature: interactive map

The homepage should immediately open to an interactive map of Shenzhen Bay.

The map should display:

- Shenzhen Bay coastline

- Mangrove areas

- Restoration sites

- Drainage outlets

- Public observation tasks

- Selected locations

- A clear map legend

The map must support:

- Zooming and panning

- Clicking map markers

- Highlighting the selected location

- Layer switching

- Location search

- A “Return to Shenzhen Bay” button

- Responsive desktop and mobile layouts

Use Mapbox, MapLibre, Leaflet, or another suitable mapping solution.

If a map provider requires an API key, store it as an environment variable. Provide a usable fallback if no key is available.

5. Three environmental data layers

Layer 1: Mangrove restoration

Show:

- Site name

- Restoration year

- Restoration area

- Number of planted mangroves

- Survival rate

- Current condition

- Environmental risk factors

- Before-and-after image placeholders

Create at least 8 realistic mock restoration sites.

Educational question:

“Why can similar mangrove planting projects produce different survival rates?”

Layer 2: Drainage outlets and water quality

Show:

- Outlet name and ID

- Monitoring year

- Water-quality condition

- Whether the outlet currently has water

- Important indicators

- Risk level

- Historical trend

Create at least 30 realistic mock drainage outlets.

Include an example environmental story based on the project materials:

- Water-quality compliance increased from 53.3% to 96.7%

- However, many drainage outlets were recorded as dry

- Users should understand that improved indicators do not necessarily mean that ecological dynamics have fully recovered

Clearly label these values as example project data.

Layer 3: Public observation tasks

Examples:

- Photograph mangrove growth

- Record water color

- Observe birds or other wildlife

- Document shoreline waste

- Report unusual drainage

- Complete a location-based science quiz

Each task should include:

- Task title

- Location

- Difficulty

- Estimated duration

- Instructions

- Safety notes

- Submission button

- Completion status

6. Historical timeline

Add a horizontal timeline covering 2015–2025 at the bottom of the map.

When the user changes the year:

- Map-marker status should update

- Location details should update

- Water-quality information should update

- Mangrove restoration conditions should update

- Important events for that year should appear

- Trend charts should reflect the selected year

Include:

- Play

- Pause

- Reset

- Manual year selection

At least 3–5 locations must visibly change across the timeline. The timeline must drive real interface changes and should not be decorative.

7. Location story panel

When a user selects a map point, open a location story panel on the right.

On mobile, display it as a bottom sheet.

The panel should contain:

- Location name

- Location image

- Location category

- Short introduction

- Key environmental data

- Small trend chart

- “What happened?”

- “Why did it happen?”

- “Why does it matter?”

- “What can the public do?”

- Related public task

Use concise, accessible Chinese copy. It should sound like a nature educator explaining environmental evidence to the public, not like an academic paper.

8. Themed exploration route

Create one functional demonstration route called:

“深圳湾生态变化侦探路线”

English meaning:

“Shenzhen Bay Ecological Change Detective Route”

Include 4–5 locations.

Each stop should answer one core question, such as:

- Why do mangrove survival rates differ?

- Does improved water quality always mean ecological recovery?

- Why might a drainage outlet remain dry?

- How can one public photograph contribute to conservation?

- How can visitors reduce disturbance to wetlands?

The route should include:

- Start-route button

- Highlighted route markers

- Current-stop indicator

- Progress display

- Next-stop action

- Completion state

9. Public observation submission

Create a lightweight observation form with:

- Task selection

- Automatic or manual location selection

- Observation date

- Photo upload

- Observation category

- Short description

- Water color or environmental condition

- “Did you notice anything unusual?” field

- Optional contact details

- Privacy and authenticity confirmation

- Submit button

After submission, show this Chinese confirmation:

“感谢你的观察。这条记录将在审核后用于生态保护和公众科普。”

Do not present unreviewed public submissions as verified scientific conclusions.

The MVP may store submissions in local state, local storage, Supabase, or a mock database.

10. Educational tasks and badges

Add lightweight participation incentives without turning the experience into a children’s game.

Include:

- Location-based questions

- Route completion status

- Task completion status

- “湾区观察员” badge

- “水环境侦探” badge

- “红树林守护者” badge

- Personal exploration history

Badges should encourage participation. Do not add leaderboards, competitive rankings, virtual currency, or a rewards shop.

11. Required pages and views

Create at least:

1. Main interactive map

2. Location story details

3. Themed exploration route

4. Public task list

5. Observation submission form

6. Personal exploration history

7. About the project and data notes

The homepage must prioritize the map. Do not begin with a large marketing hero section that hides the product.

Users should immediately understand that they can:

- Click locations

- Change layers

- Move the timeline

- Start an exploration route

12. Visual direction

The design should feel like a combination of:

- A modern natural-history museum exhibit

- A credible civic-technology product

- An environmental education platform

- A contemporary interactive map

The visual tone should be:

- Professional

- Ecological

- Trustworthy

- Calm

- Exploratory

- Modern but not futuristic

Suggested colors:

- Deep navy: #062936

- Ecological teal: #0B8F91

- Mangrove green: #67A85B

- Coral orange: #FF6B4A

- Warm cream: #F7F3EA

- Pale ecological green: #E8F4F1

- Dark text: #082F3A

Design rules:

- Make the map the primary visual element

- Maintain clear information hierarchy

- Use cards only where necessary

- Use legible Simplified Chinese typography

- Use clean line icons

- Use subtle, natural transitions

- Avoid neon colors and cyberpunk styling

- Avoid heavy glassmorphism

- Avoid a dense admin-dashboard appearance

- Avoid excessive rounded cards

- Ensure sufficient contrast and basic accessibility

13. Navigation

Top navigation should include:

- 探索地图

- 主题路线

- 公众任务

- 我的记录

- 关于项目

The map view should provide:

- Layer controls

- Search

- Legend

- Timeline

- Recenter control

- Location story panel

14. Mock data structure

Create clean mock JSON or TypeScript data.

Location fields:

- id

- name

- type

- longitude

- latitude

- summary

- story

- image

- restorationYear

- restorationArea

- plantedCount

- survivalRate

- waterStatus

- riskLevel

- annualData

- relatedTasks

Annual-data fields:

- year

- waterQuality

- waterFlow

- mangroveCoverage

- survivalRate

- observationCount

- event

Task fields:

- id

- title

- locationId

- category

- difficulty

- duration

- description

- instructions

- safetyNotes

- status

- badge

The mock data must drive map markers, filters, the timeline, trend charts, and location details. Do not build a static visual prototype.

15. Technical preferences

Recommended stack:

- React

- TypeScript

- Tailwind CSS

- MapLibre, Mapbox, or Leaflet

- Recharts or another lightweight chart library

- Lucide Icons

- Supabase, if appropriate

Development requirements:

- Component-based architecture

- Separate mock data from UI components

- Responsive desktop and mobile layouts

- Loading states

- Empty states

- Error states

- Functional controls

- No dead buttons

- No payment system

- No administrator dashboard

- No real AI model

- No live government-data integration

- No hardware-sensor integration

If Supabase is used, create the required tables and seed data.

If no database is used, implement all important interactions with local mock data and local storage.

16. Required interactions

- Changing a layer must update map markers and the legend

- Changing the year must update map data and the story panel

- Clicking a location must focus the map and open its story

- Starting a route must highlight route locations

- Completing a task must update the exploration history and badges

- Submitting an observation must display the review notice

- Exploration progress should persist after a page refresh when possible

- On mobile, the map must remain the main interface and details should use a bottom sheet

17. Explicit MVP exclusions

Do not implement:

- Coverage of the entire city of Shenzhen

- Complex social networking

- Real-time AI species recognition

- Universal image recognition

- Hardware-sensor integration

- Live environmental monitoring APIs

- Leaderboards

- Payment features

- A large administration system

18. MVP success criteria

A first-time user should be able to:

1. Find and open one ecological location

2. Change at least one data layer

3. Use the timeline to discover one environmental change

4. understand one possible cause of that change

5. Complete one educational question or public task

The interface should make these actions understandable without requiring a separate instruction manual.

19. Implementation order

Please build the product in this order:

1. Create the visual system and main page structure

2. Implement the map and three data layers

3. Connect the timeline to annual data

4. Implement the location story panel

5. Implement the themed exploration route

6. Implement public tasks and observation submission

7. Implement exploration history and badges

8. Add responsive behavior, empty states, and error states

9. Test every button and interaction

Deliver a complete, runnable classroom-demo MVP.

Do not create only a landing page. Do not expand the scope beyond the requirements.

If map-provider limitations prevent a fully live map, use an open-source basemap or a functional simulated map so the core layer, timeline, location, route, and task interactions still work.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da2a0674-1625-4d31-be36-07cb74b4ef10).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

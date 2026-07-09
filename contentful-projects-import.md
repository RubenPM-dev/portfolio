# Projects to import into Contentful

Extracted from the old site (`rubenpoveda.com`: `SpotOn.html`, `TaxiSharing.html`,
`salesApp.html`). These are early prototype / academic projects (2019–2020).

Each project below lists every field of the `project` content type. Image fields
(`heroImage`, `heroSmall`, `gallery`, `heroAlt`, `heroCaption`) are intentionally
omitted — add those in Contentful directly.

> **Please review before importing** — I inferred `role`, `company`, `teamSize`,
> `featuredOrder`, and `legalCaption` since the old pages didn't state them. Adjust
> to taste. `features` are optional (they drive the phone-showcase captions and only
> render when a gallery is attached) — included in case you want them later.

---

## 1. SpotOn

| Field | Value |
|---|---|
| **title** | SpotOn |
| **slug** | spoton |
| **excerpt** | A location-based hospitality reviewing app that curbs fake reviews by verifying users were actually at the venue. |
| **role** | Mobile Developer & UX Designer |
| **company** | Personal Project |
| **teamSize** | 1 |
| **technologies** | React Native, Expo, JavaScript, Firebase, Sketch, InVision, Facebook Login, Google Sign-In |
| **challenges** | Reduce fraudulent reviews in hospitality venues without adding friction for genuine users. The app had to confirm a user is — or recently was — physically at an establishment before allowing a review, while still working as an engaging discovery and social platform. |
| **contributions** | • Gathered and analysed user requirements.<br>• Planned and modelled the solution following an AgileUX methodology.<br>• Designed and prototyped the UI/UX with Sketch and InVision.<br>• Designed and implemented the database on Firebase.<br>• Built the cross-platform app with React Native and Expo. |
| **outcome** | A working cross-platform prototype that geolocates users against venue locations to validate reviews, surfaces nearby businesses on a map with ratings and details, and lays the groundwork for a hospitality-focused social network. |
| **links.website** | *(none)* |
| **featuredOrder** | 3 |
| **legalCaption** | Concept project shown for portfolio purposes only. |

**features** (optional):
- **Location-verified reviews** — Confirms the user is or was at the venue before a review is allowed.
- **Nearby venue map** — Shows surrounding businesses with descriptions, ratings, reviews, and contacts.
- **Social layer** — Share location, media, and messages, and create events to drive engagement.

---

## 2. TaxiSharing

| Field | Value |
|---|---|
| **title** | TaxiSharing |
| **slug** | taxisharing |
| **excerpt** | A prototype taxi-sharing app that lets students split rides in areas where platforms like Uber aren't available. |
| **role** | Mobile Developer |
| **company** | Academic Project |
| **teamSize** | 1 |
| **technologies** | Apache Cordova (PhoneGap), JavaScript, HTML, CSS, OpenStack, RESTful APIs |
| **challenges** | Give Open University students a way to share taxis in regions with no ride-hailing coverage. The app needed to match riders by overlapping time windows and pick-up/drop-off areas, then connect them to arrange a shared trip. |
| **contributions** | • Designed and built the cross-platform prototype with Cordova (PhoneGap).<br>• Implemented ride offer/request matching on time frame and pick-up/drop-off area.<br>• Added match notifications and in-app communication to coordinate rides.<br>• Integrated a RESTful API layer against a student-credentials database hosted on an OpenStack instance. |
| **outcome** | A functioning prototype where students post or accept rides, get notified when their time and area requirements match, and communicate to order and share a taxi. |
| **links.website** | *(none)* |
| **featuredOrder** | 4 |
| **legalCaption** | Concept project shown for portfolio purposes only. |

**features** (optional):
- **Ride matching** — Matches riders on overlapping time frames and pick-up/drop-off areas.
- **Match notifications** — Alerts users when a compatible ride is found.
- **In-app coordination** — Lets matched riders message to arrange the trip.

---

## 3. Mobile Sales App

| Field | Value |
|---|---|
| **title** | Mobile Sales App |
| **slug** | mobile-sales-app |
| **excerpt** | A cross-platform BYOD sales app giving field teams real-time stock, order capture, and a map of past sales. |
| **role** | Mobile Developer |
| **company** | Academic Project |
| **teamSize** | 1 |
| **technologies** | Apache Cordova (PhoneGap), JavaScript, HTML, CSS, RESTful APIs, Google Maps API |
| **challenges** | Build a Bring-Your-Own-Device (BYOD) sales tool that runs natively enough on both Android and iOS, giving a sales team live stock data, order capture, and geographic visibility of where sales were made. |
| **contributions** | • Developed a single cross-platform app for Android and iOS with Cordova (PhoneGap).<br>• Built salesperson login and real-time stock retrieval (image and quantity) via RESTful APIs.<br>• Implemented order capture from live inventory.<br>• Added a Google Map plotting each sale, with client details on pin tap.<br>• Integrated a cloud-based backend storing stock, credentials, and client data. |
| **outcome** | A prototype that lets salespeople log in from any major mobile platform, pull live stock, build orders, and view every sale on a map with drill-down to client details. |
| **links.website** | *(none)* |
| **featuredOrder** | 5 |
| **legalCaption** | Concept project shown for portfolio purposes only. |

**features** (optional):
- **Real-time stock** — Live product image and quantity pulled from the backend.
- **Order capture** — Add items straight from current inventory into an order.
- **Sales map** — Google Map pins for each sale, tap a pin for client details.

---

## JSON (same data, for quick reference / scripted import)

```json
[
  {
    "title": "SpotOn",
    "slug": "spoton",
    "excerpt": "A location-based hospitality reviewing app that curbs fake reviews by verifying users were actually at the venue.",
    "role": "Mobile Developer & UX Designer",
    "company": "Personal Project",
    "teamSize": 1,
    "technologies": ["React Native", "Expo", "JavaScript", "Firebase", "Sketch", "InVision", "Facebook Login", "Google Sign-In"],
    "challenges": "Reduce fraudulent reviews in hospitality venues without adding friction for genuine users. The app had to confirm a user is — or recently was — physically at an establishment before allowing a review, while still working as an engaging discovery and social platform.",
    "contributions": [
      "Gathered and analysed user requirements.",
      "Planned and modelled the solution following an AgileUX methodology.",
      "Designed and prototyped the UI/UX with Sketch and InVision.",
      "Designed and implemented the database on Firebase.",
      "Built the cross-platform app with React Native and Expo."
    ],
    "outcome": "A working cross-platform prototype that geolocates users against venue locations to validate reviews, surfaces nearby businesses on a map with ratings and details, and lays the groundwork for a hospitality-focused social network.",
    "featuredOrder": 3,
    "features": [
      { "heading": "Location-verified reviews", "body": "Confirms the user is or was at the venue before a review is allowed." },
      { "heading": "Nearby venue map", "body": "Shows surrounding businesses with descriptions, ratings, reviews, and contacts." },
      { "heading": "Social layer", "body": "Share location, media, and messages, and create events to drive engagement." }
    ],
    "legalCaption": "Concept project shown for portfolio purposes only."
  },
  {
    "title": "TaxiSharing",
    "slug": "taxisharing",
    "excerpt": "A prototype taxi-sharing app that lets students split rides in areas where platforms like Uber aren't available.",
    "role": "Mobile Developer",
    "company": "Academic Project",
    "teamSize": 1,
    "technologies": ["Apache Cordova (PhoneGap)", "JavaScript", "HTML", "CSS", "OpenStack", "RESTful APIs"],
    "challenges": "Give Open University students a way to share taxis in regions with no ride-hailing coverage. The app needed to match riders by overlapping time windows and pick-up/drop-off areas, then connect them to arrange a shared trip.",
    "contributions": [
      "Designed and built the cross-platform prototype with Cordova (PhoneGap).",
      "Implemented ride offer/request matching on time frame and pick-up/drop-off area.",
      "Added match notifications and in-app communication to coordinate rides.",
      "Integrated a RESTful API layer against a student-credentials database hosted on an OpenStack instance."
    ],
    "outcome": "A functioning prototype where students post or accept rides, get notified when their time and area requirements match, and communicate to order and share a taxi.",
    "featuredOrder": 4,
    "features": [
      { "heading": "Ride matching", "body": "Matches riders on overlapping time frames and pick-up/drop-off areas." },
      { "heading": "Match notifications", "body": "Alerts users when a compatible ride is found." },
      { "heading": "In-app coordination", "body": "Lets matched riders message to arrange the trip." }
    ],
    "legalCaption": "Concept project shown for portfolio purposes only."
  },
  {
    "title": "Mobile Sales App",
    "slug": "mobile-sales-app",
    "excerpt": "A cross-platform BYOD sales app giving field teams real-time stock, order capture, and a map of past sales.",
    "role": "Mobile Developer",
    "company": "Academic Project",
    "teamSize": 1,
    "technologies": ["Apache Cordova (PhoneGap)", "JavaScript", "HTML", "CSS", "RESTful APIs", "Google Maps API"],
    "challenges": "Build a Bring-Your-Own-Device (BYOD) sales tool that runs natively enough on both Android and iOS, giving a sales team live stock data, order capture, and geographic visibility of where sales were made.",
    "contributions": [
      "Developed a single cross-platform app for Android and iOS with Cordova (PhoneGap).",
      "Built salesperson login and real-time stock retrieval (image and quantity) via RESTful APIs.",
      "Implemented order capture from live inventory.",
      "Added a Google Map plotting each sale, with client details on pin tap.",
      "Integrated a cloud-based backend storing stock, credentials, and client data."
    ],
    "outcome": "A prototype that lets salespeople log in from any major mobile platform, pull live stock, build orders, and view every sale on a map with drill-down to client details.",
    "featuredOrder": 5,
    "features": [
      { "heading": "Real-time stock", "body": "Live product image and quantity pulled from the backend." },
      { "heading": "Order capture", "body": "Add items straight from current inventory into an order." },
      { "heading": "Sales map", "body": "Google Map pins for each sale, tap a pin for client details." }
    ],
    "legalCaption": "Concept project shown for portfolio purposes only."
  }
]
```

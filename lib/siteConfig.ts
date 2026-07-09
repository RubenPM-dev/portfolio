import type {
  About,
  Contact,
  Experience,
  MediaImage,
  Project,
  Settings,
  Skills,
} from "@/lib/contentful/types";

export const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.vercel.app";

export const fallbackSettings: Settings = {
  sys: { id: "settings-fallback", type: "Entry", contentType: { sys: { id: "settings" } } },
  fields: {
    siteTitle: "Ruben Poveda",
    siteDescription:
      "Senior iOS Engineer crafting high-scale real-time product experiences with Swift and SwiftUI.",
    ogTitle: "Ruben Poveda · Senior iOS Engineer",
    ogDescription:
      "Editorial portfolio showcasing large-scale mobile product engineering, real-time systems, and release ownership.",
    socialLinks: [
      { label: "LinkedIn", url: "https://linkedin.com/in/rubenpoveda" },
      { label: "Email", url: "mailto:contact.rubenpm@gmail.com" },
    ],
  },
};

export const fallbackAbout: About = {
  sys: { id: "about-fallback", type: "Entry", contentType: { sys: { id: "about" } } },
  fields: {
    heading: "Building product-grade mobile systems for real-time moments.",
    story:
      "I design and ship iOS experiences where correctness, speed, and product feel matter simultaneously. At Electronic Arts, I work on fan-facing products used by millions, balancing architecture quality with release velocity.",
    philosophy:
      "Great mobile products are systems, not screens. My focus is reliable state, resilient concurrency, and interfaces that remain calm under peak load.",
    journey: [
      { year: 2020, event: "Joined EA/Codemasters", description: "Grew from associate engineer to senior." },
      { year: 2023, event: "Led high-impact initiatives", description: "Social and realtime initiatives across mobile and web." },
      { year: 2025, event: "Senior ownership", description: "Release quality, architecture direction, and mentorship." },
    ],
  },
};

export const fallbackProjects: Project[] = [
  {
    sys: { id: "project-1", type: "Entry", contentType: { sys: { id: "project" } } },
    fields: {
      title: "Realtime Social Platform",
      slug: "realtime-social-platform",
      excerpt:
        "Comments, threaded replies, and reactions with optimistic updates and deterministic reconciliation.",
      role: "Senior iOS Engineer",
      company: "Electronic Arts",
      teamSize: 8,
      technologies: ["Swift 6", "SwiftUI", "Ably", "SignalR", "AsyncStream"],
      challenges: 
        "Ensure live state correctness under rapidly changing match conditions. Prevent stale events from overwriting newer local or server states.",
      contributions: [
        "Designed optimistic update and rollback flows with stale-event rejection.",
        "Shipped reusable realtime primitives for comments, reactions, and thread updates.",
        "Implemented deterministic state convergence strategy covered by contract tests.",
      ],
      outcome:
        "Delivered reliable realtime interaction at scale, improving user trust in live social moments.",
      links: {
        website: "https://www.ea.com",
      },
      featuredOrder: 1,
      features: [
        { heading: "Optimistic Updates", body: "Immediate UI feedback with rollback on failure." },
        { heading: "Deterministic Reconciliation", body: "Ensures consistent state across clients." }
      ],
      legalCaption:
        "Trademarks and screenshots are the property of Electronic Arts, shown for portfolio purposes only.",
    },
  },
  {
    sys: { id: "project-2", type: "Entry", contentType: { sys: { id: "project" } } },
    fields: {
      title: "World Cup Release 1.9.0",
      slug: "world-cup-release-1-9-0",
      excerpt:
        "Owned an end-to-end flagship release with three major features and high stability.",
      role: "Release Owner",
      company: "Electronic Arts",
      teamSize: 12,
      technologies: ["SwiftUI", "XCTest", "Instruments", "Analytics"],
      challenges: "Ship multiple high-visibility features on a fixed global event deadline. Maintain quality under elevated traffic and engagement spikes.",
      contributions: [
        "Coordinated delivery across product, design, backend, and QA.",
        "Established release risk controls and validation checkpoints.",
        "Delivered the release independently on a compressed timeline.",
      ],
      outcome:
        "Achieved ~99.8% crash-free sessions and record engagement during tournament peaks.",
      links: {
        website: "https://www.ea.com",
      },
      featuredOrder: 2,
      legalCaption:
        "Trademarks and screenshots are the property of Electronic Arts, shown for portfolio purposes only.",
    },
  },
];

export const fallbackExperiences: Experience[] = [
  {
    sys: { id: "exp-1", type: "Entry", contentType: { sys: { id: "experience" } } },
    fields: {
      title: "Senior Software Engineer",
      company: "Electronic Arts (Codemasters)",
      period: "Mar 2020 - Present",
      summary:
        "Built high-scale iOS features for millions of sports fans, owning architecture and release quality.",
      highlights: [
        "Designed modular CLEAN architecture across Core, Domain, Data, and Presentation.",
        "Owned roughly 75% of app releases on a two-week cadence.",
        "Mentored engineers and improved AI-assisted development workflows.",
      ],
      orderRank: 1,
    },
  },
  {
    sys: { id: "exp-2", type: "Entry", contentType: { sys: { id: "experience" } } },
    fields: {
      title: "Lead React Native Engineer",
      company: "Electronic Arts",
      period: "2020 - 2023",
      summary:
        "Lead developer for iOS and Android apps with around 920K active users.",
      highlights: [
        "Delivered secure OAuth/PKCE native-web architecture.",
        "Owned app architecture, features, and store releases end to end.",
        "Improved product retention with mobile-first execution.",
      ],
      orderRank: 2,
    },
  },
];

export const fallbackSkills: Skills = {
  sys: { id: "skills-fallback", type: "Entry", contentType: { sys: { id: "skills" } } },
  fields: {
    heading: "Capability Map",
    description:
      "A systems view of strengths across product engineering, architecture, and reliable delivery.",
    groups: [
      {
        title: "Realtime & Concurrency",
        items: [
          { name: "Actor-based architecture", level: 5, note: "Swift 6 strict concurrency" },
          { name: "Live state reconciliation", level: 5, note: "Optimistic UI + rollback" },
          { name: "SignalR / Ably integration", level: 4 },
        ],
      },
      {
        title: "Architecture & Quality",
        items: [
          { name: "Modular CLEAN architecture", level: 5 },
          { name: "MVVM + coordinator patterns", level: 5 },
          { name: "XCTest and contract testing", level: 4 },
        ],
      },
      {
        title: "Product Delivery",
        items: [
          { name: "Release ownership", level: 5 },
          { name: "Analytics instrumentation", level: 4 },
          { name: "Cross-functional collaboration", level: 5 },
        ],
      },
    ],
  },
};

export const fallbackContact: Contact = {
  sys: { id: "contact-fallback", type: "Entry", contentType: { sys: { id: "contact" } } },
  fields: {
    heading: "Let us build something enduring.",
    description:
      "Open to senior iOS opportunities and product-engineering roles in high-scale systems.",
    email: "contact.rubenpm@gmail.com",
    location: "Spain / EU Remote",
  },
};

export const fallbackPhotography: MediaImage[] = [];

// Image/Asset types
export interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      contentType: string;
    };
  };
}

export interface ContentfulImage {
  sys: {
    id: string;
    type: "Link";
    linkType: "Asset";
  };
}

// Content types
export interface Kicker {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "hero";
      };
    };
  };
  fields: {
    kicker: string;
    headline: string;
    subhead: string;
    ctaWork: string;
    ctaContact: string;
  };
}

export interface Project {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "project";
      };
    };
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    heroImage?: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    heroSmall?: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    heroAlt?: string;
    heroCaption?: string;
    gallery?: Array<{
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    }>;
    role: string;
    company: string;
    teamSize?: number;
    technologies?: string[];
    challenges?: string[];
    contributions?: string[];
    outcome: string;
    links?: {
      website?: string;
      appStore?: string;
      googlePlay?: string;
    };
    featuredOrder?: number;
    features?: { heading: string; body: string }[];
    legalCaption: string;
  };
}

export interface Experience {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "experience";
      };
    };
  };
  fields: {
    title: string;
    company: string;
    period: string;
    summary: string;
    highlights?: string[];
    image?: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    orderRank?: number;
  };
}

export interface SkillItem {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface SkillGroup {
  title: string;
  items: SkillItem[];
}

export interface Skills {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "skills";
      };
    };
  };
  fields: {
    heading: string;
    description: string;
    groups: SkillGroup[];
  };
}

export interface Journey {
  year: number;
  event: string;
  description: string;
}

export interface About {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "about";
      };
    };
  };
  fields: {
    heading: string;
    story: string;
    philosophy: string;
    journey: Journey[];
    portrait?: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
  };
}

export interface Contact {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "contact";
      };
    };
  };
  fields: {
    heading: string;
    description: string;
    email: string;
    location: string;
  };
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Settings {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "settings";
      };
    };
  };
  fields: {
    siteTitle: string;
    siteDescription: string;
    ogTitle?: string;
    ogDescription?: string;
    socialLinks?: SocialLink[];
  };
}

export interface MediaImage {
  sys: {
    id: string;
    type: "Entry";
    contentType: {
      sys: {
        id: "mediaImage";
      };
    };
  };
  fields: {
    title: string;
    category: "photography" | "work" | "portrait";
    image: {
      sys: {
        id: string;
      };
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
  };
}

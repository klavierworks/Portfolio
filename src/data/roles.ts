export type Role = {
  title: string;
  description: string;
  link: string | undefined;
  date: Date;
  niceDate?: string;
};

type JsonRole = Omit<Role, 'date'> & {
  date: string;
};

export const roles: JsonRole[] = [
  {
    title: "Random Studio",
    description: "Creative Tech Lead",
    link: "https://random.studio/",
    date: '2025-10-01',
    niceDate: '2025-',
  },
  {
    title: "Klavierworks",
    description: "Consultant",
    link: "https://klavier.works",
    date: '2024-01-01',
    niceDate: '2024-',
  },
  {
    title: "Random Studio",
    description: "Lead",
    link: "https://random.studio/",
    date: '2020-01-01',
    niceDate: '2020-24',
  },
  {
    title: "Black Eye Project",
    description: "Developer",
    link: "https://theblackeyeproject.co.uk/",
    date: '2017-01-01',
    niceDate: '2017-24',
  },
  {
    title: "Crack in the Road",
    description: "Founder",
    link: "https://crackintheroad.com/",
    date: '2010-01-01',
    niceDate: '2010-17',
  },
];

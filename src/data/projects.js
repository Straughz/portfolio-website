const projectsUnsorted = [
    {
        title: 'Bandola Brews',
        description:
            'Craft coffee brand — coming-soon positioning, identity direction, and launch-ready web shell.',
        category: 'Web Design',
        status: 'Coming Soon',
        color: 'linear-gradient(135deg, #1a2a30 0%, #254540 50%, #2a5548 100%)',
        publishedAt: '2026-04-10',
        caseStudy: {
            problem: 'A specialty coffee brand needed anticipation and a clear story before products hit the market.',
            solution: 'We are shaping brand and web around the launch narrative — landing experience, signup path, and visual system aligned to the final product.',
            result: 'Coming soon — live brand and site to follow at launch.',
        },
    },
    {
        title: 'Notary Journal',
        description:
            'Digital notary log — secure records, search, and compliance-oriented UX for mobile notaries.',
        category: 'Web Design',
        status: 'In Development',
        color: 'linear-gradient(135deg, #0f1a24 0%, #1a3040 50%, #1e3a4a 100%)',
        publishedAt: '2026-04-08',
        caseStudy: {
            problem: 'Paper logs create audit risk and friction for notaries working across locations.',
            solution: 'We are building a focused product flow: fast entry, searchable history, and export-friendly formatting.',
            result: 'In development — shipping toward a closed beta.',
        },
    },
    {
        title: 'Save Our Kids America',
        description:
            'Demo site from prospect conversations — working toward a full engagement; nonprofit story, impact, and donation-oriented layout.',
        category: 'Prospect',
        href: 'https://save-our-kids-america.vercel.app/',
        color: 'linear-gradient(135deg, #0c1a24 0%, #152d3e 50%, #1a3d50 100%)',
        publishedAt: '2026-03-22',
        caseStudy: {
            problem: 'We are pursuing nonprofit-sector work and need a credible example that shows mission, impact, and conversion patterns.',
            solution: 'Built as a full demo with mission, impact, and donate flows to support sales conversations.',
            result: 'Live demo while we work toward bringing this prospect into a formal engagement.',
        },
    },
    {
        title: 'Compassion Care & Transport Services',
        description:
            'Demo site from prospect outreach — working toward a full engagement; senior transport and care positioning.',
        category: 'Prospect',
        href: 'https://compassion-care-website.vercel.app/',
        color: 'linear-gradient(135deg, #0f1e26 0%, #1a3540 50%, #1d4550 100%)',
        publishedAt: '2026-01-18',
        caseStudy: {
            problem: 'We are pursuing local healthcare-transport work and need a trust-first example tailored to that market.',
            solution: 'Built as a demo: services, FAQs, geography, and proof patterns typical of NEMT and care sites.',
            result: 'Live demo while we work toward bringing this prospect into a formal engagement.',
        },
    },
];

export const allProjects = [...projectsUnsorted].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

export const graphicDesignProjects = allProjects.filter(p => p.category === 'Graphic Design');
export const webDesignProjects = allProjects.filter(p => p.category === 'Web Design');
export const prospectProjects = allProjects.filter(p => p.category === 'Prospect');

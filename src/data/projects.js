const projectsUnsorted = [
    {
        title: 'Compassion Care & Transport Services',
        description:
            'Senior support and medical transport — services, testimonials, FAQs, and Sacramento-area care positioning.',
        category: 'Web Design',
        href: 'https://compassion-care-website.vercel.app/',
        color: 'linear-gradient(135deg, #0f1e26 0%, #1a3540 50%, #1d4550 100%)',
        publishedAt: '2026-01-18',
        caseStudy: {
            problem: 'A growing NEMT provider had no online presence and relied entirely on word-of-mouth referrals, limiting their reach across Sacramento County.',
            solution: 'We designed a trust-first website with clear service breakdowns, an FAQ section addressing compliance questions, and prominent testimonials from families.',
            result: 'The business gained a credible digital storefront that supports inbound inquiries and positions them as the professional choice in their market.',
        },
    },
    {
        title: 'Save Our Kids America',
        description:
            'Nonprofit community site — mission, impact, donate and booking flows for schools and supporters.',
        category: 'Web Design',
        href: 'https://save-our-kids-america.vercel.app/',
        color: 'linear-gradient(135deg, #0c1a24 0%, #152d3e 50%, #1a3d50 100%)',
        publishedAt: '2026-03-22',
        caseStudy: {
            problem: 'The organization needed a digital hub to communicate their mission, accept donations, and let schools book programs — all in one place.',
            solution: 'We built a story-driven site with integrated donation and booking flows, impact statistics, and a clear call to action on every page.',
            result: 'Supporters and schools can now engage with the organization online, reducing admin overhead and expanding their community reach.',
        },
    },
    {
        title: 'Bandola Brews',
        description:
            'Craft coffee brand — coming-soon landing page, brand identity, and e-commerce-ready design system.',
        category: 'Web Design',
        status: 'Coming Soon',
        color: 'linear-gradient(135deg, #1a2a30 0%, #254540 50%, #2a5548 100%)',
        publishedAt: '2026-04-10',
        caseStudy: {
            problem: 'A new specialty coffee brand needed to build anticipation and capture early interest before their official product launch.',
            solution: 'We crafted a warm, tactile brand identity and a coming-soon page designed to collect email signups and tell the founder\'s story.',
            result: 'Launch pending — the brand is positioned to convert early interest into first-day customers.',
        },
    },
    {
        title: 'Notary Journal',
        description:
            'Digital notary log application — secure record-keeping, search, and compliance tracking for mobile notaries.',
        category: 'Web Design',
        status: 'In Development',
        color: 'linear-gradient(135deg, #0f1a24 0%, #1a3040 50%, #1e3a4a 100%)',
        publishedAt: '2026-04-08',
        caseStudy: {
            problem: 'Mobile notaries track sessions on paper, risking lost records and compliance gaps during audits.',
            solution: 'We are building a secure digital journal with searchable entries, client signatures, and automatic compliance formatting.',
            result: 'In development — designed to eliminate paperwork and give notaries audit-ready records in seconds.',
        },
    },
    {
        title: 'Nexus Vantage Group',
        description:
            'Our own studio portfolio — brand identity, design system, and performance-optimized Next.js build.',
        category: 'Brand Strategy',
        status: 'Live',
        color: 'linear-gradient(135deg, #0a1218 0%, #12222a 50%, #1a3038 100%)',
        publishedAt: '2026-03-01',
        caseStudy: {
            problem: 'We needed a portfolio that practices what we preach — fast load times, clear positioning, and a premium feel.',
            solution: 'Built on Next.js 15 with Framer Motion, a custom design token system, and agency-level messaging from day one.',
            result: 'The site itself serves as proof of capability for every client conversation.',
        },
    },
    {
        title: 'Local Service Business Template',
        description:
            'Reusable web template for local service companies — SEO-ready, mobile-first, and built for lead capture.',
        category: 'Web Design',
        status: 'Concept',
        color: 'linear-gradient(135deg, #101a22 0%, #1a2e38 50%, #14283a 100%)',
        publishedAt: '2026-02-15',
        caseStudy: {
            problem: 'Many local businesses share the same needs — credibility, lead capture, and local SEO — but custom builds are expensive.',
            solution: 'We are designing a high-quality template system that delivers 80% of a custom site at a fraction of the cost and timeline.',
            result: 'Concept phase — this template will become a productized offering for rapid client onboarding.',
        },
    },
];

export const allProjects = [...projectsUnsorted].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

export const graphicDesignProjects = allProjects.filter(p => p.category === 'Graphic Design');
export const webDesignProjects = allProjects.filter(p => p.category === 'Web Design');

export const HOME_FEATURED_LIMIT = 6;
export const homeFeaturedProjects = allProjects.slice(0, HOME_FEATURED_LIMIT);

const projectsUnsorted = [
    {
        title: 'Cokpit',
        description: 'A pre-launch desktop app for running and supervising AI coding agent sessions side by side in one workspace.',
        category: 'Products',
        status: 'In progress',
        href: 'https://cokpit.dev',
        color: 'linear-gradient(135deg, #0f1a24 0%, #1a3040 50%, #1e3a4a 100%)',
        publishedAt: '2026-10-01',
        caseStudy: {
            problem: 'AI coding agent sessions need a shared workspace for side-by-side supervision.',
            solution: 'I am building a desktop app to run and supervise those sessions together.',
            result: 'In progress, pre-launch.',
        },
    },
    {
        title: 'The UPS Store #4507 website',
        description: 'A local UPS Store website with a customer file-upload portal for print orders, plus staff tools behind login.',
        category: 'Client work',
        status: 'Live',
        href: 'https://lofa4507.com',
        color: 'linear-gradient(135deg, #0f1e26 0%, #1a3540 50%, #1d4550 100%)',
        publishedAt: '2026-03-01',
        caseStudy: {
            problem: 'Customers need to send files for print orders.',
            solution: 'I built a website with a customer file-upload portal, plus staff tools behind login.',
            result: 'The website is live.',
        },
    },
    {
        title: 'The UPS Store #4507 customer kiosk',
        description: 'A self-service customer PC with timed plans paid by card, being piloted in store.',
        category: 'Client work',
        status: 'In progress',
        color: 'linear-gradient(135deg, #0c1a24 0%, #152d3e 50%, #1a3d50 100%)',
        publishedAt: '2026-09-01',
        caseStudy: {
            problem: 'Customers need timed access to a self-service PC.',
            solution: 'I built a customer PC with timed plans paid by card.',
            result: 'In progress, being piloted in store.',
        },
    },
    {
        title: 'Bandola Brews',
        description: 'A website for a coffee shop, live since July 2026.',
        category: 'Client work',
        status: 'Live',
        href: 'https://bandolabrews.com',
        color: 'linear-gradient(135deg, #1a2a30 0%, #254540 50%, #2a5548 100%)',
        publishedAt: '2026-07-01',
        caseStudy: {
            problem: 'A coffee shop needed a website.',
            solution: 'I built the Bandola Brews website.',
            result: 'Live since July 2026.',
        },
    },
    {
        title: 'Compassion Care & Transport Services',
        description: 'A website rebuild for a care and transport provider.',
        category: 'Client work',
        status: 'In progress',
        color: 'linear-gradient(135deg, #0f1e26 0%, #1a3540 50%, #1d4550 100%)',
        publishedAt: '2026-07-15',
        caseStudy: {
            problem: 'A care and transport provider needs its website rebuilt.',
            solution: 'I am rebuilding the website.',
            result: 'In progress.',
        },
    },
    {
        title: 'NVG Voice',
        description: 'A Windows push-to-talk dictation app I built and use daily.',
        category: 'Products',
        status: 'Studio tool',
        color: 'linear-gradient(135deg, #0f1a24 0%, #1a3040 50%, #1e3a4a 100%)',
        publishedAt: '2026-10-04',
        caseStudy: {
            problem: 'I use push-to-talk dictation daily on Windows.',
            solution: 'I built NVG Voice for dictation.',
            result: 'Studio tool I use daily.',
        },
    },
];

export const allProjects = [...projectsUnsorted].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

export const graphicDesignProjects = allProjects.filter(p => p.category === 'Graphic Design');
export const webDesignProjects = allProjects.filter(p => p.category === 'Client work');
export const prospectProjects = allProjects.filter(p => p.category === 'Products');

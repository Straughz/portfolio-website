export const allProjects = [
    {
        title: 'Compassion Care & Transport Services',
        description:
            'Senior support and medical transport — services, testimonials, FAQs, and Sacramento-area care positioning.',
        category: 'Web Design',
        href: 'https://compassion-care-website.vercel.app/',
        color: 'linear-gradient(135deg, #1a2332 0%, #243449 50%, #2d4a5c 100%)',
    },
    {
        title: 'Save Our Kids America',
        description:
            'Nonprofit community site — mission, impact, donate and booking flows for schools and supporters.',
        category: 'Web Design',
        href: 'https://save-our-kids-america.vercel.app/',
        color: 'linear-gradient(135deg, #0f1728 0%, #1a2744 50%, #152238 100%)',
    },
];

export const graphicDesignProjects = allProjects.filter(p => p.category === 'Graphic Design');
export const webDesignProjects = allProjects.filter(p => p.category === 'Web Design');

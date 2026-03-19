export const allProjects = [
    // Graphic Design Projects
    {
        title: 'Luxury Brand Identity',
        description: 'Complete visual identity system for a high-end lifestyle brand, including logo, typography, and collateral.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        title: 'Restaurant Marketing Suite',
        description: 'Complete print and digital marketing package including menu design, social media, and promotional materials.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 50%, #1a1a2e 100%)',
    },
    {
        title: 'Festival Poster Series',
        description: 'Eye-catching poster designs for an annual music festival, blending typography, color, and illustration.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #11001c 100%)',
    },
    {
        title: 'Product Packaging Design',
        description: 'Premium packaging design for a wellness brand, combining clean aesthetics with shelf appeal.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a2a1a 0%, #1f3d2d 50%, #0d2818 100%)',
    },
    {
        title: 'Corporate Stationery Set',
        description: 'Professional stationery suite including business cards, letterheads, and envelopes for a consulting firm.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #2a1a1a 0%, #3d1f1f 50%, #281010 100%)',
    },
    {
        title: 'Social Media Campaign',
        description: 'Cohesive social media visual campaign for a fitness brand across Instagram, Facebook, and LinkedIn.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a1a30 0%, #252550 50%, #101040 100%)',
    },

    // Web Design Projects
    {
        title: 'E-Commerce Platform',
        description: 'Modern, conversion-focused online store built with seamless user experience and responsive design.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #243447 100%)',
    },
    {
        title: 'SaaS Dashboard',
        description: 'Clean, intuitive dashboard interface for a project management platform with data visualization.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
    },
    {
        title: 'Portfolio Website',
        description: 'Sleek personal portfolio with smooth interactions and animated transitions for a photographer.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    },
    {
        title: 'Real Estate Platform',
        description: 'Property listing platform with map integration, search filtering, and virtual tour capabilities.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0f1923 0%, #152238 50%, #1a3050 100%)',
    },
    {
        title: 'Health & Wellness App',
        description: 'User-focused web application for tracking fitness goals, meal plans, and wellness routines.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0a1a14 0%, #102820 50%, #183828 100%)',
    },
    {
        title: 'Creative Agency Website',
        description: 'Bold, animated website for a creative agency showcasing their team, process, and portfolio.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #1a0a20 0%, #2a1040 50%, #180828 100%)',
    },
];

export const graphicDesignProjects = allProjects.filter(p => p.category === 'Graphic Design');
export const webDesignProjects = allProjects.filter(p => p.category === 'Web Design');

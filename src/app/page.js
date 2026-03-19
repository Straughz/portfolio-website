import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import ServicesSection from '@/components/ServicesSection';
import ContactCTA from '@/components/ContactCTA';
import styles from './page.module.css';

const featuredProjects = [
    {
        title: 'Luxury Brand Identity',
        description: 'Complete visual identity system for a high-end lifestyle brand, including logo, typography, and collateral.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        title: 'E-Commerce Platform',
        description: 'Modern, conversion-focused online store built with seamless user experience and responsive design.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #243447 100%)',
    },
    {
        title: 'Restaurant Marketing Suite',
        description: 'Complete print and digital marketing package including menu design, social media, and promotional materials.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 50%, #1a1a2e 100%)',
    },
    {
        title: 'SaaS Dashboard',
        description: 'Clean, intuitive dashboard interface for a project management platform with data visualization.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
    },
    {
        title: 'Festival Poster Series',
        description: 'Eye-catching poster designs for an annual music festival, blending typography, color, and illustration.',
        category: 'Graphic Design',
        color: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #11001c 100%)',
    },
    {
        title: 'Portfolio Website',
        description: 'Sleek personal portfolio with smooth interactions and animated transitions for a photographer.',
        category: 'Web Design',
        color: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    },
];

export default function Home() {
    return (
        <>
            <Hero />

            {/* Featured Projects */}
            <section className={`${styles.featuredSection} section`}>
                <div className="container">
                    <div className={styles.featuredHeader}>
                        <div className={styles.featuredHeaderText}>
                            <span className={styles.featuredLabel}>Selected Works</span>
                            <h2 className={styles.featuredTitle}>
                                Featured <span className="gradient-text">Projects</span>
                            </h2>
                        </div>
                        <Link href="/projects" className={styles.featuredViewAll}>
                            View All Projects →
                        </Link>
                    </div>
                    <div className={styles.projectsGrid}>
                        {featuredProjects.map((project, i) => (
                            <ProjectCard key={i} {...project} />
                        ))}
                    </div>
                </div>
            </section>

            <ServicesSection />
            <ContactCTA />
        </>
    );
}

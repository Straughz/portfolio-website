import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import ServicesSection from '@/components/ServicesSection';
import ContactCTA from '@/components/ContactCTA';
import { homeFeaturedProjects } from '@/data/projects';
import styles from './page.module.css';

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
                        {homeFeaturedProjects.map((project, i) => (
                            <ProjectCard key={`${project.title}-${i}`} {...project} />
                        ))}
                    </div>
                </div>
            </section>

            <ServicesSection />
            <ContactCTA />
        </>
    );
}

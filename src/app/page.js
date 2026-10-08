import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects, prospectProjects } from '@/data/projects';
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
                            <span className={styles.featuredLabel}>Selected work</span>
                            <h2 className={styles.featuredTitle}>
                                Featured <span className="gradient-text">Projects</span>
                            </h2>
                        </div>
                        <Link href="/projects" className={styles.featuredViewAll}>
                            View All Projects →
                        </Link>
                    </div>
                    <h3 className={styles.featuredSectionTitle}>Client work</h3>
                    <p className={styles.featuredSectionIntro}>
                        Websites and customer-facing software I build for local businesses.
                    </p>
                    <div className={styles.projectsGrid}>
                        {webDesignProjects.map((project, i) => (
                            <ProjectCard key={`pipeline-${project.title}-${i}`} {...project} />
                        ))}
                    </div>

                    <h3 className={styles.featuredSectionTitle}>My own products</h3>
                    <p className={styles.featuredSectionIntro}>
                        Software I build for my own work and for other builders.
                    </p>
                    <div className={styles.projectsGrid}>
                        {prospectProjects.map((project, i) => (
                            <ProjectCard key={`prospect-${project.title}-${i}`} {...project} />
                        ))}
                    </div>
                </div>
            </section>

            <ServicesSection />
            <ProcessSection />
            <ContactCTA />
        </>
    );
}

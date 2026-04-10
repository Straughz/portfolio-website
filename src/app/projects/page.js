import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects, prospectProjects } from '@/data/projects';
import styles from './page.module.css';

export const metadata = {
    title: 'Projects – Nexus Vantage Group',
    description: 'Pipeline work, prospect demos, and design projects by Nexus Vantage Group.',
};

export default function Projects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        All <span className="gradient-text">Projects</span>
                    </h1>
                    <p className={styles.pageDescription}>
                        Pipeline work in motion, plus prospect demos we are working to bring under contract.
                    </p>
                </div>

                <div className={styles.filterTabs}>
                    <Link href="/projects" className={`${styles.filterTab} ${styles.filterTabActive}`}>
                        All Projects
                    </Link>
                    <Link href="/projects/graphic-design" className={styles.filterTab}>
                        Graphic Design
                    </Link>
                    <Link href="/projects/web-design" className={styles.filterTab}>
                        Web Design
                    </Link>
                    <Link href="/projects/prospect" className={styles.filterTab}>
                        Prospect
                    </Link>
                </div>

                <h2 className={styles.projectsSectionTitle}>Pipeline</h2>
                <p className={styles.projectsSectionIntro}>
                    Active web work — coming soon or in development.
                </p>
                <div className={styles.projectsGrid}>
                    {webDesignProjects.map((project, i) => (
                        <ProjectCard key={`pipeline-${i}`} {...project} />
                    ))}
                </div>

                <h2 className={styles.projectsSectionTitle}>Prospect</h2>
                <p className={styles.projectsSectionIntro}>
                    Demos from outreach — still working to get these engagements across the line.
                </p>
                <div className={styles.projectsGrid}>
                    {prospectProjects.map((project, i) => (
                        <ProjectCard key={`prospect-${i}`} {...project} />
                    ))}
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

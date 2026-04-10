import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { prospectProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Prospect Work – Nexus Vantage Group',
    description:
        'Demo sites and outreach work in progress — not retained client engagements until signed.',
};

export default function ProspectProjects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        <span className="gradient-text">Prospect</span> work
                    </h1>
                    <p className={styles.pageDescription}>
                        Demos built from outreach — we are still working to convert these into full engagements.
                        Open a live demo in a new tab when a link is available.
                    </p>
                </div>

                <div className={styles.filterTabs}>
                    <Link href="/projects" className={styles.filterTab}>
                        All Projects
                    </Link>
                    <Link href="/projects/graphic-design" className={styles.filterTab}>
                        Graphic Design
                    </Link>
                    <Link href="/projects/web-design" className={styles.filterTab}>
                        Web Design
                    </Link>
                    <Link href="/projects/prospect" className={`${styles.filterTab} ${styles.filterTabActive}`}>
                        Prospect
                    </Link>
                </div>

                <div className={styles.projectsGrid}>
                    {prospectProjects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

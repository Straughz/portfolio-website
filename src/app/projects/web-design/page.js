import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Web Design Projects – Nexus Vantage Group',
    description:
        'Live web design work by Nexus Vantage Group — shipped sites for clients and organizations.',
};

export default function WebDesignProjects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        <span className="gradient-text">Web Design</span> Work
                    </h1>
                    <p className={styles.pageDescription}>
                        Selected live sites — click a card to open the project in a new tab.
                    </p>
                </div>

                <div className={styles.filterTabs}>
                    <Link href="/projects" className={styles.filterTab}>
                        All Projects
                    </Link>
                    <Link href="/projects/graphic-design" className={styles.filterTab}>
                        Graphic Design
                    </Link>
                    <Link href="/projects/web-design" className={`${styles.filterTab} ${styles.filterTabActive}`}>
                        Web Design
                    </Link>
                </div>

                <div className={styles.projectsGrid}>
                    {webDesignProjects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

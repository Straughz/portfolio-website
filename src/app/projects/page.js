import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { allProjects } from '@/data/projects';
import styles from './page.module.css';

export const metadata = {
    title: 'Projects – Nexus Vantage Group',
    description: 'Browse graphic design, web design, and brand strategy projects by Nexus Vantage Group.',
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
                        Brand, web, and strategy work for service businesses. Click any live project to view it.
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
                </div>

                <div className={styles.projectsGrid}>
                    {allProjects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

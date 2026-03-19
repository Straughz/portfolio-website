import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { allProjects } from '@/data/projects';
import styles from './page.module.css';

export const metadata = {
    title: 'Projects – Kavish Singh | Nexus Vantage Group',
    description: 'Explore the portfolio of Kavish Singh. Browse graphic design and web design projects by Nexus Vantage Group.',
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
                        A curated collection of my work across graphic design and web design.
                        Each project represents a unique challenge and creative solution.
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

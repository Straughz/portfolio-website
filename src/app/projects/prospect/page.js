import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { prospectProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Products',
    description:
        'Software products and studio tools built by Kavish Singh.',
};

export default function ProspectProjects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        <span className="gradient-text">My</span> Products
                    </h1>
                    <p className={styles.pageDescription}>
                        Software I build for my own work and for other builders.
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
                        Client Work
                    </Link>
                    <Link href="/projects/prospect" className={`${styles.filterTab} ${styles.filterTabActive}`}>
                        Products
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

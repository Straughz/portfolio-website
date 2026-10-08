import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Client Work',
    description:
        'Websites and customer-facing software by Kavish Singh for local businesses.',
};

export default function WebDesignProjects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        <span className="gradient-text">Client</span> Work
                    </h1>
                    <p className={styles.pageDescription}>
                        Websites and customer-facing software I build for local businesses.
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
                        Client Work
                    </Link>
                    <Link href="/projects/prospect" className={styles.filterTab}>
                        Products
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

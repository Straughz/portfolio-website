import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects, prospectProjects } from '@/data/projects';
import styles from './page.module.css';

export const metadata = {
    title: 'Projects',
    description: 'Client websites and apps, plus software products by Kavish Singh.',
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
                        Client work and software products I build.
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
                        Client Work
                    </Link>
                    <Link href="/projects/prospect" className={styles.filterTab}>
                        Products
                    </Link>
                </div>

                <h2 className={styles.projectsSectionTitle}>Client work</h2>
                <p className={styles.projectsSectionIntro}>
                    Websites and customer-facing software I build for local businesses.
                </p>
                <div className={styles.projectsGrid}>
                    {webDesignProjects.map((project, i) => (
                        <ProjectCard key={`pipeline-${i}`} {...project} />
                    ))}
                </div>

                <h2 className={styles.projectsSectionTitle}>Products</h2>
                <p className={styles.projectsSectionIntro}>
                    Software I build for my own work and for other builders.
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

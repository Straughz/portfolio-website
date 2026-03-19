import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { graphicDesignProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Graphic Design Projects – Kavish Singh | Nexus Vantage Group',
    description: 'Browse graphic design projects by Kavish Singh. Brand identities, marketing materials, print design, and visual systems.',
};

export default function GraphicDesignProjects() {
    return (
        <div className={styles.projectsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portfolio</span>
                    <h1 className={styles.pageTitle}>
                        <span className="gradient-text">Graphic Design</span> Work
                    </h1>
                    <p className={styles.pageDescription}>
                        Brand identities, marketing materials, print design, and visual systems
                        crafted with attention to detail and creative excellence.
                    </p>
                </div>

                <div className={styles.filterTabs}>
                    <Link href="/projects" className={styles.filterTab}>
                        All Projects
                    </Link>
                    <Link href="/projects/graphic-design" className={`${styles.filterTab} ${styles.filterTabActive}`}>
                        Graphic Design
                    </Link>
                    <Link href="/projects/web-design" className={styles.filterTab}>
                        Web Design
                    </Link>
                </div>

                <div className={styles.projectsGrid}>
                    {graphicDesignProjects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

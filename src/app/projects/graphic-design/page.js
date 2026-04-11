import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { graphicDesignProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Graphic Design',
    description: 'Brand identities, marketing materials, print design, and visual systems by Nexus Vantage Group.',
};

export default function GraphicDesignProjects() {
    const hasProjects = graphicDesignProjects.length > 0;

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
                    <Link href="/projects/prospect" className={styles.filterTab}>
                        Prospect
                    </Link>
                </div>

                {hasProjects ? (
                    <div className={styles.projectsGrid}>
                        {graphicDesignProjects.map((project, i) => (
                            <ProjectCard key={i} {...project} />
                        ))}
                    </div>
                ) : (
                    <p className={styles.emptyState}>
                        No graphic design projects are listed yet. If you&rsquo;d like to work together, use the contact
                        section below.
                    </p>
                )}
            </div>

            <ContactCTA />
        </div>
    );
}

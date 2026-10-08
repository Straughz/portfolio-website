import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { graphicDesignProjects } from '@/data/projects';
import styles from '../page.module.css';

export const metadata = {
    title: 'Graphic Design',
    description: 'Brand and print design work by Kavish Singh.',
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
                        I also do brand and print design. Project examples are being added.
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
                        Client Work
                    </Link>
                    <Link href="/projects/prospect" className={styles.filterTab}>
                        Products
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
                        Print and brand work is being added.
                    </p>
                )}
            </div>

            <ContactCTA />
        </div>
    );
}

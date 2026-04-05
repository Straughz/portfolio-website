import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ContactCTA from '@/components/ContactCTA';
import { webDesignProjects } from '@/data/projects';
import { webOfferings } from '@/data/webOfferings';
import styles from '../page.module.css';

export const metadata = {
    title: 'Web Design Projects – Kavish Singh | Nexus Vantage Group',
    description: 'Browse web design projects by Kavish Singh. Modern websites, dashboards, e-commerce platforms, and web applications.',
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
                        Modern websites, dashboards, e-commerce platforms, and web applications
                        built with cutting-edge technology and stunning design.
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

                <div className={styles.offeringsBlock}>
                    <div className={styles.offeringsHeader}>
                        <h2 className={styles.offeringsTitle}>Websites I can build</h2>
                        <p className={styles.offeringsSubtitle}>
                            Types of sites and products I take on — tailored to your goals, audience, and brand.
                        </p>
                    </div>
                    <div className={styles.projectsGrid}>
                        {webOfferings.map((item, i) => (
                            <ProjectCard key={`offering-${i}`} {...item} />
                        ))}
                    </div>
                </div>

                <div className={styles.sectionDivider} aria-hidden />

                <div className={styles.sectionHeading}>
                    <span className={styles.sectionHeadingLabel}>Portfolio</span>
                    <h2 className={styles.sectionHeadingTitle}>Live sites &amp; style examples</h2>
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

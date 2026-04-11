import GlowingCard from '@/components/GlowingCard';
import ContactCTA from '@/components/ContactCTA';
import styles from './page.module.css';

export const metadata = {
    title: 'About',
    description: 'Meet the team behind Nexus Vantage Group. Led by Kavish Singh — building brand and web systems that drive trust and growth for service businesses.',
};

const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '30+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
];

const skillIcons = {
    design: (
        <svg className={styles.skillGroupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="13.5" r="2.5"/>
            <path d="M12 12l6 6M7 7l5 5"/><circle cx="18" cy="18" r="2"/>
        </svg>
    ),
    code: (
        <svg className={styles.skillGroupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
    ),
    ruler: (
        <svg className={styles.skillGroupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
    ),
    rocket: (
        <svg className={styles.skillGroupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
    ),
};

const skillGroups = [
    {
        icon: skillIcons.design,
        title: 'Design Tools',
        skills: ['Photoshop', 'Illustrator', 'Figma', 'InDesign', 'After Effects', 'XD'],
    },
    {
        icon: skillIcons.code,
        title: 'Web Technologies',
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'WordPress', 'Responsive Design'],
    },
    {
        icon: skillIcons.ruler,
        title: 'Design Skills',
        skills: ['Brand Identity', 'Typography', 'Layout Design', 'Color Theory', 'UI/UX', 'Print Design'],
    },
    {
        icon: skillIcons.rocket,
        title: 'Business',
        skills: ['Project Management', 'Client Relations', 'Brand Strategy', 'Marketing', 'Consulting'],
    },
];

export default function About() {
    return (
        <div className={styles.aboutPage}>
            <div className="container">
                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>About Us</span>
                    <h1 className={styles.pageTitle}>
                        Meet <span className="gradient-text">Nexus Vantage Group</span>
                    </h1>
                    <p className={styles.pageDescription}>
                        Led by Kavish Singh — we build brand and web systems that
                        help service businesses earn trust and grow.
                    </p>
                </div>

                {/* About Grid */}
                <div className={styles.aboutGrid}>
                    <GlowingCard alwaysOn>
                        <div className={styles.aboutImage}>
                            <span className={styles.aboutImagePlaceholder}>KS</span>
                            <div className={styles.aboutImageBorder} />
                        </div>
                    </GlowingCard>

                    <div className={styles.aboutContent}>
                        <div className={styles.aboutBio}>
                            <h3>Our Story</h3>
                            <p>
                                Nexus Vantage Group started with a simple conviction: service businesses
                                deserve the same caliber of design and digital strategy that Fortune 500
                                companies take for granted.
                            </p>
                            <p>
                                Our approach combines strategic thinking with aesthetic excellence — every project
                                is an opportunity to push boundaries and deliver work that not only looks stunning
                                but achieves real results. From brand identities to full-scale web platforms, we
                                bring the same level of dedication and creativity to every engagement.
                            </p>
                            <p>
                                We stay sharp by exploring emerging creative tools, tracking design trends,
                                and finding inspiration in art, architecture, and the businesses we serve.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className={styles.statsGrid}>
                            {stats.map((stat, i) => (
                                <GlowingCard key={i}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stat.number}</div>
                                        <div className={styles.statLabel}>{stat.label}</div>
                                    </div>
                                </GlowingCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className={styles.skillsSection}>
                    <h2 className={styles.skillsTitle}>
                        Skills & <span className="gradient-text">Tools</span>
                    </h2>
                    <div className={styles.skillsGrid}>
                        {skillGroups.map((group, i) => (
                            <GlowingCard key={i}>
                                <div className={styles.skillGroup}>
                                    <h3 className={styles.skillGroupTitle}>
                                        {group.icon} {group.title}
                                    </h3>
                                    <div className={styles.skillTags}>
                                        {group.skills.map((skill, j) => (
                                            <span key={j} className={styles.skillTag}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </GlowingCard>
                        ))}
                    </div>
                </div>
            </div>

            <ContactCTA />
        </div>
    );
}

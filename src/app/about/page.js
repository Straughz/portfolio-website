import GlowingCard from '@/components/GlowingCard';
import ContactCTA from '@/components/ContactCTA';
import styles from './page.module.css';

export const metadata = {
    title: 'About – Nexus Vantage Group',
    description: 'Meet the team behind Nexus Vantage Group. Led by Kavish Singh — building brand and web systems that drive trust and growth for service businesses.',
};

const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '30+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
];

const skillGroups = [
    {
        icon: '🎨',
        title: 'Design Tools',
        skills: ['Photoshop', 'Illustrator', 'Figma', 'InDesign', 'After Effects', 'XD'],
    },
    {
        icon: '💻',
        title: 'Web Technologies',
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'WordPress', 'Responsive Design'],
    },
    {
        icon: '📐',
        title: 'Design Skills',
        skills: ['Brand Identity', 'Typography', 'Layout Design', 'Color Theory', 'UI/UX', 'Print Design'],
    },
    {
        icon: '🚀',
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
                                        <span>{group.icon}</span> {group.title}
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

import GlowingCard from '@/components/GlowingCard';
import ContactCTA from '@/components/ContactCTA';
import styles from './page.module.css';

export const metadata = {
    title: 'About – Kavish Singh | Nexus Vantage Group',
    description: 'Learn more about Kavish Singh, founder of Nexus Vantage Group. Graphic designer, web designer, and brand strategist.',
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
                    <span className={styles.pageLabel}>Get to Know Me</span>
                    <h1 className={styles.pageTitle}>
                        About <span className="gradient-text">Kavish Singh</span>
                    </h1>
                    <p className={styles.pageDescription}>
                        Founder of Nexus Vantage Group — passionate about creating visual experiences
                        that connect brands with their audience.
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
                            <h3>The Journey</h3>
                            <p>
                                I&apos;m a graphic and web designer with a passion for creating beautiful,
                                functional digital experiences. As the founder of Nexus Vantage Group, I work
                                with businesses and individuals to bring their creative visions to life.
                            </p>
                            <p>
                                My approach combines strategic thinking with aesthetic excellence — every project
                                is an opportunity to push boundaries and deliver work that not only looks stunning
                                but achieves real results. From brand identities to full-scale web platforms, I
                                bring the same level of dedication and creativity to every project.
                            </p>
                            <p>
                                When I&apos;m not designing, you&apos;ll find me exploring new creative tools,
                                staying on top of design trends, and finding inspiration in art, architecture,
                                and the world around me.
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

import Link from 'next/link';
import BackgroundPaths from './BackgroundPaths';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            <BackgroundPaths />

            {/* Ambient glow */}
            <div className={`${styles.heroAmbient} ${styles.heroAmbientGold}`} />
            <div className={`${styles.heroAmbient} ${styles.heroAmbientGreen}`} />

            <div className={styles.heroContent}>
                <div className={styles.heroText}>
                    <span className={styles.heroLabel}>Digital Growth Partner</span>
                    <h1 className={styles.heroTitle}>
                        We Build Brands
                        <span className={styles.heroTitleGradient}>That Convert</span>
                        &amp; Scale
                    </h1>
                    <p className={styles.heroDescription}>
                        Nexus Vantage Group — led by Kavish Singh — designs brand
                        and web systems that drive trust, credibility, and qualified
                        leads for service businesses.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/projects" className={styles.heroCta}>
                            See Our Work <span className={styles.heroCtaArrow}>→</span>
                        </Link>
                        <Link href="/about" className={styles.heroSecondary}>
                            About Us
                        </Link>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.heroGlobe}>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroCenter}>
                            <img src="/logo-mark.png" alt="Nexus Vantage Group" className={styles.heroCenterLogo} />
                        </div>
                        {/* Floating badges */}
                        <div className={`${styles.heroBadge} ${styles.heroBadgeDesign}`}>
                            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="13.5" r="2.5"/>
                                <path d="M12 12l6 6M7 7l5 5"/><circle cx="18" cy="18" r="2"/>
                            </svg>
                            Graphic Design
                        </div>
                        <div className={`${styles.heroBadge} ${styles.heroBadgeWeb}`}>
                            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                            </svg>
                            Web Design
                        </div>
                        <div className={`${styles.heroBadge} ${styles.heroBadgeBrand}`}>
                            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Brand Identity
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <div className={styles.scrollLine}></div>
                <span className={styles.scrollText}>Scroll</span>
            </div>
        </section>
    );
}

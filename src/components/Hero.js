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
                            <img src="/logo.png" alt="Nexus Vantage Group" className={styles.heroCenterLogo} />
                        </div>
                        {/* Floating badges */}
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeIcon}>🎨</span> Graphic Design
                        </div>
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeIcon}>💻</span> Web Design
                        </div>
                        <div className={styles.heroBadge}>
                            <span className={styles.badgeIcon}>✨</span> Brand Identity
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

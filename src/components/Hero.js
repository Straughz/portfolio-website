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
                    <span className={styles.heroLabel}>Graphic &amp; Web Designer</span>
                    <h1 className={styles.heroTitle}>
                        Crafting Digital
                        <span className={styles.heroTitleGradient}>Experiences</span>
                        That Inspire
                    </h1>
                    <p className={styles.heroDescription}>
                        Hi, I&apos;m Kavish Singh — founder of Nexus Vantage Group.
                        I transform ideas into stunning visual identities and immersive web
                        experiences that captivate audiences and elevate brands.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/projects" className={styles.heroCta}>
                            View My Work <span className={styles.heroCtaArrow}>→</span>
                        </Link>
                        <Link href="/about" className={styles.heroSecondary}>
                            About Me
                        </Link>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.heroGlobe}>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroRing}></div>
                        <div className={styles.heroCenter}>
                            <span className={styles.heroCenterText}>NVG</span>
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

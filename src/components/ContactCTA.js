import styles from './ContactCTA.module.css';

export default function ContactCTA() {
    return (
        <section className={`${styles.cta} section`}>
            <div className={`${styles.ctaGlow} ${styles.ctaGlowGold}`} />
            <div className={`${styles.ctaGlow} ${styles.ctaGlowGreen}`} />
            <div className={`container ${styles.ctaInner}`}>
                <span className={styles.ctaLabel}>Let&apos;s Collaborate</span>
                <h2 className={styles.ctaTitle}>
                    Let&apos;s <span className={styles.ctaEmoji}>✦</span> Create<br />
                    <span className="gradient-text">Great Things.</span>
                </h2>
                <p className={styles.ctaDescription}>
                    Have a project in mind? I&apos;d love to help bring your vision to life.
                    Let&apos;s discuss how we can work together.
                </p>
                <a href="mailto:kavish@nexusvantagegroup.com" className={styles.ctaButton}>
                    Drop me a line <span className={styles.ctaArrow}>→</span>
                </a>
            </div>
        </section>
    );
}

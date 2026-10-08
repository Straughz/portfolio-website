import Link from 'next/link';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
    return (
        <section className={`${styles.cta} section`}>
            <div className={`${styles.ctaGlow} ${styles.ctaGlowGold}`} />
            <div className={`${styles.ctaGlow} ${styles.ctaGlowGreen}`} />
            <div className={`container ${styles.ctaInner}`}>
                <span className={styles.ctaLabel}>Get in touch</span>
                <h2 className={styles.ctaTitle}>
                    Have a <span className={styles.ctaEmoji}>✦</span> Project<br />
                    <span className="gradient-text">In Mind?</span>
                </h2>
                <p className={styles.ctaDescription}>
                    Tell me what you need built or designed. I&apos;ll take a look and reply.
                </p>
                <Link href="/contact?intent=conversation" className={styles.ctaButton}>
                    Start a Conversation <span className={styles.ctaArrow}>→</span>
                </Link>
            </div>
        </section>
    );
}

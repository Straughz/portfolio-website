import Link from 'next/link';
import GlowingCard from './GlowingCard';
import styles from './ProcessSection.module.css';

const steps = [
    {
        number: '01',
        title: 'Discovery',
        description:
            'We learn your business, audience, and goals. A short strategy call gives us everything we need to move with clarity.',
    },
    {
        number: '02',
        title: 'Strategy',
        description:
            'We map out positioning, site structure, and brand direction — so every design decision ties back to a business outcome.',
    },
    {
        number: '03',
        title: 'Build',
        description:
            'Design, development, and content come together in focused sprints. You review progress at every milestone.',
    },
    {
        number: '04',
        title: 'Launch & Optimize',
        description:
            'We go live, monitor performance, and refine. Your project is built to grow — not just to ship.',
    },
];

export default function ProcessSection() {
    return (
        <section className={`${styles.process} section`} id="process">
            <div className="container">
                <div className={styles.processHeader}>
                    <span className={styles.processLabel}>How We Work</span>
                    <h2 className={styles.processTitle}>
                        A Clear Path to <span className="gradient-text">Results</span>
                    </h2>
                    <p className={styles.processSubtitle}>
                        No guesswork, no scope creep — just a proven process that
                        takes your project from idea to measurable impact.
                    </p>
                </div>
                <div className={styles.processGrid}>
                    {steps.map((step) => (
                        <GlowingCard key={step.number}>
                            <div className={styles.stepCard}>
                                <span className={styles.stepNumber}>{step.number}</span>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                        </GlowingCard>
                    ))}
                </div>
                <div className={styles.processCta}>
                    <Link href="/contact?intent=strategy" className={styles.processButton}>
                        Book a Strategy Call <span className={styles.processArrow}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

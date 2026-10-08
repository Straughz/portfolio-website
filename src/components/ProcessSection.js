import Link from 'next/link';
import GlowingCard from './GlowingCard';
import styles from './ProcessSection.module.css';

const steps = [
    {
        number: '01',
        title: 'Discovery',
        description:
            'I ask about your business, the people using the work, and what you need it to do.',
    },
    {
        number: '02',
        title: 'Strategy',
        description:
            'I outline the scope and structure before design and development begin.',
    },
    {
        number: '03',
        title: 'Build',
        description:
            'I design and build the agreed work, then share it for your review.',
    },
    {
        number: '04',
        title: 'Launch and upkeep',
        description:
            'I launch the finished work and handle upkeep when it is part of the project.',
    },
];

export default function ProcessSection() {
    return (
        <section className={`${styles.process} section`} id="process">
            <div className="container">
                <div className={styles.processHeader}>
                    <span className={styles.processLabel}>How I work</span>
                    <h2 className={styles.processTitle}>
                        From Brief to <span className="gradient-text">Launch</span>
                    </h2>
                    <p className={styles.processSubtitle}>
                        I scope the work, build it, and share it with you before launch.
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
                        Talk About a Project <span className={styles.processArrow}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

import GlowingCard from './GlowingCard';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ title, description, category, image, color, href, status, caseStudy }) {
    const card = (
            <div className={styles.card}>
                <div className={styles.cardImage}>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            background: color || 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                        }}
                    >
                        {image ? (
                            <img src={image} alt={title} />
                        ) : (
                            <span style={{ opacity: 0.3, fontSize: '4rem' }}>✦</span>
                        )}
                    </div>
                    <div className={styles.cardImageOverlay} />
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                        <span className={styles.cardCategory}>{category}</span>
                        {status && (
                            <span className={`${styles.cardStatus} ${styles[`status${status.replace(/\s+/g, '')}`] || ''}`}>
                                {status}
                            </span>
                        )}
                    </div>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.cardDescription}>{description}</p>
                    {caseStudy && (
                        <div className={styles.caseStudy}>
                            <div className={styles.caseStudyItem}>
                                <span className={styles.caseStudyLabel}>Problem</span>
                                <p>{caseStudy.problem}</p>
                            </div>
                            <div className={styles.caseStudyItem}>
                                <span className={styles.caseStudyLabel}>Solution</span>
                                <p>{caseStudy.solution}</p>
                            </div>
                            <div className={styles.caseStudyItem}>
                                <span className={styles.caseStudyLabel}>Result</span>
                                <p>{caseStudy.result}</p>
                            </div>
                        </div>
                    )}
                </div>
                {href && <div className={styles.cardArrow}>↗</div>}
            </div>
    );

    return (
        <GlowingCard>
            {href ? (
                <a
                    href={href}
                    className={styles.cardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {card}
                </a>
            ) : (
                card
            )}
        </GlowingCard>
    );
}

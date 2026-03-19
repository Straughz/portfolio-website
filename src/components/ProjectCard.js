import GlowingCard from './GlowingCard';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ title, description, category, image, color }) {
    return (
        <GlowingCard>
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
                    <span className={styles.cardCategory}>{category}</span>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.cardDescription}>{description}</p>
                </div>
                <div className={styles.cardArrow}>↗</div>
            </div>
        </GlowingCard>
    );
}

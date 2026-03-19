import styles from './GlowingCard.module.css';

export default function GlowingCard({ children, className = '', alwaysOn = false }) {
    const classes = [
        styles.glowCard,
        alwaysOn ? styles.glowCardAlwaysOn : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <div className={styles.cardInner}>
                {children}
            </div>
        </div>
    );
}

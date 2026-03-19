import styles from './BackgroundPaths.module.css';

export default function BackgroundPaths() {
    return (
        <div className={styles.backgroundPaths}>
            <svg className={styles.pathSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                {/* Sweeping golden curve - top */}
                <path
                    className={styles.path}
                    d="M-100,200 C200,100 400,350 700,250 S1100,200 1540,350"
                />
                {/* Green flowing curve - middle */}
                <path
                    className={styles.path}
                    d="M-50,450 C150,350 350,550 650,400 S950,500 1500,380"
                />
                {/* Subtle gold arc - upper */}
                <path
                    className={styles.path}
                    d="M0,120 C300,50 600,300 900,180 S1200,100 1440,220"
                />
                {/* Green diagonal sweep */}
                <path
                    className={styles.path}
                    d="M-100,600 C200,500 500,700 800,550 S1100,650 1540,500"
                />
                {/* Fine gold detail line */}
                <path
                    className={styles.path}
                    d="M200,800 C400,700 600,850 900,700 S1200,750 1440,680"
                />
                {/* Ambient green glow path */}
                <path
                    className={styles.path}
                    d="M-50,50 C250,150 500,50 750,200 S1100,100 1440,150"
                />
            </svg>
        </div>
    );
}

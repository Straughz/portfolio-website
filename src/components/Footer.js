import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.footerBrand}>
                    <Link href="/" className={styles.footerLogo}>
                        <img src="/logo-mark.png" alt="Nexus Vantage Group" className={styles.footerLogoImage} />
                        <span className={styles.footerLogoAccent}>Nexus Vantage Group</span>
                    </Link>
                    <span className={styles.footerTagline}>Digital growth partner for service businesses.</span>
                </div>

                <div className={styles.footerLinks}>
                    <Link href="/" className={styles.footerLink}>Home</Link>
                    <Link href="/about" className={styles.footerLink}>About</Link>
                    <Link href="/projects" className={styles.footerLink}>Projects</Link>
                    <Link href="/projects/graphic-design" className={styles.footerLink}>Graphic Design</Link>
                    <Link href="/projects/web-design" className={styles.footerLink}>Web Design</Link>
                    <Link href="/projects/prospect" className={styles.footerLink}>Prospect</Link>
                    <Link href="/contact" className={styles.footerLink}>Contact</Link>
                </div>

                <div className={styles.footerRight}>
                    <a href="mailto:kavish@nexusvantagegroup.com" className={styles.footerEmail}>
                        kavish@nexusvantagegroup.com
                    </a>
                    <span className={styles.footerCopy}>
                        © {new Date().getFullYear()} Nexus Vantage Group. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}

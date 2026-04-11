'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const isActive = (path) => pathname === path;

    return (
        <>
            <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo} aria-label="Nexus Vantage Group — Home">
                        <img src="/logo-mark.png" alt="Nexus Vantage Group" className={styles.logoImage} />
                    </Link>

                    <div className={styles.navLinks}>
                        <Link
                            href="/"
                            className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}
                        >
                            About
                        </Link>

                        <div className={styles.dropdown}>
                            <span className={styles.dropdownTrigger}>
                                Projects <span className={styles.dropdownArrow}>▼</span>
                            </span>
                            <div className={styles.dropdownMenu}>
                                <Link href="/projects" className={styles.dropdownItem}>
                                    All Projects
                                </Link>
                                <Link href="/projects/graphic-design" className={styles.dropdownItem}>
                                    Graphic Design
                                </Link>
                                <Link href="/projects/web-design" className={styles.dropdownItem}>
                                    Web Design
                                </Link>
                                <Link href="/projects/prospect" className={styles.dropdownItem}>
                                    Prospect
                                </Link>
                            </div>
                        </div>

                        <Link href="/contact" className={styles.contactBtn}>
                            Get in Touch
                        </Link>
                    </div>

                    <button
                        className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
                <Link href="/" className={styles.mobileLink}>Home</Link>
                <Link href="/about" className={styles.mobileLink}>About</Link>
                <Link href="/projects" className={styles.mobileLink}>Projects</Link>
                <Link href="/projects/graphic-design" className={`${styles.mobileLink} ${styles.mobileSub}`}>
                    → Graphic Design
                </Link>
                <Link href="/projects/web-design" className={`${styles.mobileLink} ${styles.mobileSub}`}>
                    → Web Design
                </Link>
                <Link href="/projects/prospect" className={`${styles.mobileLink} ${styles.mobileSub}`}>
                    → Prospect
                </Link>
                <Link href="/contact" className={styles.contactBtn} style={{ fontSize: '1rem', marginTop: '1rem' }}>
                    Get in Touch
                </Link>
            </div>
        </>
    );
}

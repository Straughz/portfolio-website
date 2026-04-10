import ContactForm from '@/components/ContactForm';
import styles from './page.module.css';

export const metadata = {
    title: 'Contact – Nexus Vantage Group',
    description: 'Get in touch with Nexus Vantage Group. Tell us about your project and we\'ll get back to you within 24 hours.',
};

export default async function ContactPage({ searchParams }) {
    const { intent } = await searchParams;

    return (
        <div className={styles.contactPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Contact</span>
                    <h1 className={styles.pageTitle}>
                        Let&apos;s <span className="gradient-text">Talk</span>
                    </h1>
                    <p className={styles.pageDescription}>
                        Tell us about your project and we&apos;ll get back to you within 24 hours.
                    </p>
                </div>

                <ContactForm intent={intent} />
            </div>
        </div>
    );
}

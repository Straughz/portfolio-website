import ContactForm from '@/components/ContactForm';
import styles from './page.module.css';

export const metadata = {
    title: 'Contact',
    description: 'Contact Kavish Singh at Nexus Vantage Group about a website, app, software or design project.',
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
                        Tell me about your project. I&apos;ll reply when I can.
                    </p>
                </div>

                <ContactForm intent={intent} />
            </div>
        </div>
    );
}

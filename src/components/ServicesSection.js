import GlowingCard from './GlowingCard';
import styles from './ServicesSection.module.css';

const services = [
    {
        icon: '🎨',
        title: 'Graphic Design',
        description: 'Brand identities, logos, marketing materials, and visual systems that communicate your story with precision and beauty.',
        number: '01',
    },
    {
        icon: '💻',
        title: 'Web Design',
        description: 'Modern, responsive websites and web applications built with cutting-edge technology and stunning visual design.',
        number: '02',
    },
    {
        icon: '✨',
        title: 'Brand Strategy',
        description: 'Comprehensive brand development from concept to execution — positioning your business for maximum impact and growth.',
        number: '03',
    },
];

export default function ServicesSection() {
    return (
        <section className={`${styles.services} section`} id="services">
            <div className="container">
                <div className={styles.servicesHeader}>
                    <span className={styles.servicesLabel}>What I Do</span>
                    <h2 className={styles.servicesTitle}>
                        Services & <span className="gradient-text">Expertise</span>
                    </h2>
                </div>
                <div className={styles.servicesGrid}>
                    {services.map((service, i) => (
                        <GlowingCard key={i}>
                            <div className={styles.serviceCard}>
                                <div className={styles.serviceIcon}>{service.icon}</div>
                                <h3 className={styles.serviceTitle}>{service.title}</h3>
                                <p className={styles.serviceDesc}>{service.description}</p>
                                <span className={styles.serviceNumber}>{service.number}</span>
                            </div>
                        </GlowingCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

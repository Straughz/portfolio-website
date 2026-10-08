import GlowingCard from './GlowingCard';
import styles from './ServicesSection.module.css';

const serviceIcons = {
    graphic: (
        <svg className={styles.serviceIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="13.5" r="2.5"/>
            <path d="M12 12l6 6M7 7l5 5"/><circle cx="18" cy="18" r="2"/>
        </svg>
    ),
    web: (
        <svg className={styles.serviceIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
    ),
    brand: (
        <svg className={styles.serviceIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
};

const services = [
    {
        icon: serviceIcons.graphic,
        title: 'Brand and print',
        description: 'I design brand materials and print pieces for your business.',
        number: '01',
    },
    {
        icon: serviceIcons.web,
        title: 'Websites and customer apps',
        description: 'I build your website, then customer-facing tools when the work calls for them.',
        number: '02',
    },
    {
        icon: serviceIcons.brand,
        title: 'Internal software and care',
        description: 'I build internal software where needed and can handle deployment and upkeep.',
        number: '03',
    },
];

export default function ServicesSection() {
    return (
        <section className={`${styles.services} section`} id="services">
            <div className="container">
                <div className={styles.servicesHeader}>
                    <span className={styles.servicesLabel}>What I do</span>
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

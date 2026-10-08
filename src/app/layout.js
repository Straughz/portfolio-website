import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
    title: {
        default: 'Nexus Vantage Group',
        template: '%s | Nexus Vantage Group',
    },
    description: 'Websites, customer apps, internal software, brand and print design by Kavish Singh in Sacramento, California.',
    keywords: 'web design, customer apps, internal software, brand design, print design, Sacramento, Nexus Vantage Group, Kavish Singh',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

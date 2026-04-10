import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
    title: 'Nexus Vantage Group – Digital Growth Partner for Service Businesses',
    description: 'Nexus Vantage Group designs brand and web systems that improve trust, conversion, and qualified inbound leads for service businesses.',
    keywords: 'digital agency, web design, brand strategy, lead generation, service business, Nexus Vantage Group, Kavish Singh',
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

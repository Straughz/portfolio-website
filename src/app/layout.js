import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
    title: 'Kavish Singh | Nexus Vantage Group – Graphic & Web Design',
    description: 'Portfolio of Kavish Singh, founder of Nexus Vantage Group. Specializing in graphic design, web design, and brand strategy that elevates your business.',
    keywords: 'graphic design, web design, brand identity, portfolio, Kavish Singh, Nexus Vantage Group',
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

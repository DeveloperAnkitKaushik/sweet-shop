import './globals.css';
import { Toaster } from 'react-hot-toast';
import CartProvider from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

export const metadata = {
    title: 'Kata - Sweet Shop',
    description: 'Manage your sweet shop inventory and sales',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <CartProvider>
                    {children}
                    <CartDrawer />
                </CartProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUser, isAdmin, logout } from '../lib/auth';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setIsOpen } = useCart();

    useEffect(() => {
        setUser(getUser());

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // logout with confirmation
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    // toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <div className={styles.logoSection}>
                    <Link href="/" className={styles.logo}>
                        Kata - Sweet Shop
                    </Link>
                </div>

                <div className={styles.desktopNav}>
                    <div className={styles.adminSection}>
                        {user && (
                            <>
                                <Link
                                    className={styles.adminLink}
                                    href="/"
                                >
                                    Home
                                </Link>
                                <Link
                                    className={styles.adminLink}
                                    onClick={() => setIsOpen(true)}
                                    href="/"
                                >
                                    Cart
                                </Link>
                                {isAdmin() && (
                                    <Link href="/admin" className={styles.adminLink}>
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                </div>
                <div className={styles.userSection}>
                    {user ? (
                        <button
                            className={styles.profileBtn}
                            onClick={handleLogout}
                        >
                            <Image
                                src="/avatar.png"
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className={styles.avatar}
                            />
                        </button>
                    )
                        : (
                            <div className={styles.authButtons}>
                                <span className={styles.authMessage}>Please login to continue</span>
                            </div>
                        )}
                </div>

                <button
                    className={styles.hamburger}
                    onClick={toggleMobileMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {isMobileMenuOpen && (
                    <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={styles.mobileMenuDrawer} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.mobileMenuHeader}>
                                <h3 className={styles.mobileMenuTitle}>Menu</h3>
                                <button
                                    className={styles.mobileMenuClose}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className={styles.mobileMenuContent}>
                                <Link
                                    href="/"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Privacy
                                </Link>
                                <Link
                                    href="/"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>

                                {user ? (
                                    <>
                                        <button
                                            className={styles.mobileMenuItem}
                                            onClick={() => {
                                                setIsOpen(true);
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Cart
                                        </button>

                                        {isAdmin() && (
                                            <Link
                                                href="/admin"
                                                className={styles.mobileMenuItem}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                ⚙️ Admin Panel
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <div className={styles.mobileAuthMessage}>
                                        Please login to continue
                                    </div>
                                )}
                            </div>

                            {user && (
                                <div className={styles.mobileMenuProfile}>
                                    <div className={styles.mobileProfileInfo}>
                                        <Image
                                            src="/avatar.png"
                                            alt="User Avatar"
                                            width={50}
                                            height={50}
                                            className={styles.mobileProfileAvatar}
                                        />
                                        <div className={styles.mobileProfileDetails}>
                                            <p className={styles.mobileProfileName}>{user.name}</p>
                                            <p className={styles.mobileProfileEmail}>{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.mobileLogoutBtn}
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import { sweetsAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { isAuthenticated } from '../lib/auth';
import styles from './page.module.css';
import FeatureComponent from '../components/FeatureComponent';
import TestimonialSection from '../components/TestimonialSection';
import FooterComponent from '../components/FooterComponent';

export default function HomePage() {
    const router = useRouter();
    const { add, update, getQty } = useCart();
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth');
            return;
        }

        fetchSweets();
    }, []);

    // load sweets from API
    const fetchSweets = async () => {
        try {
            setLoading(true);
            const response = await sweetsAPI.getAll({ limit: 12 });
            if (response.data.success) {
                setSweets(response.data.data.sweets);
            }
        } catch (error) {
            console.error('Failed to fetch sweets:', error);
            setSweets([]);
        } finally {
            setLoading(false);
        }
    };

    // search sweets by term
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchSweets();
            return;
        }

        try {
            setLoading(true);
            const response = await sweetsAPI.search({ q: searchTerm });
            if (response.data.success) {
                setSweets(response.data.data.sweets);
            }
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const filteredSweets = sweets.filter(sweet => {
        const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sweet.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className={styles.container}>
            <div className="main-container">
                <Navbar />

                <HeroSlider />

                <FeatureComponent />

                <section className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <h2 className={styles.sectionTitle}>Menu</h2>
                        <div className={styles.searchForm}>
                            <div className={styles.searchInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Search sweets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.sweetsSection}>
                    <div className={styles.sweetsContainer}>
                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Loading sweets...</p>
                            </div>
                        ) : filteredSweets.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No sweets found. Try adjusting your search criteria.</p>
                            </div>
                        ) : (
                            <div className={styles.sweetsContainer}>
                                {filteredSweets.map(sweet => (
                                    <div key={sweet._id} className={styles.sweetCard}>
                                        <img
                                            src={sweet.imageUrl}
                                            alt={sweet.name}
                                            className={styles.sweetImage}
                                        />

                                        <div className={styles.sweetContent}>
                                            <h3 className={styles.sweetName}>{sweet.name}</h3>
                                            <p className={styles.sweetDescription}>
                                                {sweet.description}
                                            </p>
                                        </div>

                                        <div className={styles.sweetFooter}>
                                            <div className={styles.price}>
                                                ₹{sweet.price}
                                            </div>

                                            <div className={styles.qtyControls}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => {
                                                        const currentQty = getQty(sweet._id);
                                                        if (currentQty > 0) {
                                                            update(sweet._id, currentQty - 1);
                                                        }
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span className={styles.qtyValue}>
                                                    {getQty(sweet._id) || 0}
                                                </span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => {
                                                        const currentQty = getQty(sweet._id);
                                                        if (currentQty === 0) {
                                                            add(sweet._id, sweet.name);
                                                        } else {
                                                            update(sweet._id, Math.min(sweet.quantity, currentQty + 1));
                                                        }
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className={styles.qualitySection}>
                    <div className={styles.qualityContainer}>
                        <h2 className={styles.sectionTitle}>Why its special?</h2>
                    </div>
                    <div className={styles.qualityImage}>
                        <img src="/bg.png" alt="Quality" />
                    </div>
                </section>

                <TestimonialSection />
            </div>
            <FooterComponent />
        </div>
    );
}

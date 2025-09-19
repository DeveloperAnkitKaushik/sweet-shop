'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
import styles from './HeroSlider.module.css';
import { sweetsAPI } from '../lib/api';
import { useCart } from '../context/CartContext';
import { isAuthenticated } from '../lib/auth';
import toast from 'react-hot-toast';

// pick 3 random items from list
function pickRandomThree(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 3);
}

export default function HeroSlider() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const { add, getQty } = useCart();

    useEffect(() => {
        const fetch = async () => {
            if (!isAuthenticated()) {
                setSlides([]);
                return;
            }

            try {
                const res = await sweetsAPI.getAll({ limit: 50, sortBy: 'name' });
                if (res.data.success) {
                    const sweets = res.data.data.sweets.map((s) => ({
                        _id: s._id,
                        name: s.name,
                        description: s.description || '',
                        price: s.price,
                        image: s.imageUrl || '/cake/' + s.name + '.jpg',
                        quantity: s.quantity
                    }));
                    setSlides(pickRandomThree(sweets.length >= 3 ? sweets : sweets));
                }
            } catch (e) {
                console.error('HeroSlider: Failed to fetch sweets:', e);
                setSlides([]);
            }
        };
        fetch();
    }, []);

    const activeSlide = slides[activeIndex] || {};

    const handleAddToCart = async (sweetId, sweetName) => {
        if (!isAuthenticated()) {
            toast.error('Please login to add items to cart');
            return;
        }

        console.log('Adding to cart:', { sweetId, sweetName });

        try {
            await add(sweetId, sweetName);
        } catch (error) {
            console.error('Add to cart error:', error);
            console.error('Error response:', error.response?.data);
            const errorMsg = error.response?.data?.message || 'Failed to add to cart';
            toast.error(errorMsg);
        }
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.inner}>
                <div className={styles.bigWord}>{(activeSlide.name || '').split(/[\s\u2013\u2014]+/)[0]}</div>

                {slides.length > 0 && (
                    <>
                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Thumbs, Autoplay, EffectFade]}
                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                            loop
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            slidesPerView={1}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            className={styles.mainSwiper}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        >
                            {slides.map((item) => (
                                <SwiperSlide key={item.name}>
                                    <div className={styles.slideWrap}>
                                        <div className={styles.centerImageWrap}>
                                            <img src={item.image} alt={item.name} className={styles.centerImage} />
                                        </div>
                                        <div className={styles.addToCart}>
                                            <span>Add to cart</span>
                                            <button
                                                className={styles.plusBtn}
                                                onClick={() => handleAddToCart(item._id, item.name)}
                                                disabled={item.quantity === 0}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className={styles.bottomBar}>
                            <div className={styles.descBox}>
                                <p className={styles.descText}>{activeSlide.description}</p>
                            </div>

                            <div className={styles.pagerBox}>
                                <button onClick={() => swiperRef.current?.slidePrev()} className={styles.navBtn}>
                                    ←
                                </button>
                                <div className={styles.pagerInfo}>
                                    <div className={styles.name}>{activeSlide.name}</div>
                                    <div className={styles.price}>₹{activeSlide.price}</div>
                                </div>
                                <button onClick={() => swiperRef.current?.slideNext()} className={styles.navBtn}>
                                    →
                                </button>
                            </div>

                            <div className={styles.thumbsWrapper}>
                                <Swiper
                                    modules={[Thumbs]}
                                    onSwiper={setThumbsSwiper}
                                    watchSlidesProgress
                                    slidesPerView={3}
                                    spaceBetween={10}
                                    className={styles.thumbsSwiper}
                                >
                                    {slides.map((item) => (
                                        <SwiperSlide key={`thumb-${item.name}`}>
                                            <div className={styles.thumbCard}>
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
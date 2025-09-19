'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './TestimonialSection.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
    {
        id: 1,
        rating: 4.9,
        text: "Thanks to Kata Sweet Shop, I feel more informed and confident about my sweet choices than ever before.",
        user: {
            name: "Harsh P.",
            title: "Product Designer",
            avatar: "/testimonial-1.svg"
        }
    },
    {
        id: 2,
        rating: 4.9,
        text: "The customer service team at Kata Sweet Shop went above and beyond to help me resolve a delivery issue.",
        user: {
            name: "Alex K.",
            title: "Design Lead",
            avatar: "/testimonial-2.svg"
        }
    },
    {
        id: 3,
        rating: 4.9,
        text: "Kata Sweet Shop has made it possible for me to stay on top of my sweet cravings and make delicious decisions quickly and easily.",
        user: {
            name: "Jane D",
            title: "CEO",
            avatar: "/testimonial-3.svg"
        }
    },
    {
        id: 4,
        rating: 5.0,
        text: "The quality and freshness of sweets at Kata Sweet Shop is absolutely outstanding. Highly recommended!",
        user: {
            name: "Mike R.",
            title: "Food Critic",
            avatar: "/testimonial-4.svg"
        }
    },
    {
        id: 5,
        rating: 4.8,
        text: "Best sweet shop in town! The variety and taste are simply amazing. My family loves it.",
        user: {
            name: "Sarah L.",
            title: "Marketing Manager",
            avatar: "/testimonial-5.svg"
        }
    }
];

export default function TestimonialSection() {
    return (
        <section className={styles.testimonialSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>What our happy customers say!</h2>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={false}
                    pagination={{
                        clickable: true,
                        bulletClass: styles.swiperPaginationBullet,
                        bulletActiveClass: styles.swiperPaginationBulletActive,
                    }}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    className={styles.swiper}
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className={styles.testimonialCard}>
                                <div className={styles.rating}>
                                    <span className={styles.star}>⭐</span>
                                    <span className={styles.ratingNumber}>{testimonial.rating}</span>
                                </div>

                                <p className={styles.testimonialText}>
                                    "{testimonial.text}"
                                </p>

                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        <Image
                                            src={testimonial.user.avatar}
                                            alt={testimonial.user.name}
                                            width={40}
                                            height={40}
                                            className={styles.avatarImage}
                                        />
                                    </div>
                                    <div className={styles.userDetails}>
                                        <h4 className={styles.userName}>{testimonial.user.name}</h4>
                                        <p className={styles.userTitle}>{testimonial.user.title}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

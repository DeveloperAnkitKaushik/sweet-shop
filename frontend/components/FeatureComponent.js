import React from 'react';
import styles from './FeatureComponent.module.css';
import Image from 'next/image';

const features = [
    {
        icon: "/icon/1.svg",
        title: "Nutrition rich",
        description: "Nutrition rich delights, crafted to nourish your taste buds"
    },
    {
        icon: "/icon/3.svg",
        title: "100% baked",
        description: "Enjoy peace of mind with our secure packing"
    },
    {
        icon: "/icon/2.svg",
        title: "Unique Recipe",
        description: "Savouring 100% baked items from our oven to your plate"
    },
];

export default function FeatureComponent() {
    return (
        <div className={styles.featuresSection}>
            <div className={styles.featuresContainer}>
                {features.map((feature, index) => (
                    <React.Fragment key={feature.title}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIconWrap}>
                                <Image src={feature.icon} alt={feature.title} width={80} height={80} />
                            </div>
                            <div className={styles.featureContent}>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </div>
                        </div>
                        {index < features.length - 1 && (
                            <div className={styles.featureDivider}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
import React from 'react'
import styles from './FooterComponent.module.css'

const FooterComponent = () => {
    return (
        <div className={styles.container}>
            <div className="main-container">
                <div className={styles.innercontainer}>
                    <div className={styles.para}>Developed for Incubyte</div>
                    <div className={styles.logo}>Kata - Sweet Shop</div>
                    <div className={styles.social}>
                        <div className={styles.socialLink}>Contact</div>
                        <div className={styles.socialLink}>Privacy</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterComponent
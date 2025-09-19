'use client';

import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const { isOpen, setIsOpen, cart, total, update, remove, clear, loading } = useCart();

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={() => setIsOpen(false)}>
            <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.cartIcon}>🛒</div>
                        <h3 className={styles.title}>Your Sweet Cart</h3>
                    </div>
                    <button className={styles.close} onClick={() => setIsOpen(false)}>
                        <span className={styles.closeIcon}>✕</span>
                    </button>
                </header>

                <div className={styles.body}>
                    {(!cart.items || cart.items.length === 0) ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🍰</div>
                            <h4 className={styles.emptyTitle}>Your cart is empty</h4>
                            <p className={styles.emptyText}>Add some delicious sweets to get started!</p>
                        </div>
                    ) : (
                        <div className={styles.itemsList}>
                            {cart.items.map((it, index) => (
                                <div key={it.sweet} className={`${styles.item} ${styles.itemSlideIn}`} style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className={styles.itemImage}>
                                        {it.imageUrl ? (
                                            <img src={it.imageUrl} alt={it.name} className={styles.itemImg} />
                                        ) : (
                                            <div className={styles.placeholder}>🍭</div>
                                        )}
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h4 className={styles.itemName}>{it.name}</h4>
                                        <div className={styles.itemPrice}>₹{it.price}</div>
                                        <div className={styles.itemTotal}>₹{(it.price * it.quantity).toFixed(2)}</div>
                                    </div>
                                    <div className={styles.itemControls}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                disabled={loading || it.quantity <= 0}
                                                onClick={() => update(it.sweet, Math.max(0, it.quantity - 1))}
                                            >
                                                −
                                            </button>
                                            <span className={styles.qtyValue}>{it.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                disabled={loading || it.quantity >= 5}
                                                onClick={() => update(it.sweet, Math.min(5, it.quantity + 1))}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            disabled={loading}
                                            onClick={() => remove(it.sweet)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.items && cart.items.length > 0 && (
                    <footer className={styles.footer}>
                        <div className={styles.summary}>
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Subtotal:</span>
                                <span className={styles.totalValue}>₹{total.toFixed(2)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Tax:</span>
                                <span className={styles.totalValue}>₹0.00</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span className={styles.totalLabel}>Total:</span>
                                <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.clearBtn}
                                disabled={loading}
                                onClick={clear}
                            >
                                Clear Cart
                            </button>
                            <button
                                className={styles.checkoutBtn}
                                disabled={loading}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </footer>
                )}
            </aside>
        </div>
    );
}



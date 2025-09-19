'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cartAPI } from '../lib/api';
import { isAuthenticated } from '../lib/auth';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const total = useMemo(() => {
        return cart.items?.reduce((sum, it) => sum + it.price * it.quantity, 0) || 0;
    }, [cart]);

    // load cart from server
    const fetchCart = async () => {
        try {
            const res = await cartAPI.get();
            setCart(res.data.data.cart);
        } catch (e) {
            console.error('CartContext: Failed to fetch cart:', e);
            setCart({ items: [] });
        }
    };

    useEffect(() => {
        if (isAuthenticated()) {
            fetchCart();
        }
    }, []);

    // add item to cart
    const add = async (sweetId, name) => {
        setLoading(true);
        try {
            const res = await cartAPI.add(sweetId, 1);
            setCart(res.data.data.cart);
            toast.success(`${name} added to cart`);
            setIsOpen(true);
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed to add to cart';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    // update item quantity
    const update = async (sweetId, qty) => {
        setLoading(true);
        try {
            const res = await cartAPI.update(sweetId, qty);
            setCart(res.data.data.cart);
        } catch (e) {
            const msg = e.response?.data?.message || 'Failed to update cart';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    // remove item from cart
    const remove = async (sweetId) => {
        setLoading(true);
        try {
            const res = await cartAPI.remove(sweetId);
            setCart(res.data.data.cart);
        } catch (e) {
            toast.error('Failed to remove item');
        } finally { setLoading(false); }
    };

    // clear entire cart
    const clear = async () => {
        setLoading(true);
        try {
            const res = await cartAPI.clear();
            setCart(res.data.data.cart);
        } catch (e) {
            toast.error('Failed to clear cart');
        } finally { setLoading(false); }
    };

    // get quantity for item
    const getQty = (sweetId) => {
        return cart.items?.find((it) => String(it.sweet) === String(sweetId))?.quantity || 0;
    };

    return (
        <CartContext.Provider value={{ cart, total, loading, isOpen, setIsOpen, add, update, remove, clear, fetchCart, getQty }}>
            {children}
        </CartContext.Provider>
    );
}



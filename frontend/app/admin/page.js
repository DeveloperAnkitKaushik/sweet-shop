'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { sweetsAPI, inventoryAPI } from '../../lib/api';
import { getUser, isAuthenticated, isAdmin } from '../../lib/auth';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
    });
    const [restocking, setRestocking] = useState({});

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth');
            return;
        }

        if (!isAdmin()) {
            router.push('/');
            return;
        }

        setUser(getUser());
        fetchSweets();
    }, []);

    useEffect(() => {
        if (editingSweet) {
            setFormData({
                name: editingSweet.name,
                price: editingSweet.price.toString(),
                quantity: editingSweet.quantity.toString(),
                description: editingSweet.description || '',
                imageUrl: editingSweet.imageUrl || '',
            });
        }
    }, [editingSweet]);

    // load all sweets for admin
    const fetchSweets = async () => {
        try {
            setLoading(true);
            const response = await sweetsAPI.getAll({ limit: 100 });
            if (response.data.success) {
                setSweets(response.data.data.sweets);
            }
        } catch (error) {
            toast.error('Failed to fetch sweets');
        } finally {
            setLoading(false);
        }
    };

    // handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // reset form to initial state
    const resetForm = () => {
        console.log('Resetting form');
        setFormData({
            name: '',
            price: '',
            quantity: '',
            description: '',
            imageUrl: '',
        });
        setEditingSweet(null);
        setShowAddForm(false);
    };

    // create new sweet
    const handleAddSweet = async (e) => {
        e.preventDefault();

        try {
            const sweetData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
            };

            const response = await sweetsAPI.create(sweetData);

            if (response.data.success) {
                toast.success('Sweet added successfully!');
                resetForm();
                fetchSweets();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add sweet';
            toast.error(message);
        }
    };

    // edit existing sweet
    const handleEditSweet = (sweet) => {
        setEditingSweet(null);
        setShowAddForm(false);


        setTimeout(() => {
            setEditingSweet(sweet);
            setFormData({
                name: sweet.name,
                price: sweet.price.toString(),
                quantity: sweet.quantity.toString(),
                description: sweet.description || '',
                imageUrl: sweet.imageUrl || '',
            });
            setShowAddForm(true);
        }, 10);
    };

    // update existing sweet
    const handleUpdateSweet = async (e) => {
        e.preventDefault();

        try {
            const sweetData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
            };

            const response = await sweetsAPI.update(editingSweet._id, sweetData);

            if (response.data.success) {
                toast.success('Sweet updated successfully!');
                resetForm();
                fetchSweets();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update sweet';
            toast.error(message);
        }
    };

    // delete sweet with confirmation
    const handleDeleteSweet = async (sweetId, sweetName) => {
        if (!confirm(`Are you sure you want to delete "${sweetName}"?`)) {
            return;
        }

        try {
            const response = await sweetsAPI.delete(sweetId);

            if (response.data.success) {
                toast.success('Sweet deleted successfully!');
                fetchSweets();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete sweet';
            toast.error(message);
        }
    };

    // restock sweet with prompt
    const handleRestock = async (sweetId, sweetName) => {
        const quantity = prompt(`Enter restock quantity for "${sweetName}":`);

        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        setRestocking(prev => ({ ...prev, [sweetId]: true }));

        try {
            const response = await inventoryAPI.restock(sweetId, parseInt(quantity));

            if (response.data.success) {
                toast.success(`Successfully restocked ${quantity} ${sweetName}!`);
                fetchSweets();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Restock failed';
            toast.error(message);
        } finally {
            setRestocking(prev => ({ ...prev, [sweetId]: false }));
        }
    };

    if (!user) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />

            <div className={styles.adminPanel}>
                <div className={styles.header}>
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.title}>Admin Panel</h1>
                        <p className={styles.subtitle}>Manage your sweet shop inventory</p>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{sweets.length}</div>
                            <div className={styles.statLabel}>Total Sweets</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {sweets.filter(sweet => sweet.quantity > 0).length}
                            </div>
                            <div className={styles.statLabel}>In Stock</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {sweets.filter(sweet => sweet.quantity <= 10).length}
                            </div>
                            <div className={styles.statLabel}>Low Stock</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {sweets.reduce((sum, sweet) => sum + sweet.quantity, 0)}
                            </div>
                            <div className={styles.statLabel}>Total Items</div>
                        </div>
                    </div>
                </div>


                <div className={styles.actionsSection}>
                    <div className={styles.actionsContainer}>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className={styles.addButton}
                        >
                            Add New Sweet
                        </button>
                    </div>
                </div>


                {showAddForm && (
                    <div className={styles.formSection}>
                        <div className={styles.formContainer}>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>
                                    {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                                </h2>
                                <button onClick={resetForm} className={styles.closeButton}>
                                    ✕
                                </button>
                            </div>

                            <form
                                key={editingSweet ? editingSweet._id : 'new'}
                                onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}
                                className={styles.form}
                            >
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" className={styles.label}>Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>


                                    <div className={styles.formGroup}>
                                        <label htmlFor="price" className={styles.label}>Price *</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="quantity" className={styles.label}>Quantity *</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description" className={styles.label}>Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={styles.textarea}
                                        rows="3"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="imageUrl" className={styles.label}>Image URL</label>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formActions}>
                                    <button type="button" onClick={resetForm} className={styles.cancelButton}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.submitButton}>
                                        {editingSweet ? 'Update Sweet' : 'Add Sweet'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                <div className={styles.tableSection}>
                    <div className={styles.tableContainer}>
                        <h2 className={styles.sectionTitle}>Sweet Inventory</h2>

                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Loading sweets...</p>
                            </div>
                        ) : sweets.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No sweets found. Add your first sweet!</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sweets.map(sweet => (
                                            <tr key={sweet._id}>
                                                <td className={styles.imageCell}>
                                                    {sweet.imageUrl ? (
                                                        <img src={sweet.imageUrl} alt={sweet.name} className={styles.tableImage} />
                                                    ) : (
                                                        <div className={styles.placeholderImage}>🍭</div>
                                                    )}
                                                </td>
                                                <td className={styles.nameCell}>
                                                    <div className={styles.sweetName}>{sweet.name}</div>
                                                    {sweet.description && (
                                                        <div className={styles.sweetDescription}>{sweet.description}</div>
                                                    )}
                                                </td>
                                                <td className={styles.priceCell}>₹{sweet.price}</td>
                                                <td className={styles.quantityCell}>{sweet.quantity}</td>
                                                <td className={styles.statusCell}>
                                                    {sweet.quantity > 10 ? (
                                                        <span className={styles.statusGood}>Good</span>
                                                    ) : sweet.quantity > 0 ? (
                                                        <span className={styles.statusLow}>Low</span>
                                                    ) : (
                                                        <span className={styles.statusOut}>Out</span>
                                                    )}
                                                </td>
                                                <td className={styles.actionsCell}>
                                                    <div className={styles.actionButtons}>
                                                        <button
                                                            onClick={() => handleEditSweet(sweet)}
                                                            className={styles.editButton}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleRestock(sweet._id, sweet.name)}
                                                            className={styles.restockButton}
                                                            disabled={restocking[sweet._id]}
                                                        >
                                                            {restocking[sweet._id] ? 'Restocking...' : 'Restock'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSweet(sweet._id, sweet.name)}
                                                            className={styles.deleteButton}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

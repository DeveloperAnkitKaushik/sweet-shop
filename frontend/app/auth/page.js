'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { setAuthToken, setUser, getAuthToken, getUser } from '../../lib/auth';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // switch between login/register tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setLoading(false);
    };

    // handle login form input
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // handle register form input
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // validate login form
    const validateLoginForm = () => {
        const newErrors = {};

        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // validate register form
    const validateRegisterForm = () => {
        const newErrors = {};

        if (!registerData.name) {
            newErrors.name = 'Name is required';
        } else if (registerData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        if (!registerData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!registerData.password) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.login(loginData);

            if (response.data.success) {
                const { user, token } = response.data.data;

                setAuthToken(token);
                setUser(user);

                toast.success(`Welcome back, ${user.name}!`);

                router.push('/');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors.reduce((acc, err) => {
                    acc[err.path] = err.msg;
                    return acc;
                }, {}));
            }
        } finally {
            setLoading(false);
        }
    };

    // handle register submission
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateRegisterForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password
            });

            if (response.data.success) {
                const { user, token } = response.data.data;

                setAuthToken(token);
                setUser(user);

                toast.success(`Welcome to Sweet Shop, ${user.name}!`);

                router.push('/');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors.reduce((acc, err) => {
                    acc[err.path] = err.msg;
                    return acc;
                }, {}));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.floatingElements}>
                <div className={styles.floatingElement1}></div>
                <div className={styles.floatingElement2}></div>
                <div className={styles.floatingElement3}></div>
                <div className={styles.floatingElement4}></div>
            </div>

            <div className={styles.authCard}>
                <div className={styles.logoSection}>
                    <div className={styles.logoIcon}>🍰</div>
                    <h1 className={styles.title}>Kata - Sweet Shop</h1>
                    <p className={styles.subtitle}>Welcome! Choose your way to continue</p>
                </div>

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('login')}
                    >
                        <span className={styles.tabIcon}>🔐</span>
                        Sign In
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('register')}
                    >
                        <span className={styles.tabIcon}>📝</span>
                        Sign Up
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>📧</div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        placeholder="Enter your email"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>🔒</div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </div>

                            <button
                                type="submit"
                                className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.spinner}></div>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <div className={styles.buttonIcon}>→</div>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className={styles.form}>
                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>👤</div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.name && <span className={styles.error}>{errors.name}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>📧</div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        placeholder="Enter your email"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>🔒</div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        placeholder="Create a password"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.password && <span className={styles.error}>{errors.password}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputIcon}>🔒</div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                            </div>

                            <button
                                type="submit"
                                className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.spinner}></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign Up</span>
                                        <div className={styles.buttonIcon}>→</div>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        {activeTab === 'login' ? (
                            <>Don't have an account? <span className={styles.link} onClick={() => handleTabChange('register')}>Sign up here</span></>
                        ) : (
                            <>Already have an account? <span className={styles.link} onClick={() => handleTabChange('login')}>Sign in here</span></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

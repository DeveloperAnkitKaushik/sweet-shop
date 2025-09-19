import Cookies from 'js-cookie';

// save token to cookies
export const setAuthToken = (token) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
};

// get token from cookies
export const getAuthToken = () => {
    return Cookies.get('token');
};

// remove token from cookies
export const removeAuthToken = () => {
    Cookies.remove('token');
};

// save user data to cookies
export const setUser = (user) => {
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
};

// get user data from cookies
export const getUser = () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
};

// remove user data from cookies
export const removeUser = () => {
    Cookies.remove('user');
};

// check if user is logged in
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// check if user is admin
export const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'admin';
};

// logout and redirect to auth
export const logout = () => {
    removeAuthToken();
    removeUser();
    window.location.replace('/auth');
};

// /lib/utils/validation.ts
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validatePhone = (phone: string): ValidationResult => {
    if (!phone) {
        return { isValid: false, error: 'Phone number is required' };
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return { 
            isValid: false, 
            error: 'Phone number must be between 10-15 digits'
        };
    }

    return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { 
            isValid: false, 
            error: 'Password must be at least 8 characters long'
        };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return { 
            isValid: false, 
            error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        };
    }

    return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
        return { isValid: true }; // Email is optional
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { 
            isValid: false, 
            error: 'Invalid email format'
        };
    }

    return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
    if (!name) {
        return { isValid: false, error: 'Name is required' };
    }

    if (name.length < 2) {
        return { 
            isValid: false, 
            error: 'Name must be at least 2 characters long'
        };
    }

    return { isValid: true };
};

export const validateAddress = (address: string): ValidationResult => {
    if (!address) {
        return { isValid: false, error: 'Address is required' };
    }

    if (address.length < 5) {
        return { 
            isValid: false, 
            error: 'Address must be at least 5 characters long'
        };
    }

    return { isValid: true };
};

// Helper function to check login status
export const checkLoginStatus = async (): Promise<{
    loggedIn: boolean;
    customer?: {
        id: number;
        name: string;
        phone: string;
        email?: string;
    };
    message?: string;
}> => {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking login status:', error);
        return {
            loggedIn: false,
            message: 'Error checking login status'
        };
    }
};
/**
 * Cart Management System - Type Definitions
 * @author AJ McCrory
 * @created 2024
 * @description Core type definitions for the application
 */

import { CartStatus } from './cartStatus';

/**
 * Cart entity interface
 */
export interface Cart {
    id: number;
    cart_number: string;
    status: CartStatus;
    battery_level: number;
    checkout_time: string | null;
    return_by_time: string | null;
    assigned_to: Person[];
}

/**
 * Person entity interface
 */
export interface Person {
    id: number;
    name: string;
    role: 'admin' | 'volunteer';
    phone: string;
    email: string;
    assigned_carts: Cart[];
}

/**
 * API Error response interface
 */
export interface APIResponse<T> {
    data?: T;
    error?: string;
    status: number;
} 
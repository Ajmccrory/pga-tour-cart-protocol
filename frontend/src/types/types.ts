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

/**
 * Cart History entity interface
 */
export interface CartHistory {
    id: number;
    cart_id: number;
    cart_number: string;
    person_id: number;
    person_name: string;
    checkout_time: string;
    return_time: string | null;
    expected_return_time: string;
    battery_level_start: number;
    battery_level_end: number | null;
    notes: string | null;
    created_at: string;
} 
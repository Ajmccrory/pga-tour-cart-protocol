/**
 * Cart Management System - Type Definitions
 * @author AJ McCrory
 * @created 2024
 * @description Core type definitions for the application
 */

import { Role } from './roles';

/**
 * Cart entity interface
 */
export interface Cart {
    id: number;
    cart_number: string;
    status: 'available' | 'in-use' | 'maintenance';
    battery_level: number;
    checkout_time: string | null | undefined;
    return_by_time: string | null | undefined;
    assigned_to_id?: number | null;
}

/**
 * Person entity interface
 */
export interface Person {
    id: number;
    name: string;
    role: Role;
    phone: string;
    email: string;
    active_cart: Cart[];
}

/**
 * API Error response interface
 */
export interface APIResponse<T> {
    data?: T;
    error?: string;
    status: number;
} 
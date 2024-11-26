/**
 * Cart Management System - Cart Status Types
 * @author AJ McCrory
 * @created 2024
 * @description Type definitions for cart statuses
 */

export type CartStatus = 'available' | 'in-use' | 'maintenance';

export const CART_STATUS_LABELS: Record<CartStatus, string> = {
  'available': 'Available',
  'in-use': 'In Use',
  'maintenance': 'Maintenance'
}; 
/**
 * Cart Management System - Role Type Definitions
 * @author AJ McCrory
 * @created 2024
 * @description Type definitions for user roles in the system
 */

/**
 * Available roles in the system
 */
export type Role = 'admin' | 'volunteer';

/**
 * Role display names mapping
 */
export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  volunteer: 'Volunteer'
}; 
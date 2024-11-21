export interface Cart {
    id: number;
    cart_number: string;
    status: 'available' | 'in-use' | 'maintenance';
    battery_level: number;
    checkout_time: string | null;
    return_by_time: string | null;
    assigned_to_id: number | null;
}

export type Role = 'admin' | 'player' | 'volunteer';

export interface Person {
    id?: string;
    name: string;
    role: Role;
    phone: string;
    email: string;
    active_cart: Cart[];
} 
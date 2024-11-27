/**
 * Cart Management System - API Client
 * @author AJ McCrory
 * @created 2024
 * @description API client for making requests to the backend
 */

import { Cart, Person } from '../types/types';
import { RequestError, handleApiError } from './errorHandling';

// Add CartHistory interface
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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * API client for interacting with the backend
 */
export const api = {
  // Cart endpoints
  async getCarts(): Promise<Cart[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async createCart(cart: Partial<Cart>): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(cart),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new RequestError(errorData.message, response.status);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError('Failed to create cart', 500);
    }
  },

  async updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(cart),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async deleteCart(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      });
      await handleApiError(response);
    } catch (error) {
      throw error;
    }
  },

  updateCartTime: async (id: number, returnByTime: string) => {
    const response = await fetch(`http://localhost:5000/carts/${id}/time`, {
      method: 'PUT',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify({ return_by_time: returnByTime }),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart return time');
    }

    return response.json();
  },

  // Person endpoints
  async getPersons(): Promise<Person[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async createPerson(person: Partial<Person>): Promise<Person> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(person),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async updatePerson(id: number, person: Partial<Person>): Promise<Person> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(person),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async deletePerson(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      });
      await handleApiError(response);
      if (!response.ok) {
        throw new Error(`Failed to delete person: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  },

  async getPerson(id: number): Promise<Person> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
        headers: defaultHeaders,
        credentials: 'include'
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async createBulkCarts(carts: Partial<Cart>[]): Promise<Cart[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/bulk`, {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: JSON.stringify(carts),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async deleteAllCarts(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/bulk`, {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      });
      await handleApiError(response);
    } catch (error) {
      throw error;
    }
  },

  async assignPersonToCart(cartId: number, personId: number): Promise<Cart> {
    try {
      // First, assign the person to the cart
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}/assign/${personId}`, {
        method: 'POST',
        headers: defaultHeaders,
      });
      await handleApiError(response);
      const updatedCart = await response.json();

      // Create history entry for the assignment
      await this.createHistoryEntry({
        cart_id: cartId,
        person_id: personId,
        checkout_time: updatedCart.checkout_time,
        expected_return_time: updatedCart.return_by_time,
        battery_level_start: updatedCart.battery_level,
      });

      return updatedCart;
    } catch (error) {
      throw error;
    }
  },

  async unassignPersonFromCart(cartId: number, personId: number): Promise<Cart> {
    try {
      // Get the current history entry
      const history = await this.getCartHistory(cartId);
      const currentEntry = history.find(entry => 
        entry.person_id === personId && !entry.return_time
      );

      // Record the return in history
      if (currentEntry) {
        const cart = await this.getCarts().then(carts => carts.find(c => c.id === cartId));
        if (cart) {
          await this.recordReturn(currentEntry.id, {
            return_time: new Date().toISOString(),
            battery_level_end: cart.battery_level,
          });
        }
      }

      // Unassign the person
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}/unassign/${personId}`, {
        method: 'POST',
        headers: defaultHeaders,
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Cart History Methods
  async getAllHistory(): Promise<CartHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-history`, {
        headers: defaultHeaders,
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async getCartHistory(cartId: number): Promise<CartHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-history/${cartId}`, {
        headers: defaultHeaders,
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async getPersonHistory(personId: number): Promise<CartHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-history/person/${personId}`, {
        headers: defaultHeaders,
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async createHistoryEntry(data: Partial<CartHistory>): Promise<CartHistory> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-history`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async recordReturn(historyId: number, data: {
    return_time: string;
    battery_level_end?: number;
    notes?: string;
  }): Promise<CartHistory> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-history/${historyId}/return`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async returnCart(cartId: number, data: {
    battery_level: number;
    notes?: string;
    return_time: string;
  }): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${cartId}/return`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      throw error;
    }
  },
}; 
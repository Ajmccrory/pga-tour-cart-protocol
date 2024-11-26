/**
 * Cart Management System - API Utilities
 * @author AJ McCrory
 * @created 2024
 * @description API client for making requests to the backend
 */

import { Cart, Person } from '../types/types';
import { handleApiError } from './errorHandling';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

/**
 * API client for interacting with the backend
 */
export const api = {
  // Cart endpoints
  async getCarts(): Promise<Cart[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error fetching carts:', error);
      throw error;
    }
  },

  async createCart(cart: Partial<Cart>): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  },

  async updateCart(id: number, cart: Partial<Cart>): Promise<Cart> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  },

  async deleteCart(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'DELETE',
      });
      await handleApiError(response);
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  },

  updateCartTime: async (id: number, returnByTime: string) => {
    const response = await fetch(`http://localhost:5000/carts/${id}/time`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
      const response = await fetch(`${API_BASE_URL}/persons`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error fetching persons:', error);
      throw error;
    }
  },

  async createPerson(person: Partial<Person>): Promise<Person> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error creating person:', error);
      throw error;
    }
  },

  async updatePerson(id: number, person: Partial<Person>): Promise<Person> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });
      await handleApiError(response);
      return response.json();
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  },

  async deletePerson(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await handleApiError(response);
      if (!response.ok) {
        throw new Error(`Failed to delete person: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  },
}; 
/**
 * Cart Management System - API Client
 * @author AJ McCrory
 * @created 2024
 * @description API client for making requests to the backend
 */

import { Cart, Person } from '../types/types';
import { handleApiError, RequestError } from './errorHandling';

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
        headers: {
          'Content-Type': 'application/json',
        },
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
      });
      await handleApiError(response);
    } catch (error) {
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
      throw error;
    }
  },
}; 
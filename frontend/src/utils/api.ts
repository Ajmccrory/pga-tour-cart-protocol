import { handleApiError, RequestError } from './errorHandling';
import { Cart, Person } from '../types/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

export const api = {
  async getCarts() {
    try {
      const response = await fetch(`${API_BASE_URL}/carts`);
      await handleApiError(response);
      return response.json();
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError('Failed to fetch carts', 500);
    }
  },

  async createCart(cart: Partial<Cart>) {
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
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError('Failed to create cart', 500);
    }
  },

  async updateCart(id: number, cart: Partial<Cart>) {
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
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError('Failed to update cart', 500);
    }
  },

  async deleteCart(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'DELETE',
      });
      await handleApiError(response);
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError('Failed to delete cart', 500);
    }
  },

  async getPersons() {
    const response = await fetch(`${API_BASE_URL}/persons`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async createPerson(person: Partial<Person>) {
    const response = await fetch(`${API_BASE_URL}/persons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updatePerson(id: number, person: Partial<Person>) {
    const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async deletePerson(id: number) {
    const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
}; 
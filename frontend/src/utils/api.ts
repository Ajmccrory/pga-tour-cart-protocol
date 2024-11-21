import { Cart, Person } from '../types/types';
const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

export const api = {
  async getCarts() {
    const response = await fetch(`${API_BASE_URL}/carts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async createCart(cart: Partial<Cart>) {
    const response = await fetch(`${API_BASE_URL}/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateCart(id: number, cart: Partial<Cart>) {
    const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async deleteCart(id: number) {
    const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
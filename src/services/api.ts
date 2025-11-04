const API_URL = 'https://functions.poehali.dev/fc00dc4e-18bf-4893-bb9d-331e8abda973';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'investor' | 'broker';
  created_at?: string;
}

export interface InvestmentObjectDB {
  id: number;
  broker_id?: number;
  title: string;
  city: string;
  address: string;
  property_type: 'flats' | 'apartments' | 'commercial' | 'country';
  area: number;
  price: number;
  yield_percent: number;
  payback_years: number;
  description?: string;
  images?: string[];
  status: 'available' | 'reserved' | 'sold';
  created_at?: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  object_id: number;
  created_at?: string;
  object?: {
    title: string;
    city: string;
    price: number;
    yield_percent: number;
    images: string[];
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    resource: string,
    method: string = 'GET',
    body?: any,
    params?: Record<string, string>
  ): Promise<T> {
    const queryParams = new URLSearchParams({ resource, ...params });
    const url = `${this.baseUrl}?${queryParams}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('users', 'GET');
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.request<User>('users', 'GET', undefined, { email });
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>('users', 'GET', undefined, { id: id.toString() });
  }

  async createUser(data: { email: string; name: string; role: 'investor' | 'broker' }): Promise<User> {
    return this.request<User>('users', 'POST', data);
  }

  async updateUser(id: number, data: { name: string }): Promise<User> {
    return this.request<User>('users', 'PUT', { id, ...data });
  }

  async getObjects(filters?: {
    city?: string;
    property_type?: string;
    status?: string;
    min_price?: number;
    max_price?: number;
    min_yield?: number;
    max_yield?: number;
  }): Promise<InvestmentObjectDB[]> {
    const params: Record<string, string> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value.toString();
        }
      });
    }
    
    return this.request<InvestmentObjectDB[]>('objects', 'GET', undefined, params);
  }

  async getObjectById(id: number): Promise<InvestmentObjectDB> {
    return this.request<InvestmentObjectDB>('objects', 'GET', undefined, { id: id.toString() });
  }

  async createObject(data: Omit<InvestmentObjectDB, 'id' | 'created_at'>): Promise<InvestmentObjectDB> {
    return this.request<InvestmentObjectDB>('objects', 'POST', data);
  }

  async updateObject(id: number, data: Partial<InvestmentObjectDB>): Promise<InvestmentObjectDB> {
    return this.request<InvestmentObjectDB>('objects', 'PUT', { id, ...data });
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return this.request<Favorite[]>('favorites', 'GET', undefined, { user_id: userId.toString() });
  }

  async addToFavorites(userId: number, objectId: number): Promise<Favorite> {
    return this.request<Favorite>('favorites', 'POST', { user_id: userId, object_id: objectId });
  }

  async removeFromFavorites(userId: number, objectId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>('favorites', 'DELETE', undefined, {
      user_id: userId.toString(),
      object_id: objectId.toString(),
    });
  }
}

export const api = new ApiClient(API_URL);

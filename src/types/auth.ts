export interface User {
  _id: string;
  role: 'tourist' | 'guide' | 'agency' | 'hotel';
  name: string;
  email: string;
  phone: string;
  userId: string;
  verified: {
    email: boolean;
    phone: boolean;
  };
  preferences?: string[];
  expertise?: string[];
  languages?: string[];
  businessName?: string;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  placeId?: string;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  role: User['role'];
  name: string;
  email: string;
  phone: string;
  password: string;
  preferences?: string[];
  expertise?: string[];
  languages?: string[];
  businessName?: string;
  location?: User['location'];
  placeId?: string;
}
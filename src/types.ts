export type UserRole = "donor" | "recipient" | "delivery" | "admin";
export type FoodStatus = "available" | "requested" | "accepted" | "picked_up" | "delivered" | "expired" | "cancelled";
export type FoodCategory = "cooked" | "raw" | "bakery" | "fruits" | "vegetables" | "dairy" | "other";
export type RequestStatus = "pending" | "delivery_accepted" | "picked_up" | "delivered" | "cancelled";
export type NotificationType = "food_requested" | "delivery_accepted" | "picked_up" | "delivered" | "post_expired" | "general";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
}

export interface FoodPost {
  id: number;
  donor_id: number;
  title: string;
  description?: string;
  category: FoodCategory;
  quantity: string;
  serves?: number;
  image_url?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: FoodStatus;
  is_vegetarian: boolean;
  is_vegan: boolean;
  allergens?: string;
  expires_at?: string;
  created_at: string;
  donor?: User;
}

export interface FoodRequest {
  id: number;
  food_post_id: number;
  recipient_id: number;
  delivery_partner_id?: number;
  status: RequestStatus;
  note?: string;
  delivery_address?: string;
  picked_up_at?: string;
  delivered_at?: string;
  created_at: string;
  food_post?: FoodPost;
  recipient?: User;
  delivery_partner?: User;
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_id?: number;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

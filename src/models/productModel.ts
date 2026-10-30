export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  min_stock: number;
  category_id: number | null;
  is_active: number;
}

export interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
  min_stock?: number;
  category_id?: number | null;
}
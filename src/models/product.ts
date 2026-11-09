export interface Product {
  id: number;
  userId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  active: boolean;
}
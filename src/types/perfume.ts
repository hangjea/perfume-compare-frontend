export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  description: string;
  longevity: number;
  sillage: number;
  created_at: string;
  updated_at: string;
  notes: Note[];
  purchaseLinks: PurchaseLink[];
}

export interface Note {
  id: string;
  perfume_id: string;
  note_type: 'top' | 'middle' | 'base';
  ingredient_name: string;
  percentage: number;
}

export interface PurchaseLink {
  id: string;
  perfume_id: string;
  platform_name: string;
  url: string;
  price: number;
  is_available: boolean;
}

export interface PerfumeListResponse {
  data: Perfume[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
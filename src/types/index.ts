export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  stock?: number;
  isFeatured?: boolean; // Ajout du flag pour les produits à la une
  createdAt: string;
  updatedAt: string;
}

// ... reste du fichier inchangé
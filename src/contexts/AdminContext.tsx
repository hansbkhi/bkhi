import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface Product {
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
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Brand {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  products: Product[];
  brands: Brand[];
  heroSlides: HeroSlide[];
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  updateHeroSlides: (slides: HeroSlide[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsAdmin(!!adminToken);
      setIsLoading(false);
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const loadData = () => {
      const savedProducts = localStorage.getItem('products');
      const savedBrands = localStorage.getItem('brands');
      const savedSlides = localStorage.getItem('heroSlides');

      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedBrands) setBrands(JSON.parse(savedBrands));
      if (savedSlides) setHeroSlides(JSON.parse(savedSlides));
    };
    loadData();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    try {
      if (email === 'admin@babismell.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-token');
        setIsAdmin(true);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message
      });
      throw error;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    navigate('/admin/login');
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = {
        id: Date.now().toString(),
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit"
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const updatedProducts = products.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...product,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit"
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit"
      });
      throw error;
    }
  };

  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    try {
      const newBrand = {
        id: Date.now().toString(),
        ...brand
      };
      const updatedBrands = [...brands, newBrand];
      setBrands(updatedBrands);
      localStorage.setItem('brands', JSON.stringify(updatedBrands));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la marque"
      });
      throw error;
    }
  };

  const updateBrand = async (id: string, brand: Partial<Brand>) => {
    try {
      const updatedBrands = brands.map(b => b.id === id ? { ...b, ...brand } : b);
      setBrands(updatedBrands);
      localStorage.setItem('brands', JSON.stringify(updatedBrands));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la marque"
      });
      throw error;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      const updatedBrands = brands.filter(b => b.id !== id);
      setBrands(updatedBrands);
      localStorage.setItem('brands', JSON.stringify(updatedBrands));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la marque"
      });
      throw error;
    }
  };

  const updateHeroSlides = (slides: HeroSlide[]) => {
    try {
      setHeroSlides(slides);
      localStorage.setItem('heroSlides', JSON.stringify(slides));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les images"
      });
      throw error;
    }
  };

  const value = {
    isAdmin,
    isLoading,
    products,
    brands,
    heroSlides,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    addBrand,
    updateBrand,
    deleteBrand,
    updateHeroSlides
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
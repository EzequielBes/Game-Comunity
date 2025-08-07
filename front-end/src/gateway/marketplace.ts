import axios from 'axios';

const MARKETPLACE_API_URL = 'http://localhost:3004';

export interface CreatePostData {
  title: string;
  description: string;
  price: number;
  category: string;
  rarity: string;
  condition: string;
  tradeable: boolean;
  seller_id: string;
  images?: string[];
}

export interface UpdatePostData {
  post_id: string;
  seller_id: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  rarity?: string;
  condition?: string;
  tradeable?: boolean;
  images?: string[];
  status?: 'active' | 'sold' | 'inactive';
}

export interface Post {
  post_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rarity: string;
  condition: string;
  tradeable: boolean;
  seller_id: string;
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface GetPostsFilters {
  category?: string;
  rarity?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  seller_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

// Criar um novo anúncio
export const createPost = async (postData: CreatePostData): Promise<string> => {
  try {
    const response = await axios.post(`${MARKETPLACE_API_URL}/marketplace/createPost`, postData);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao criar anúncio');
  }
};

// Listar anúncios
export const getPosts = async (filters?: GetPostsFilters): Promise<Post[]> => {
  try {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.rarity) params.append('rarity', filters.rarity);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.seller_id) params.append('seller_id', filters.seller_id);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await axios.get(`${MARKETPLACE_API_URL}/marketplace/getPosts?${params.toString()}`);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar anúncios');
  }
};

// Buscar anúncio por ID
export const getPostById = async (post_id: string): Promise<Post> => {
  try {
    const response = await axios.get(`${MARKETPLACE_API_URL}/marketplace/getPost/${post_id}`);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar anúncio');
  }
};

// Atualizar anúncio
export const updatePost = async (updateData: UpdatePostData): Promise<string> => {
  try {
    const response = await axios.put(`${MARKETPLACE_API_URL}/marketplace/updatePost`, updateData);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao atualizar anúncio');
  }
};

// Deletar anúncio
export const deletePost = async (post_id: string, seller_id: string): Promise<string> => {
  try {
    const response = await axios.delete(`${MARKETPLACE_API_URL}/marketplace/deletePost`, {
      data: { post_id, seller_id }
    });
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao deletar anúncio');
  }
};

// Buscar anúncios por vendedor
export const getPostsBySeller = async (seller_id: string): Promise<Post[]> => {
  try {
    const response = await axios.get(`${MARKETPLACE_API_URL}/marketplace/getPostsBySeller?seller_id=${seller_id}`);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar anúncios do vendedor');
  }
};

// Buscar categorias válidas
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${MARKETPLACE_API_URL}/marketplace/getCategories`);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar categorias');
  }
};

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Business {
    id: number;
    name: string;
    description: string | null;
    floor: number | null;
    phone: string | null;
    instagram: string | null;
    category_id: number | null;
    category_name: string | null;
    category_slug: string | null;
    is_active: boolean;
    created_at: string;
}

export interface CreateBusinessInput {
    name: string;
    description?: string;
    floor?: number;
    phone?: string;
    instagram?: string;
    category_id?: number;
}


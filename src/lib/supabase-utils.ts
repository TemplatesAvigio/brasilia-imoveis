import { supabase } from './supabase'
import type { Database } from '../types/supabase'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

type Contact = Database['public']['Tables']['contacts']['Row']
type ContactInsert = Database['public']['Tables']['contacts']['Insert']

type Financing = Database['public']['Tables']['financing']['Row']
type FinancingInsert = Database['public']['Tables']['financing']['Insert']

type Insurance = Database['public']['Tables']['insurance']['Row']
type InsuranceInsert = Database['public']['Tables']['insurance']['Insert']

// Funções para propriedades
export const getProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar propriedades:', error)
    throw error
  }

  return data || []
}

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar propriedade:', error)
    return null
  }

  return data
}

export const searchProperties = async (filters: {
  type?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
}): Promise<Property[]> => {
  let query = supabase.from('properties').select('*')

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  if (filters.region) {
    query = query.eq('region', filters.region)
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters.bedrooms) {
    query = query.eq('bedrooms', filters.bedrooms)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar propriedades:', error)
    throw error
  }

  return data || []
}

export const createProperty = async (property: PropertyInsert): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property] as never)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar propriedade:', error)
    throw error
  }

  return data
}



// Funções para contatos
export const createContact = async (contact: ContactInsert): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact] as never)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar contato:', error)
    throw error
  }

  return data
}

export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar contatos:', error)
    throw error
  }

  return data || []
}

// Funções para financiamento
export const createFinancing = async (financing: FinancingInsert): Promise<Financing> => {
  const { data, error } = await supabase
    .from('financing')
    .insert([financing] as never)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar solicitação de financiamento:', error)
    throw error
  }

  return data
}

export const getFinancing = async (): Promise<Financing[]> => {
  const { data, error } = await supabase
    .from('financing')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar solicitações de financiamento:', error)
    throw error
  }

  return data || []
}

// Funções para seguro
export const createInsurance = async (insurance: InsuranceInsert): Promise<Insurance> => {
  const { data, error } = await supabase
    .from('insurance')
    .insert([insurance] as never)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar solicitação de seguro:', error)
    throw error
  }

  return data
}

export const getInsurance = async (): Promise<Insurance[]> => {
  const { data, error } = await supabase
    .from('insurance')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar solicitações de seguro:', error)
    throw error
  }

  return data || []
}

// Funções para atualizar e deletar propriedades
export const updateProperty = async (id: string, updates: PropertyUpdate): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar propriedade:', error)
    throw error
  }

  return data
}

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar propriedade:', error)
    throw error
  }
}

// Funções para estatísticas e contadores
export const getDashboardStats = async () => {
  try {
    const [financings, insurances, properties] = await Promise.all([
      getFinancing(),
      getInsurance(),
      getProperties()
    ]);

    const today = new Date().toDateString();
    
    return {
      financings: {
        total: financings.length,
        today: financings.filter(f => new Date(f.created_at).toDateString() === today).length,
        totalValue: financings.reduce((sum, f) => sum + f.property_value, 0)
      },
      insurances: {
        total: insurances.length,
        today: insurances.filter(i => new Date(i.created_at).toDateString() === today).length
      },
      properties: {
        total: properties.length,
        totalValue: properties.reduce((sum, p) => sum + p.price, 0),
        averagePrice: properties.length > 0 ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length : 0
      }
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    throw error;
  }
};

export const getRecentActivity = async (limit: number = 10) => {
  try {
    // Retorna um array vazio por enquanto para evitar problemas de tipagem
    return [];
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    throw error;
  }
};



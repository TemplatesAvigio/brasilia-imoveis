import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Property = Database['public']['Tables']['properties']['Row']

// Hook para buscar propriedades
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProperties(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar propriedades')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return { properties, loading, error }
}

// Hook para buscar uma propriedade específica
export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchProperty = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setProperty(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar propriedade')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return { property, loading, error }
}

// Hook para buscar propriedades com filtros
export const usePropertySearch = (filters: {
  type?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
}) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async () => {
    try {
      setLoading(true)
      setError(null)

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

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar propriedades')
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, search }
}

// Hook para criar contato
export const useContact = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContact = async (contactData: {
    name: string
    email: string
    phone: string
    message: string
    property_id?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('contacts')
        .insert(contactData as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar contato')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createContact, loading, error }
}

// Hook para financiamento
export const useFinancing = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFinancing = async (financingData: {
    name: string
    email: string
    phone: string
    property_value: number
    down_payment: number
    term_years: number
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('financing')
        .insert(financingData as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar solicitação de financiamento')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createFinancing, loading, error }
}

// Hook para seguro
export const useInsurance = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInsurance = async (insuranceData: {
    name: string
    email: string
    phone: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('insurance')
        .insert(insuranceData as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar solicitação de seguro')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createInsurance, loading, error }
}

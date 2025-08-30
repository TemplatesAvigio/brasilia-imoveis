export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          address: string
          area: number
          bedrooms: number | null
          bathrooms: number | null
          garage: number | null
          price: number
          price_type: string
          condominium: number | null
          iptu: number | null
          price_detail: string | null
          property_type: string
          region: string
          features: string[]
          images: string[]
          contact_phone: string
          contact_whatsapp: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          address: string
          area: number
          bedrooms?: number | null
          bathrooms?: number | null
          garage?: number | null
          price: number
          price_type: string
          condominium?: number | null
          iptu?: number | null
          price_detail?: string | null
          property_type: string
          region: string
          features?: string[]
          images?: string[]
          contact_phone: string
          contact_whatsapp: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          address?: string
          area?: number
          bedrooms?: number | null
          bathrooms?: number | null
          garage?: number | null
          price?: number
          price_type?: string
          condominium?: number | null
          iptu?: number | null
          price_detail?: string | null
          property_type?: string
          region?: string
          features?: string[]
          images?: string[]
          contact_phone?: string
          contact_whatsapp?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          message: string
          property_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          message: string
          property_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          property_id?: string
          created_at?: string
        }
      }
      financing: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          property_value: number
          down_payment: number
          term_years: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          property_value: number
          down_payment: number
          term_years: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          property_value?: number
          down_payment?: number
          term_years?: number
          created_at?: string
        }
      }
      insurance: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          created_at?: string
        }
      }
    }
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { createFinancing, getFinancing } from '../../lib/supabase-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const financing = await getFinancing()
      return res.status(200).json(financing)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, property_value, down_payment, term_years } = req.body

      // Validação básica
      if (!name || !email || !phone || !property_value || !down_payment || !term_years) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        })
      }

      // Validações adicionais
      if (property_value <= 0) {
        return res.status(400).json({ error: 'Valor do imóvel deve ser maior que zero' })
      }

      if (down_payment <= 0) {
        return res.status(400).json({ error: 'Valor da entrada deve ser maior que zero' })
      }

      if (down_payment >= property_value) {
        return res.status(400).json({ error: 'Valor da entrada deve ser menor que o valor do imóvel' })
      }

      if (term_years < 15 || term_years > 35) {
        return res.status(400).json({ error: 'Prazo deve estar entre 15 e 35 anos' })
      }

      const financing = await createFinancing({
        name,
        email,
        phone,
        property_value: Number(property_value),
        down_payment: Number(down_payment),
        term_years: Number(term_years),
      })

      return res.status(201).json(financing)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

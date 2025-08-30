import type { NextApiRequest, NextApiResponse } from 'next'
import { createInsurance, getInsurance } from '../../lib/supabase-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const insurance = await getInsurance()
      return res.status(200).json(insurance)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone } = req.body

      // Validação básica
      if (!name || !email || !phone) {
        return res.status(400).json({ 
          error: 'Nome, email e telefone são obrigatórios' 
        })
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido' })
      }

      const insurance = await createInsurance({
        name,
        email,
        phone,
      })

      return res.status(201).json(insurance)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

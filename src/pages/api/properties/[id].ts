import type { NextApiRequest, NextApiResponse } from 'next'
import { getPropertyById } from '../../../lib/supabase-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID da propriedade é obrigatório' })
      }

      const property = await getPropertyById(id)

      if (!property) {
        return res.status(404).json({ error: 'Propriedade não encontrada' })
      }

      return res.status(200).json(property)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

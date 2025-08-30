import type { NextApiRequest, NextApiResponse } from 'next'
import { getProperties, searchProperties } from '../../lib/supabase-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { type, region, minPrice, maxPrice, bedrooms } = req.query

      // Se há filtros, usa a função de busca
      if (type || region || minPrice || maxPrice || bedrooms) {
        const filters = {
          type: type as string,
          region: region as string,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          bedrooms: bedrooms ? Number(bedrooms) : undefined,
        }

        const properties = await searchProperties(filters)
        return res.status(200).json(properties)
      }

      // Caso contrário, busca todas as propriedades
      const properties = await getProperties()
      return res.status(200).json(properties)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

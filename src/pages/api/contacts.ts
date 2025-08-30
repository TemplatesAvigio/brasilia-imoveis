import type { NextApiRequest, NextApiResponse } from 'next'
import { createContact, getContacts } from '../../lib/supabase-utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const contacts = await getContacts()
      return res.status(200).json(contacts)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, message, property_id } = req.body

      // Validação básica
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ 
          error: 'Nome, email, telefone e mensagem são obrigatórios' 
        })
      }

      const contact = await createContact({
        name,
        email,
        phone,
        message,
        property_id: property_id || null,
      })

      return res.status(201).json(contact)
    } catch (error) {
      console.error('Erro na API:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

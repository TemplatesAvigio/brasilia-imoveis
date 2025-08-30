// Configurações de contato
export const CONTACT_CONFIG = {
  whatsapp: {
    number: '556130455454', // Número do WhatsApp (formato internacional)
    message: 'Olá! Gostaria de saber mais sobre imóveis em Brasília.',
    url: 'https://wa.me/556130455454?text=Olá! Gostaria de saber mais sobre imóveis em Brasília.'
  },
  phone: '+55 61 3045-5454',
  email: 'contato@brasiliaimoveis.com.br',
  address: 'Brasília, DF, Brasil'
}

// Função para gerar URL do WhatsApp
export const getWhatsAppUrl = (message?: string) => {
  const defaultMessage = CONTACT_CONFIG.whatsapp.message
  const encodedMessage = encodeURIComponent(message || defaultMessage)
  return `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${encodedMessage}`
}

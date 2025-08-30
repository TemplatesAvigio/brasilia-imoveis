// Função para aplicar máscara de telefone brasileiro
export const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara baseada no número de dígitos
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

// Função para remover máscara de telefone
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Função para validar telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = removePhoneMask(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Função para formatar telefone para exibição
export const formatPhoneForDisplay = (phone: string): string => {
  const cleanPhone = removePhoneMask(phone);
  
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  }
  
  return phone;
};

// Função para aplicar máscara de valor monetário brasileiro
export const applyCurrencyMask = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (numbers.length === 0) {
    return '';
  }
  
  // Converte para número e divide por 100 para ter centavos
  const number = parseInt(numbers) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

// Função para remover máscara de valor monetário
export const removeCurrencyMask = (value: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) {
    return '0';
  }
  
  // Converte para número e divide por 100
  const number = parseInt(numbers) / 100;
  return number.toString();
};

// Função para formatar valor monetário para exibição
export const formatCurrencyForDisplay = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

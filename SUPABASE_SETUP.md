# Configuração do Supabase

Este projeto está configurado com o Supabase como banco de dados. Aqui está um guia completo sobre como usar.

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://amysmknawfwzguvhwitg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXNta25hYWZ3emd1dmh3aXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MTA3NjksImV4cCI6MjA3MjA4Njc2OX0.GAV8MlySgVpNo7l57tZ-jDTaLwlYonQucybCahMbWKk

# Service Role Key (apenas para operações do servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteXNta25hYWZ3emd1dmh3aXRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjUxMDc2OSwiZXhwIjoyMDcyMDg2NzY5fQ.gjlBiDODoEw3Ls_FZmxDfweFvfxa6Z7F5VkJnEpKcpM
```

## Estrutura do Banco de Dados

### Tabela: properties

```sql
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(8,2) NOT NULL,
  type TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: contacts

```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: financing

```sql
CREATE TABLE financing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_value DECIMAL(10,2) NOT NULL,
  down_payment DECIMAL(10,2) NOT NULL,
  term_years INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: insurance

```sql
CREATE TABLE insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Como Usar

### 1. Cliente Supabase

```typescript
import { supabase } from '../lib/supabase'

// Buscar todas as propriedades
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .order('created_at', { ascending: false })
```

### 2. Utilitários

Use as funções utilitárias em `src/lib/supabase-utils.ts`:

```typescript
import { getProperties, searchProperties, createContact } from '../lib/supabase-utils'

// Buscar todas as propriedades
const properties = await getProperties()

// Buscar com filtros
const filteredProperties = await searchProperties({
  type: 'apartamento',
  region: 'asa-sul',
  minPrice: 200000,
  maxPrice: 500000,
  bedrooms: 2
})

// Criar contato
const contact = await createContact({
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(61) 99999-9999',
  message: 'Interessado no imóvel'
})
```

### 3. Hooks React

Use os hooks personalizados em `src/hooks/useSupabase.ts`:

```typescript
import { useProperties, useProperty, usePropertySearch, useContact, useFinancing, useInsurance } from '../hooks/useSupabase'

// Em um componente React
function PropertyList() {
  const { properties, loading, error } = useProperties()
  
  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  
  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>{property.title}</div>
      ))}
    </div>
  )
}
```

### 4. API Routes

O projeto inclui API routes prontas:

- `GET /api/properties` - Lista todas as propriedades
- `GET /api/properties?type=apartamento&region=asa-sul` - Busca com filtros
- `GET /api/properties/[id]` - Busca propriedade específica
- `GET /api/contacts` - Lista contatos
- `POST /api/contacts` - Cria novo contato
- `GET /api/financing` - Lista solicitações de financiamento
- `POST /api/financing` - Cria nova solicitação de financiamento
- `GET /api/insurance` - Lista solicitações de seguro
- `POST /api/insurance` - Cria nova solicitação de seguro

## Exemplo de Uso Completo

```typescript
// Componente de busca de propriedades
import { useState } from 'react'
import { usePropertySearch } from '../hooks/useSupabase'

function PropertySearch() {
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined
  })

  const { properties, loading, error, search } = usePropertySearch(filters)

  const handleSearch = () => {
    search()
  }

  return (
    <div>
      {/* Formulário de filtros */}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      
      {error && <div>Erro: {error}</div>}
      
      <div>
        {properties.map(property => (
          <div key={property.id}>
            <h3>{property.title}</h3>
            <p>R$ {property.price.toLocaleString()}</p>
            <p>{property.bedrooms} quartos, {property.bathrooms} banheiros</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Segurança

- A chave `anon` é usada no frontend e tem permissões limitadas
- A chave `service_role` é usada apenas no servidor para operações administrativas
- Configure as políticas de segurança (RLS) no painel do Supabase conforme necessário

## Autenticação

O projeto inclui um sistema completo de autenticação usando o Supabase Auth:

### Funcionalidades Implementadas

- **Login/Cadastro**: Página `/login` com formulário para entrar ou criar conta
- **Proteção de Rotas**: Componente `ProtectedRoute` para páginas que requerem autenticação
- **Perfil do Usuário**: Página `/perfil` para visualizar informações da conta
- **Logout**: Funcionalidade para sair da conta
- **Contexto de Autenticação**: Hook `useAuth` para gerenciar estado do usuário

### Como Usar

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  
  if (!user) {
    return <div>Faça login para continuar</div>
  }
  
  return <div>Bem-vindo, {user.email}!</div>
}
```

### Proteção de Rotas

```typescript
import ProtectedRoute from '@/components/ProtectedRoute'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Esta página só é visível para usuários logados</div>
    </ProtectedRoute>
  )
}
```

## Próximos Passos

1. Configure as políticas de segurança no Supabase
2. Configure upload de imagens para o storage do Supabase
3. Implemente cache e otimizações de performance
4. Adicione funcionalidades específicas para usuários autenticados

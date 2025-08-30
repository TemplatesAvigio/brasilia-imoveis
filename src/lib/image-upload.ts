import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Arquivo não é uma imagem válida'
      };
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'Imagem muito grande. Máximo 5MB'
      };
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    // Upload para o Supabase Storage
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      console.error('Erro no upload:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Obter URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    console.error('Erro geral no upload:', error);
    return {
      success: false,
      error: 'Erro interno no upload'
    };
  }
};

export const uploadMultipleImages = async (files: FileList): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i]);
    results.push(result);
  }
  
  return results;
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extrair o caminho do arquivo da URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const filePath = `properties/${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro geral ao deletar imagem:', error);
    return false;
  }
};

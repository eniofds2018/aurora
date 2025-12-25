
import { SavedItem, ItemType } from '../types';

const STORAGE_KEY = 'aurora_academic_library';

const generateId = (): string => {
  // Verificação explícita de suporte para evitar erros em navegadores antigos ou contextos inseguros
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
};

export const getAllItems = (): SavedItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Falha ao ler dados da Aurora:", e);
    return [];
  }
};

export const saveItem = (type: ItemType, title: string, content: string, metadata?: any): SavedItem => {
  const items = getAllItems();
  const newItem: SavedItem = {
    id: generateId(),
    type,
    title,
    content,
    date: new Date().toISOString(),
    metadata
  };
  
  const updatedItems = [newItem, ...items];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  return newItem;
};

export const deleteItem = (id: string): void => {
  const items = getAllItems();
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getItemsByType = (type: ItemType): SavedItem[] => {
  return getAllItems().filter(item => item.type === type);
};

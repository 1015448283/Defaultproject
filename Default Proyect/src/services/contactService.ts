import { supabase } from './supabase';

export const contactService = {
  getContactos: (page = 1, limit = 20) =>
    supabase.from('contactos').select('*', { count: 'exact' }).range((page - 1) * limit, page * limit - 1),
  getContactoById: (id: string) => supabase.from('contactos').select('*').eq('id', id).single(),
  createContacto: (data: any) => supabase.from('contactos').insert(data).select().single(),
  updateContacto: (id: string, data: any) => supabase.from('contactos').update(data).eq('id', id).select().single(),
  deleteContacto: (id: string) => supabase.from('contactos').delete().eq('id', id),
};

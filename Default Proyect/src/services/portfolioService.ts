import { supabase } from './supabase';

export const portfolioService = {
  getPortafolio: () => supabase.from('portafolio').select('*').eq('activo', true),
  getPortafolioById: (id: string) => supabase.from('portafolio').select('*').eq('id', id).single(),
  createPortafolio: (data: any) => supabase.from('portafolio').insert(data).select().single(),
  updatePortafolio: (id: string, data: any) => supabase.from('portafolio').update(data).eq('id', id).select().single(),
  deletePortafolio: (id: string) => supabase.from('portafolio').delete().eq('id', id),
};

export const testimonialService = {
  getTestimonios: () => supabase.from('testimonios').select('*').eq('activo', true),
  createTestimonio: (data: any) => supabase.from('testimonios').insert(data).select().single(),
  updateTestimonio: (id: string, data: any) => supabase.from('testimonios').update(data).eq('id', id).select().single(),
  deleteTestimonio: (id: string) => supabase.from('testimonios').delete().eq('id', id),
};

export const contentService = {
  getContenido: () => supabase.from('contenido').select('*').eq('activo', true),
  getContenidoBySlug: (slug: string) => supabase.from('contenido').select('*').eq('slug', slug).single(),
  createContenido: (data: any) => supabase.from('contenido').insert(data).select().single(),
  updateContenido: (id: string, data: any) => supabase.from('contenido').update(data).eq('id', id).select().single(),
  deleteContenido: (id: string) => supabase.from('contenido').delete().eq('id', id),
};

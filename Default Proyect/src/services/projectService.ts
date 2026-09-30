import { supabase } from './supabase';

export const serviceService = {
  getServicios: () => supabase.from('servicios').select('*').eq('activo', true),
  getServicioById: (id: string) => supabase.from('servicios').select('*').eq('id', id).single(),
  updateServicio: (id: string, data: any) => supabase.from('servicios').update(data).eq('id', id).select().single(),
};

export const projectService = {
  getProyectos: (page = 1, limit = 20, estado?: string) => {
    let query = supabase.from('proyectos').select('*', { count: 'exact' });
    if (estado) query = query.eq('estado', estado);
    return query.range((page - 1) * limit, page * limit - 1);
  },
  getProyectoById: (id: string) => supabase.from('proyectos').select('*').eq('id', id).single(),
  createProyecto: (data: any) => supabase.from('proyectos').insert(data).select().single(),
  updateProyecto: (id: string, data: any) => supabase.from('proyectos').update(data).eq('id', id).select().single(),
  deleteProyecto: (id: string) => supabase.from('proyectos').delete().eq('id', id),
};

export const paymentService = {
  getPagos: (page = 1, limit = 20) => supabase.from('pagos').select('*', { count: 'exact' }).range((page - 1) * limit, page * limit - 1),
  getPagoById: (id: string) => supabase.from('pagos').select('*').eq('id', id).single(),
  createCheckout: (data: any) => fetch('/.netlify/functions/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
};

export const appointmentService = {
  getAgendamientos: (page = 1, limit = 20, fecha?: string) => {
    let query = supabase.from('agendamientos').select('*', { count: 'exact' });
    if (fecha) query = query.eq('fecha_hora', fecha);
    return query.range((page - 1) * limit, page * limit - 1);
  },
  getSlotsDisponibles: (fechaInicio: string, fechaFin: string) => supabase.rpc('get_available_slots', { fecha_inicio: fechaInicio, fecha_fin: fechaFin }),
  createAgendamiento: (data: any) => supabase.from('agendamientos').insert(data).select().single(),
  updateAgendamiento: (id: string, data: any) => supabase.from('agendamientos').update(data).eq('id', id).select().single(),
  deleteAgendamiento: (id: string) => supabase.from('agendamientos').delete().eq('id', id),
};

export const metricsService = {
  getDashboardMetrics: () => supabase.rpc('get_dashboard_metrics'),
};

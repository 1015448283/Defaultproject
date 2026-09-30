import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { portfolioService } from '../services/portfolioService';
import { testimonialService } from '../services/portfolioService';
import { contentService } from '../services/portfolioService';

export const useContactos = () => useQuery({ queryKey: ['contactos'], queryFn: () => contactService.getContactos().then(r => r.data) });
export const useServicios = () => useQuery({ queryKey: ['servicios'], queryFn: () => serviceService.getServicios().then(r => r.data) });
export const useProyectos = () => useQuery({ queryKey: ['proyectos'], queryFn: () => projectService.getProyectos().then(r => r.data) });
export const usePagos = () => useQuery({ queryKey: ['pagos'], queryFn: () => paymentService.getPagos().then(r => r.data) });
export const useAgendamientos = () => useQuery({ queryKey: ['agendamientos'], queryFn: () => appointmentService.getAgendamientos().then(r => r.data) });
export const useSlots = (fechaInicio: string, fechaFin: string) => useQuery({ queryKey: ['slots', fechaInicio, fechaFin], queryFn: () => appointmentService.getSlotsDisponibles(fechaInicio, fechaFin).then(r => r.data) });
export const useMetrics = () => useQuery({ queryKey: ['metrics'], queryFn: () => metricsService.getDashboardMetrics().then(r => r.data) });
export const usePortafolio = () => useQuery({ queryKey: ['portafolio'], queryFn: () => portfolioService.getPortafolio().then(r => r.data) });
export const useTestimonios = () => useQuery({ queryKey: ['testimonios'], queryFn: () => testimonialService.getTestimonios().then(r => r.data) });
export const useContenido = () => useQuery({ queryKey: ['contenido'], queryFn: () => contentService.getContenido().then(r => r.data) });
export const usePortafolioById = (id: string) => useQuery({ queryKey: ['portafolio', id], queryFn: () => portfolioService.getPortafolioById(id).then(r => r.data), enabled: !!id });

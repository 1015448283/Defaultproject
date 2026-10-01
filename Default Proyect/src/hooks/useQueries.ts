import { useQuery } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import {
  serviceService,
  projectService,
  paymentService,
  appointmentService,
  metricsService
} from '../services/projectService';
import {
  portfolioService,
  testimonialService,
  contentService
} from '../services/portfolioService';

export const useContactos = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ['contactos', page, limit],
    queryFn: async () => {
      const res = await contactService.getContactos(page, limit);
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useServicios = () =>
  useQuery({
    queryKey: ['servicios'],
    queryFn: async () => {
      const res = await serviceService.getServicios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useProyectos = (page = 1, limit = 20, estado?: string) =>
  useQuery({
    queryKey: ['proyectos', page, limit, estado],
    queryFn: async () => {
      const res = await projectService.getProyectos(page, limit, estado);
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const usePagos = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ['pagos', page, limit],
    queryFn: async () => {
      const res = await paymentService.getPagos(page, limit);
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useAgendamientos = (page = 1, limit = 20, fecha?: string) =>
  useQuery({
    queryKey: ['agendamientos', page, limit, fecha],
    queryFn: async () => {
      const res = await appointmentService.getAgendamientos(page, limit, fecha);
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useSlots = (fechaInicio: string, fechaFin: string) =>
  useQuery({
    queryKey: ['slots', fechaInicio, fechaFin],
    queryFn: async () => {
      const res = await appointmentService.getSlotsDisponibles(fechaInicio, fechaFin);
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useMetrics = () =>
  useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await metricsService.getDashboardMetrics();
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const usePortafolio = () =>
  useQuery({
    queryKey: ['portafolio'],
    queryFn: async () => {
      const res = await portfolioService.getPortafolio();
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useTestimonios = () =>
  useQuery({
    queryKey: ['testimonios'],
    queryFn: async () => {
      const res = await testimonialService.getTestimonios();
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const useContenido = () =>
  useQuery({
    queryKey: ['contenido'],
    queryFn: async () => {
      const res = await contentService.getContenido();
      if (res.error) throw res.error;
      return res.data;
    }
  });

export const usePortafolioById = (id: string) =>
  useQuery({
    queryKey: ['portafolio', id],
    queryFn: async () => {
      const res = await portfolioService.getPortafolioById(id);
      if (res.error) throw res.error;
      return res.data;
    },
    enabled: Boolean(id)
  });

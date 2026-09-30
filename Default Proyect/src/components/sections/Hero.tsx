import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-dark-900 px-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold text-white mb-6">Oliver Prada</h1>
        <p className="text-xl text-gray-400 mb-8">Desarrollo Frontend & Gestión de Bases de Datos</p>
        <div className="flex gap-4 justify-center">
          <Link to="/contacto" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg">Contacto</Link>
          <Link to="/portafolio" className="bg-dark-700 text-white px-8 py-3 rounded-lg text-lg border border-gray-600">Portafolio</Link>
        </div>
      </div>
    </section>
  );
}

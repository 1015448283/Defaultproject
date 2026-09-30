export default function PaymentError() {
  return (
    <div className="py-16 px-6 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Error en el Pago</h1>
      <p className="text-gray-400 mb-4">Ocurrió un problema al procesar tu pago.</p>
      <a href="/" className="text-primary-500 hover:underline">Volver al inicio</a>
    </div>
  );
}

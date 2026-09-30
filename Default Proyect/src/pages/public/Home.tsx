import { Hero } from '../components/sections/Hero';
import { ServicesGrid } from '../components/sections/ServicesGrid';
import { Portfolio } from '../components/sections/Portfolio';
import { Testimonials } from '../components/sections/Testimonials';
import { SocialLinks } from '../components/sections/SocialLinks';

export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesGrid />
      <Portfolio />
      <Testimonials />
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Redes Sociales</h2>
          <SocialLinks />
        </div>
      </section>
    </div>
  );
}

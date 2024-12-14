import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/Section';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Categories } from '@/components/Categories';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { Shield, Truck, Sparkles, ArrowRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from '@/components/CountdownTimer';

export default function Home() {
  const navigate = useNavigate();
  const handleDiscoverClick = () => navigate('/parfums');
  const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <>
      {/* Promo Flash Banner */}
      <div className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-purple-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white">Vente Flash</span>
            </div>
            <CountdownTimer endDate={promoEndDate} />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 text-xs py-1 px-2 h-auto"
              onClick={() => navigate('/promotions')}
            >
              Voir les promotions
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroCarousel onDiscoverClick={handleDiscoverClick} />

      {/* Categories Section */}
      <Section>
        <Categories onDiscoverClick={handleDiscoverClick} />
      </Section>

      {/* Features Section */}
      <Section className="bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { icon: Shield, title: "Authenticité Garantie", description: "Tous nos parfums sont authentiques et certifiés" },
              { icon: Truck, title: "Livraison Rapide", description: "Livraison express disponible en Côte d'Ivoire" },
              { icon: Sparkles, title: "Qualité Premium", description: "Une sélection des meilleures fragrances" }
            ].map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-center text-center space-y-2">
                <div className="rounded-full bg-purple-100 p-3">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Featured Products Section */}
      <Section>
        <FeaturedProducts onDiscoverClick={handleDiscoverClick} />
      </Section>
    </>
  );
}
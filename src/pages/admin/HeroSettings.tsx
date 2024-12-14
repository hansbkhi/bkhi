import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Save, Trash2 } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export default function HeroSettings() {
  const { heroSlides, updateHeroSlides } = useAdmin();
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides);

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      buttonText: 'Découvrir',
      buttonLink: '/parfums'
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const handleUpdateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateSlide(id, 'image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateHeroSlides(slides);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Images du Header</h1>
          <p className="text-muted-foreground">
            Gérez les slides du carousel de la page d'accueil
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleAddSlide}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une slide
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold">Slide {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleRemoveSlide(slide.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    placeholder="Ex: Collection Été 2024"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={slide.description}
                    onChange={(e) => handleUpdateSlide(slide.id, 'description', e.target.value)}
                    placeholder="Ex: Découvrez notre nouvelle collection"
                  />
                </div>

                <div>
                  <Label>Texte du bouton</Label>
                  <Input
                    value={slide.buttonText}
                    onChange={(e) => handleUpdateSlide(slide.id, 'buttonText', e.target.value)}
                    placeholder="Ex: Découvrir"
                  />
                </div>

                <div>
                  <Label>Lien du bouton</Label>
                  <Input
                    value={slide.buttonLink}
                    onChange={(e) => handleUpdateSlide(slide.id, 'buttonLink', e.target.value)}
                    placeholder="Ex: /parfums"
                  />
                </div>
              </div>

              <div>
                <Label>Image</Label>
                <div className="mt-2">
                  <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 p-4">
                    {slide.image ? (
                      <div className="relative aspect-video">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="absolute inset-0 h-full w-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleUpdateSlide(slide.id, 'image', '')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <Plus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Cliquez pour ajouter une image</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(slide.id, e)}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Format recommandé: 1920x1080px, max 5MB
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune slide. Cliquez sur "Ajouter une slide" pour commencer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
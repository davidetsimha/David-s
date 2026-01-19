import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Calendar, ShoppingBag, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ShopContent } from '@/components/boutique';
import type { Product, Category } from '@/src/types';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shop' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

// Fetch products server-side
async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('available', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

// Fetch categories server-side
async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

export default async function BoutiquePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shop' });

  // Fetch data server-side (SSR)
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/boutique-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-bronze-500/20 backdrop-blur-sm
            border border-bronze-400/30 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-bronze-300" />
            <span className="text-sm font-medium text-bronze-200">
              {t('orderBefore')}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {t('title')}
          </h1>

          <p className="text-lg text-cream-100/90 max-w-xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-cream-200/80">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="text-sm">{t('freeDelivery')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm">{t('freshProducts')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Client-side interactive content */}
      <ShopContent
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}

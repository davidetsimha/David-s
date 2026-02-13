'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, Clock } from 'lucide-react';
import { ProductFilters } from './ProductFilters';
import { ProductGrid } from './ProductGrid';
import type { Product, Category } from '@/types';

type SectionVariant = 'shabbat' | 'semaine';

interface ProductSectionProps {
  variant: SectionVariant;
  products: Product[];
  categories: Category[];
}

const variantConfig = {
  shabbat: {
    Icon: Calendar,
    badgeBg: 'bg-blue-100 text-blue-700',
    accentLine: 'from-blue-300 via-blue-200 to-transparent',
    sectionBg: 'bg-white',
  },
  semaine: {
    Icon: Clock,
    badgeBg: 'bg-amber-100 text-amber-700',
    accentLine: 'from-amber-300 via-amber-200 to-transparent',
    sectionBg: 'bg-gradient-to-b from-cream-50 to-cream-100/50',
  },
} as const;

export function ProductSection({ variant, products, categories }: ProductSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [categoryId, setCategoryId] = useState<string>();

  if (products.length === 0) return null;

  const { Icon, badgeBg, accentLine, sectionBg } = variantConfig[variant];

  // Only show categories that have products in this section
  const categoryIdsInSection = new Set(products.map((p) => p.category_id));
  const filteredCategories = categories.filter((c) => categoryIdsInSection.has(c.id));

  const displayedProducts = categoryId
    ? products.filter((p) => p.category_id === categoryId)
    : products;

  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <section className={`py-12 px-4 ${sectionBg}`}>
      <div className="max-w-6xl mx-auto" style={{ direction }}>
        {/* Header */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3 ${badgeBg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{t(`shop.sections.${variant}.badge`)}</span>
          </div>

          <h2 className="font-display text-2xl md:text-3xl text-stone-900 mb-2">
            {t(`shop.sections.${variant}.title`)}
          </h2>
          <p className="text-stone-500">
            {t(`shop.sections.${variant}.subtitle`)}
          </p>

          {/* Accent line */}
          <div className={`mt-4 h-0.5 w-24 bg-gradient-to-r ${accentLine}`} />
        </div>

        {/* Category filters */}
        {filteredCategories.length > 1 && (
          <ProductFilters
            categories={filteredCategories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
        )}

        {/* Product grid */}
        <div className="mt-8">
          <ProductGrid products={displayedProducts} isLoading={false} />
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Gift, Users } from 'lucide-react';

export function WhyJoinUsSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: TrendingUp,
      title: t.whyJoinUs.growth.title,
      description: t.whyJoinUs.growth.description,
    },
    {
      icon: Gift,
      title: t.whyJoinUs.benefits.title,
      description: t.whyJoinUs.benefits.description,
    },
    {
      icon: Users,
      title: t.whyJoinUs.culture.title,
      description: t.whyJoinUs.culture.description,
    },
  ];

  return (
    <section
      id='about'
      className='py-20 bg-background'
      data-testid='section-why-join'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground mb-4'
            data-testid='text-why-join-title'
          >
            {t.whyJoinUs.title}
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>{t.whyJoinUs.subtitle}</p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className='h-full text-center border-card-border'
                data-testid={`card-feature-${index}`}
              >
                <CardContent className='p-8'>
                  <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6'>
                    <feature.icon className='w-8 h-8 text-primary' />
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-4'>{feature.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

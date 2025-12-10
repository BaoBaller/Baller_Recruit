import { db } from '../server/db';
import { adminUsers, heroes, jobs } from '../shared/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(adminUsers).values({
      email: 'admin@ballerheadwear.com',
      password: hashedPassword,
      name: 'Admin User',
    });
    console.log('Admin user created: admin@careerhub.com / admin123');
  } else {
    console.log('Admin user already exists, skipping...');
  }

  const existingHero = await db.select().from(heroes).limit(1);
  if (existingHero.length === 0) {
    await db.insert(heroes).values({
      titleVi: 'Xây Dựng Sự Nghiệp Cùng Chúng Tôi',
      titleEn: 'Build Your Career With Us',
      subtitleVi: 'Khám phá cơ hội việc làm hấp dẫn và phát triển sự nghiệp của bạn tại một trong những công ty hàng đầu trong ngành.',
      subtitleEn: 'Discover exciting job opportunities and grow your career at one of the leading companies in the industry.',
      backgroundType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      videoUrl: null,
      ctaTextVi: 'Khám Phá Cơ Hội',
      ctaTextEn: 'Explore Opportunities',
      ctaLink: '#jobs',
    });
    console.log('Default hero section created');
  } else {
    console.log('Hero section already exists, skipping...');
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

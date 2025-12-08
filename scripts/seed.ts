import { db } from "../server/db";
import { adminUsers, heroes, jobs } from "../shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      email: "admin@careerhub.com",
      password: hashedPassword,
      name: "Admin User",
    });
    console.log("Admin user created: admin@careerhub.com / admin123");
  } else {
    console.log("Admin user already exists, skipping...");
  }

  const existingHero = await db.select().from(heroes).limit(1);
  if (existingHero.length === 0) {
    await db.insert(heroes).values({
      titleVi: "Xây Dựng Sự Nghiệp Cùng Chúng Tôi",
      titleEn: "Build Your Career With Us",
      subtitleVi: "Khám phá cơ hội việc làm hấp dẫn và phát triển sự nghiệp của bạn tại một trong những công ty hàng đầu trong ngành.",
      subtitleEn: "Discover exciting job opportunities and grow your career at one of the leading companies in the industry.",
      backgroundType: "image",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
      videoUrl: null,
      ctaTextVi: "Khám Phá Cơ Hội",
      ctaTextEn: "Explore Opportunities",
      ctaLink: "#jobs",
    });
    console.log("Default hero section created");
  } else {
    console.log("Hero section already exists, skipping...");
  }

  const existingJobs = await db.select().from(jobs).limit(1);
  if (existingJobs.length === 0) {
    await db.insert(jobs).values([
      {
        jobTitleVi: "Kỹ Sư Phần Mềm Senior",
        jobTitleEn: "Senior Software Engineer",
        departmentVi: "Công nghệ",
        departmentEn: "Technology",
        locationVi: "TP. Hồ Chí Minh",
        locationEn: "Ho Chi Minh City",
        salaryVi: "30 - 50 triệu VNĐ",
        salaryEn: "$2,000 - $3,500",
        descriptionVi: "Chúng tôi đang tìm kiếm một kỹ sư phần mềm giàu kinh nghiệm để tham gia vào đội ngũ phát triển sản phẩm. Bạn sẽ làm việc với các công nghệ hiện đại và đóng góp vào việc xây dựng các sản phẩm chất lượng cao.",
        descriptionEn: "We are looking for an experienced software engineer to join our product development team. You will work with modern technologies and contribute to building high-quality products.",
        requirementsVi: "- 5+ năm kinh nghiệm phát triển phần mềm\n- Thành thạo React, Node.js, TypeScript\n- Kinh nghiệm với cơ sở dữ liệu SQL và NoSQL\n- Kỹ năng giao tiếp tốt",
        requirementsEn: "- 5+ years of software development experience\n- Proficient in React, Node.js, TypeScript\n- Experience with SQL and NoSQL databases\n- Good communication skills",
        applyEmail: "hr@careerhub.com",
        applyLink: null,
        isActive: true,
      },
      {
        jobTitleVi: "Chuyên Viên Marketing Digital",
        jobTitleEn: "Digital Marketing Specialist",
        departmentVi: "Marketing",
        departmentEn: "Marketing",
        locationVi: "Hà Nội",
        locationEn: "Hanoi",
        salaryVi: "18 - 25 triệu VNĐ",
        salaryEn: "$1,200 - $1,800",
        descriptionVi: "Tham gia đội ngũ marketing năng động của chúng tôi để phát triển và thực hiện các chiến lược marketing số. Bạn sẽ chịu trách nhiệm quản lý các kênh truyền thông xã hội và chiến dịch quảng cáo.",
        descriptionEn: "Join our dynamic marketing team to develop and execute digital marketing strategies. You will be responsible for managing social media channels and advertising campaigns.",
        requirementsVi: "- 3+ năm kinh nghiệm marketing digital\n- Hiểu biết về SEO, SEM, Social Media\n- Kỹ năng phân tích dữ liệu\n- Sáng tạo và có tư duy chiến lược",
        requirementsEn: "- 3+ years of digital marketing experience\n- Knowledge of SEO, SEM, Social Media\n- Data analysis skills\n- Creative with strategic thinking",
        applyEmail: null,
        applyLink: "https://forms.google.com/apply",
        isActive: true,
      },
      {
        jobTitleVi: "Trợ Lý Hành Chính",
        jobTitleEn: "Administrative Assistant",
        departmentVi: "Hành chính",
        departmentEn: "Administration",
        locationVi: "Đà Nẵng",
        locationEn: "Da Nang",
        salaryVi: "10 - 15 triệu VNĐ",
        salaryEn: "$700 - $1,000",
        descriptionVi: "Hỗ trợ các hoạt động hành chính văn phòng và đảm bảo môi trường làm việc chuyên nghiệp. Làm việc trực tiếp với ban lãnh đạo để hỗ trợ các công việc hàng ngày.",
        descriptionEn: "Support office administrative activities and ensure a professional work environment. Work directly with management to assist with daily tasks.",
        requirementsVi: "- 1+ năm kinh nghiệm hành chính\n- Thành thạo MS Office\n- Kỹ năng tổ chức tốt\n- Giao tiếp tốt bằng tiếng Việt và tiếng Anh",
        requirementsEn: "- 1+ year of administrative experience\n- Proficient in MS Office\n- Good organizational skills\n- Good communication in Vietnamese and English",
        applyEmail: "hr@careerhub.com",
        applyLink: null,
        isActive: true,
      },
    ]);
    console.log("Sample jobs created");
  } else {
    console.log("Jobs already exist, skipping...");
  }

  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

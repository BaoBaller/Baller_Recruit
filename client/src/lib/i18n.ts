export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    nav: {
      home: 'Trang chủ',
      jobs: 'Việc làm',
      about: 'Về chúng tôi',
      contact: 'Liên hệ',
    },
    hero: {
      defaultTitle: 'TỔNG QUAN VỀ BALLERHEADWEAR',
      defaultSubtitle: 'Khám phá cơ hội việc làm hấp dẫn và phát triển sự nghiệp của bạn',
      defaultCta: 'Khám Phá Ngay',
    },
    jobs: {
      title: 'Cơ Hội Việc Làm',
      subtitle: 'Tìm kiếm vị trí phù hợp với bạn',
      applyNow: 'Ứng Tuyển Ngay',
      department: 'Phòng ban',
      location: 'Địa điểm',
      salary: 'Mức lương',
      requirements: 'Yêu cầu',
      description: 'Mô tả công việc',
      noJobs: 'Chưa có vị trí tuyển dụng nào',
    },
    whyJoinUs: {
      title: 'Tại Sao Chọn Chúng Tôi',
      subtitle: 'Khám phá những lý do khiến chúng tôi trở thành nơi làm việc tuyệt vời',
      growth: {
        title: 'Phát Triển Sự Nghiệp',
        description: 'Cơ hội học hỏi và phát triển liên tục trong môi trường chuyên nghiệp',
      },
      benefits: {
        title: 'Phúc Lợi Hấp Dẫn',
        description: 'Chế độ lương thưởng cạnh tranh cùng nhiều phúc lợi đa dạng',
      },
      culture: {
        title: 'Văn Hóa Đa Dạng',
        description: 'Môi trường làm việc năng động, sáng tạo và tôn trọng sự khác biệt',
      },
    },
    footer: {
      company: 'Công ty',
      quickLinks: 'Liên kết nhanh',
      contact: 'Liên hệ',
      copyright: 'Bản quyền',
      allRightsReserved: 'Tất cả quyền được bảo lưu',
    },
    admin: {
      login: 'Đăng Nhập Admin',
      email: 'Email',
      password: 'Mật khẩu',
      signIn: 'Đăng Nhập',
      logout: 'Đăng Xuất',
      dashboard: 'Bảng Điều Khiển',
      heroEditor: 'Quản Lý Trang Chủ',
      jobsManagement: 'Quản Lý Việc Làm',
      createJob: 'Tạo Việc Làm',
      editJob: 'Chỉnh Sửa Việc Làm',
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      active: 'Đang Tuyển',
      inactive: 'Ngừng Tuyển',
      actions: 'Thao tác',
    },
  },
  en: {
    nav: {
      home: 'Home',
      jobs: 'Jobs',
      about: 'About',
      contact: 'Contact',
    },
    hero: {
      defaultTitle: 'Build Your Career With Us',
      defaultSubtitle: 'Discover exciting job opportunities and grow your career',
      defaultCta: 'Explore Now',
    },
    jobs: {
      title: 'Job Opportunities',
      subtitle: 'Find the position that suits you',
      applyNow: 'Apply Now',
      department: 'Department',
      location: 'Location',
      salary: 'Salary',
      requirements: 'Requirements',
      description: 'Job Description',
      noJobs: 'No job openings available',
    },
    whyJoinUs: {
      title: 'Why Join Us',
      subtitle: 'Discover what makes us a great place to work',
      growth: {
        title: 'Career Growth',
        description: 'Continuous learning and development opportunities in a professional environment',
      },
      benefits: {
        title: 'Great Benefits',
        description: 'Competitive compensation with diverse benefits package',
      },
      culture: {
        title: 'Diverse Culture',
        description: 'Dynamic, creative work environment that respects differences',
      },
    },
    footer: {
      company: 'Company',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      copyright: 'Copyright',
      allRightsReserved: 'All rights reserved',
    },
    admin: {
      login: 'Admin Login',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      logout: 'Logout',
      dashboard: 'Dashboard',
      heroEditor: 'Main Page Management',
      jobsManagement: 'Jobs Management',
      createJob: 'Create Job',
      editJob: 'Edit Job',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      active: 'Active',
      inactive: 'Inactive',
      actions: 'Actions',
    },
  },
} as const;

export function getTranslation(lang: Language) {
  return translations[lang];
}

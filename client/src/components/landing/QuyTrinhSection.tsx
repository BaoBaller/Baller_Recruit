export function QuyTrinhSection() {
  const steps = [
    {
      title: 'Tiếp Đón',
      desc: 'Ứng viên được chào đón trong môi trường thoải mái và chuyên nghiệp.',
      img: '/process-step-1.png',
    },
    {
      title: 'Thử Tay Nghề',
      desc: 'Ứng viên thể hiện kỹ năng thông qua bài kiểm tra phù hợp.',
      img: '/process-step-2.png',
    },
    {
      title: 'Nhận Kết Quả',
      desc: 'Kết quả được phản hồi nhanh chóng và minh bạch.',
      img: '/process-step-3.png',
    },
  ];

  return (
    <section
      className='w-full py-24 bg-white'
      id='process'
    >
      <div className='max-w-7xl mx-auto px-6'>
        {/* Section Title */}
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-16'>Quy Trình Tuyển Dụng</h2>

        {/* Steps */}
        <div className='flex flex-col sm:flex-row gap-12 sm:gap-10 justify-between'>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className='flex-1 bg-gray-50 rounded-3xl shadow-lg p-10 text-center hover:shadow-xl transition-all duration-300'
            >
              {/* Enlarged Circle Image */}
              <div className='w-40 h-40 mx-auto mb-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center'>
                <img
                  src={step.img}
                  alt={step.title}
                  className='w-full h-full object-cover'
                />
              </div>

              {/* Title */}
              <h3 className='text-2xl font-semibold mb-4'>{step.title}</h3>

              {/* Description */}
              <p className='text-gray-600 text-lg leading-relaxed'>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

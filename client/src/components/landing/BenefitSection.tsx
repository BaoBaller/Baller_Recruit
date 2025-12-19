export function BenefitSection() {
  return (
    <section
      id='benefit'
      className='w-full h-auto bg-no-repeat bg-center bg-cover'
    >
      {/* Height control (auto-adjusts by device) */}
      <div className='pt-[160%] sm:pt-[150%] lg:pt-[40%]' />

      {/* Responsive background switching */}
      <style>
        {`
          /* MOBILE (default) — Vertical image */
          #benefit {
            background-image: url('/benefit_mobile.jpg');
          }

          /* TABLET — also vertical */
          @media (min-width: 640px) and (max-width: 1023px) {
            #benefit {
              background-image: url('/benefit_mobile.jpg');
            }
          }

          /* DESKTOP — horizontal landscape version */
          @media (min-width: 1024px) {
            #benefit {
              background-image: url('/Benefit 2.png');
            }
          }
        `}
      </style>
    </section>
  );
}

export function InfoSection() {
  return (
    <section
      id='welcome'
      className='w-full bg-no-repeat bg-center bg-cover
                 min-h-[180vh] sm:min-h-[200vh] lg:min-h-[80vh]'
    >
      <style>
        {`
          #welcome {
            background-image: url('/info_final2.jpg');
          }

          @media (min-width: 1024px) {
            #welcome {
              background-image: url('/Welcome2.jpg');
            }
          }
        `}
      </style>
    </section>
  );
}

interface EggCharacterProps {
  fillPercentage?: number;
  yolkColor?: string;
  isFinished?: boolean;
}

export function EggCharacter({
  fillPercentage = 0,
  yolkColor = '#FFB800',
  isFinished = false,
}: EggCharacterProps) {
  const yolkHeight = 80;
  const fillHeight = (yolkHeight * fillPercentage) / 100;
  const yolkY = 120 - yolkHeight / 2;

  return (
    <svg
      width='240'
      height='240'
      viewBox='0 0 240 240'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='transform-gpu transition-transform duration-300 hover:scale-105'
    >
      <path
        d='M180 140c0 33.137-26.863 60-60 60s-60-26.863-60-60c0-60 30-120 60-120s60 60 60 120z'
        fill='white'
      />

      <circle
        cx='120'
        cy='120'
        r='40'
        fill={yolkColor}
        className={isFinished ? 'animate-yolk-transition' : ''}
      />

      <clipPath id='yolk-clip'>
        <circle cx='120' cy='120' r='40' />
      </clipPath>
      <rect
        x='80'
        y={yolkY + yolkHeight - fillHeight}
        width='80'
        height={fillHeight}
        fill={`color-mix(in srgb, ${yolkColor} 65%, black)`}
        clipPath='url(#yolk-clip)'
        className={`transition-all duration-1000 ease-linear ${
          isFinished ? 'animate-fill-fade' : ''
        }`}
      />

      <circle cx='110' cy='115' r='3' fill='black' />
      <circle cx='130' cy='115' r='3' fill='black' />

      <path
        d='M115 125c3.333 5 11.6 5 15 0'
        stroke='black'
        strokeWidth='3'
        strokeLinecap='round'
      />
    </svg>
  );
}

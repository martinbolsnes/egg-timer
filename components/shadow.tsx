interface ShadowProps {
  isActive: boolean;
}

export function Shadow({ isActive }: ShadowProps) {
  return (
    <div
      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-black/20 rounded-full transition-all duration-300 ${
        isActive ? 'animate-shadow-bounce' : ''
      }`}
    ></div>
  );
}

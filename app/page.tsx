'use client';

import { useState, useEffect, useRef } from 'react';
import { EggCharacter } from '@/components/egg-character';
import { Shadow } from '@/components/shadow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomTimeInput } from '@/components/custom-time-input';
import { VolumeX, Lock, Unlock } from 'lucide-react';

const SOFT_BOILED = 300;
const MEDIUM_BOILED = 420;
const HARD_BOILED = 540;

type EggType = 'soft' | 'medium' | 'hard' | 'custom';

const eggTypes: Record<
  Exclude<EggType, 'custom'>,
  { time: number; color: string }
> = {
  soft: { time: SOFT_BOILED, color: '#FFB800' },
  medium: { time: MEDIUM_BOILED, color: '#FFA500' },
  hard: { time: HARD_BOILED, color: '#FF8C00' },
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(SOFT_BOILED);
  const [isActive, setIsActive] = useState(false);
  const [eggType, setEggType] = useState<EggType>('soft');
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsReady(true);
      playAudio();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsReady(false);
    stopAudio();
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(
      eggType === 'custom'
        ? timeLeft
        : eggTypes[eggType as Exclude<EggType, 'custom'>].time
    );
    setIsReady(false);
    stopAudio();
  };

  const selectEggType = (type: EggType) => {
    setEggType(type);
    if (type !== 'custom') {
      setTimeLeft(eggTypes[type].time);
      setShowCustomInput(false);
    } else {
      setShowCustomInput(true);
    }
    setIsActive(false);
    setIsReady(false);
    stopAudio();
  };

  const setCustomTime = (seconds: number) => {
    setTimeLeft(seconds);
    setEggType('custom');
    setIsActive(false);
    setIsReady(false);
    stopAudio();
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleScreenLock = async () => {
    if (!isScreenLocked) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsScreenLocked(true);
      } catch (err) {
        console.error(`Failed to lock screen: ${err}`);
      }
    } else {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsScreenLocked(false);
      }
    }
  };

  const fillPercentage =
    (((eggType === 'custom'
      ? timeLeft
      : eggTypes[eggType as Exclude<EggType, 'custom'>].time) -
      timeLeft) /
      (eggType === 'custom'
        ? timeLeft
        : eggTypes[eggType as Exclude<EggType, 'custom'>].time)) *
    100;

  return (
    <main className='min-h-screen bg-[#8B5CF6] flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-[320px] mx-auto flex flex-col items-center space-y-8'>
        <div className='flex flex-wrap justify-center gap-4'>
          {(Object.keys(eggTypes) as Exclude<EggType, 'custom'>[]).map(
            (type) => (
              <Button
                variant='secondary'
                key={type}
                onClick={() => selectEggType(type)}
                className={`text-zinc-800 bg-zinc-200 text-xl font-light hover:bg-zinc-300 ${
                  eggType === type
                    ? 'bg-amber-500 text-zinc-100 hover:bg-amber-600'
                    : ''
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            )
          )}
          <Button
            variant='outline'
            onClick={() => selectEggType('custom')}
            className={`text-zinc-800 bg-zinc-200 text-xl font-light hover:bg-zinc-300 ${
              eggType === 'custom'
                ? 'bg-amber-500 text-zinc-100 hover:bg-amber-600'
                : ''
            }`}
          >
            Custom
          </Button>
        </div>
        {showCustomInput && <CustomTimeInput onSetCustomTime={setCustomTime} />}
        <div className='relative w-60 h-60'>
          <Shadow isActive={isActive} />
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              isActive ? 'animate-egg-bounce' : ''
            }`}
            style={
              {
                '--fill-color': `color-mix(in srgb, ${
                  eggType === 'custom'
                    ? '#FFA500'
                    : eggTypes[eggType as Exclude<EggType, 'custom'>].color
                } 90%, black)`,
                '--yolk-color':
                  eggType === 'custom'
                    ? '#FFA500'
                    : eggTypes[eggType as Exclude<EggType, 'custom'>].color,
              } as React.CSSProperties
            }
          >
            <EggCharacter
              fillPercentage={fillPercentage}
              yolkColor={
                eggType === 'custom'
                  ? '#FFA500'
                  : eggTypes[eggType as Exclude<EggType, 'custom'>].color
              }
              isFinished={isReady}
            />
          </div>
        </div>

        <div className='relative w-full h-20 flex items-center justify-center'>
          {isReady ? (
            <div className='absolute w-full bg-zinc-100 rounded-lg p-4 text-center'>
              <div className='absolute left-1/2 -top-2 w-4 h-4 bg-zinc-100 transform -translate-x-1/2 rotate-45'></div>
              <p className='text-zinc-900 font-bold text-lg'>I&apos;m ready!</p>
            </div>
          ) : (
            <div className='text-zinc-100 text-7xl font-extralight tracking-wider'>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className='flex space-x-4 w-full'>
          {!isActive ? (
            <Button
              variant='default'
              onClick={startTimer}
              className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-zinc-100 text-xl font-medium'
            >
              Start
            </Button>
          ) : (
            <Button
              variant='default'
              onClick={pauseTimer}
              className='flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-100 text-xl font-medium'
            >
              Pause
            </Button>
          )}
          <Button
            variant='outline'
            onClick={resetTimer}
            className={cn(
              'flex-1 bg-[#8B5CF6] text-zinc-100 text-xl font-medium'
            )}
          >
            Reset
          </Button>
        </div>
        <div className='flex space-x-4 w-full'>
          {isPlaying && (
            <Button
              variant='ghost'
              size='icon'
              onClick={stopAudio}
              className='flex-1 bg-transparent hover:bg-transparent text-zinc-100 hover:text-zinc-100 font-bold'
            >
              <VolumeX size={24} />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleScreenLock}
            className={`flex-1 ${
              isScreenLocked
                ? 'text-zinc-100 hover:text-zinc-100 transition-transform duration-75'
                : 'text-zinc-900 hover:bg-text-zinc-900 transition-transform duration-75'
            } bg-bg-transparent hover:bg-bg-transparent font-bold cursor-pointer`}
          >
            {isScreenLocked ? <Unlock size={24} /> : <Lock size={24} />}
          </Button>
        </div>
      </div>
      <audio ref={audioRef} src='/saxophone.mp3' loop />
    </main>
  );
}

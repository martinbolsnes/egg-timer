import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomTimeInputProps {
  onSetCustomTime: (seconds: number) => void;
}

export function CustomTimeInput({ onSetCustomTime }: CustomTimeInputProps) {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleSetCustomTime = () => {
    const totalSeconds =
      Number.parseInt(minutes) * 60 + Number.parseInt(seconds);
    if (totalSeconds > 0) {
      onSetCustomTime(totalSeconds);
    }
  };

  return (
    <div className='flex space-x-2 items-center'>
      <Input
        type='number'
        placeholder='Min'
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className='w-20 text-base text-zinc-900 placeholder:text-zinc-700'
        min='0'
      />
      <Input
        type='number'
        placeholder='Sec'
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
        className='w-20 text-base text-zinc-900 placeholder:text-zinc-700'
        min='0'
        max='59'
      />
      <Button onClick={handleSetCustomTime} variant='secondary'>
        Set
      </Button>
    </div>
  );
}

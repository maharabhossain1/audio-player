import dynamic from 'next/dynamic';

const AudioPlayer = dynamic(() => import('@/components/audio-player'), {
  ssr: false,
});

export default function Home() {
  const audioUrl = 'https://download.quranicaudio.com/qdc/abdul_baset/mujawwad/49.mp3';
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <AudioPlayer audioUrl={audioUrl} />
    </main>
  );
}

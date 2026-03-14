import type { ProjectContent } from '@/types/content';

export const musicPlayerProject: ProjectContent = {
  id: 'project-music-player',
  title: 'Music Player',
  description: 'Build a feature-rich music player with Web Audio API, visualizers, playlists, and media controls.',
  slug: 'projects/music-player',
  pillar: 'projects',
  category: 'applications',
  tags: ['web audio api', 'canvas', 'visualization', 'media', 'playlists'],
  difficulty: 'advanced',
  contentType: 'project',
  summary: 'Create a professional music player with Web Audio API for equalizer, Canvas-based waveform visualizer, playlist management, keyboard shortcuts, and Media Session API integration.',
  relatedTopics: ['integration-rest-apis'],
  order: 11,
  updatedAt: '2025-06-01',
  readingTime: 32,
  featured: true,
  keywords: ['Web Audio API', 'Canvas', 'Visualization', 'Media Player', 'Equalizer'],
  techStack: ['React', 'TypeScript', 'Web Audio API', 'Canvas', 'Tailwind CSS'],
  learningGoals: [
    'Use Web Audio API for audio processing',
    'Create Canvas visualizations',
    'Build interactive playlist management',
    'Implement keyboard controls',
    'Use Media Session API',
    'Apply audio filters and effects',
  ],
  features: [
    'Play/pause/seek controls',
    'Volume control',
    'Playlist management',
    'Equalizer with frequency bands',
    'Real-time waveform visualizer',
    'Current time and duration display',
    'Keyboard shortcuts',
    'Media session integration (lock screen controls)',
  ],
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Web Audio API Setup',
      id: 'audio-api-setup',
    },
    {
      type: 'paragraph',
      text: 'The Web Audio API provides low-latency audio processing. Create an AudioContext and connect audio elements to gain nodes for volume control and frequency analysis.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover: string;
}

class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private bassGain: BiquadFilterNode | null = null;
  private midGain: BiquadFilterNode | null = null;
  private trebleGain: BiquadFilterNode | null = null;

  constructor() {
    // Create audio context on first user interaction
    document.addEventListener('click', () => this.initializeAudioContext(), {
      once: true,
    });
  }

  private initializeAudioContext(): void {
    if (this.audioContext) return;

    // Create context
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create audio element
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';

    // Create source node
    this.sourceNode = this.audioContext.createMediaElementAudioSource(
      this.audioElement
    );

    // Create gain node for volume
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.7;

    // Create analyser for frequency data
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;

    // Create EQ filters
    this.bassGain = this.audioContext.createBiquadFilter();
    this.bassGain.type = 'lowshelf';
    this.bassGain.frequency.value = 200;
    this.bassGain.gain.value = 0;

    this.midGain = this.audioContext.createBiquadFilter();
    this.midGain.type = 'peaking';
    this.midGain.frequency.value = 1000;
    this.midGain.gain.value = 0;

    this.trebleGain = this.audioContext.createBiquadFilter();
    this.trebleGain.type = 'highshelf';
    this.trebleGain.frequency.value = 4000;
    this.trebleGain.gain.value = 0;

    // Connect nodes: source -> bass -> mid -> treble -> gain -> analyser -> destination
    this.sourceNode.connect(this.bassGain);
    this.bassGain.connect(this.midGain);
    this.midGain.connect(this.trebleGain);
    this.trebleGain.connect(this.gainNode);
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  loadSong(song: Song): void {
    if (!this.audioElement) return;
    this.audioElement.src = song.url;
    this.audioElement.load();
  }

  play(): Promise<void> {
    if (!this.audioElement) return Promise.resolve();
    return this.audioElement.play();
  }

  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  setVolume(value: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  setEQ(bass: number, mid: number, treble: number): void {
    if (this.bassGain) this.bassGain.gain.value = bass;
    if (this.midGain) this.midGain.gain.value = mid;
    if (this.trebleGain) this.trebleGain.gain.value = treble;
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array();
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  getWaveformData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array();
    const data = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(data);
    return data;
  }

  getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  setCurrentTime(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Canvas Waveform Visualizer',
      id: 'visualizer',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface VisualizerOptions {
  width: number;
  height: number;
  barWidth: number;
  barGap: number;
  smoothing: number;
}

class WaveformVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frequencyData: Uint8Array = new Uint8Array();
  private waveformData: Uint8Array = new Uint8Array();
  private options: VisualizerOptions;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement, options: Partial<VisualizerOptions> = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.options = {
      width: canvas.width,
      height: canvas.height,
      barWidth: 4,
      barGap: 2,
      smoothing: 0.8,
      ...options,
    };
  }

  drawFrequencyBars(): void {
    const { width, height, barWidth, barGap } = this.options;
    const data = this.frequencyData;

    // Clear canvas
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);

    const barCount = Math.floor(width / (barWidth + barGap));
    const centerY = height / 2;

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * data.length);
      const value = data[dataIndex] / 255;
      const barHeight = value * height * 0.8;

      const x = i * (barWidth + barGap);

      // Gradient color
      const hue = (i / barCount) * 360;
      this.ctx.fillStyle = \`hsl(\${hue}, 100%, 50%)\`;

      // Draw bar from center
      this.ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
    }
  }

  drawWaveform(): void {
    const { width, height } = this.options;
    const data = this.waveformData;

    // Clear
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);

    // Draw waveform
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    const centerY = height / 2;
    const pointsPerPixel = data.length / width;

    for (let x = 0; x < width; x++) {
      const index = Math.floor(x * pointsPerPixel);
      const value = (data[index] / 128 - 1) * (height / 2);
      const y = centerY + value;

      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();
  }

  drawCircleVisualizer(): void {
    const { width, height } = this.options;
    const data = this.frequencyData;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    // Clear
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);

    const barCount = data.length;
    const barAngle = (Math.PI * 2) / barCount;

    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;

    for (let i = 0; i < barCount; i++) {
      const value = data[i] / 255;
      const angle = i * barAngle - Math.PI / 2;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;

      const barLength = value * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
  }

  update(frequencyData: Uint8Array, waveformData: Uint8Array): void {
    // Apply smoothing
    if (this.frequencyData.length === frequencyData.length) {
      for (let i = 0; i < frequencyData.length; i++) {
        this.frequencyData[i] =
          frequencyData[i] * (1 - this.options.smoothing) +
          this.frequencyData[i] * this.options.smoothing;
      }
    } else {
      this.frequencyData = frequencyData;
    }

    this.waveformData = waveformData;
  }

  animate(mode: 'bars' | 'waveform' | 'circle' = 'bars'): void {
    if (mode === 'bars') {
      this.drawFrequencyBars();
    } else if (mode === 'waveform') {
      this.drawWaveform();
    } else {
      this.drawCircleVisualizer();
    }

    this.animationId = requestAnimationFrame(() => this.animate(mode));
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Music Player React Component',
      id: 'player-component',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '1',
      title: 'Summer Dreams',
      artist: 'The Melodies',
      duration: 240,
      url: '/music/summer.mp3',
      cover: '/covers/summer.jpg',
    },
    // ... more songs
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'waveform' | 'circle'>('bars');
  const [eq, setEq] = useState({ bass: 0, mid: 0, treble: 0 });

  const playerRef = useRef(new AudioPlayer());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<WaveformVisualizer | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentSong = songs[currentIndex];

  // Initialize
  useEffect(() => {
    const player = playerRef.current;
    player.loadSong(currentSong);

    if (canvasRef.current) {
      visualizerRef.current = new WaveformVisualizer(canvasRef.current);
      visualizerRef.current.animate(visualizerMode);
    }

    return () => {
      visualizerRef.current?.stop();
    };
  }, [currentSong, visualizerMode]);

  // Animation loop for visualizer
  useEffect(() => {
    const animate = () => {
      const player = playerRef.current;
      const visualizer = visualizerRef.current;

      if (visualizer && player.isPlaying()) {
        const freqData = player.getFrequencyData();
        const waveData = player.getWaveformData();
        visualizer.update(freqData, waveData);
      }

      setCurrentTime(player.getCurrentTime());
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const player = playerRef.current;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      await player.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % songs.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
  };

  const handleSeek = (time: number) => {
    playerRef.current.setCurrentTime(time);
    setCurrentTime(time);
  };

  const handleEQChange = (band: 'bass' | 'mid' | 'treble', value: number) => {
    const newEq = { ...eq, [band]: value };
    setEq(newEq);
    playerRef.current.setEQ(newEq.bass, newEq.mid, newEq.treble);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-8">
      <div className="max-w-md mx-auto">
        {/* Visualizer */}
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="w-full rounded-lg mb-6 bg-black"
        />

        {/* Visualizer Mode */}
        <div className="flex justify-center gap-2 mb-6">
          {(['bars', 'waveform', 'circle'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setVisualizerMode(mode)}
              className={\`px-3 py-1 rounded text-sm capitalize \${
                visualizerMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }\`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Cover Art */}
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="w-full rounded-lg mb-6 shadow-lg"
        />

        {/* Song Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">{currentSong.title}</h2>
          <p className="text-gray-400">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={playerRef.current.getDuration()}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(playerRef.current.getDuration())}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            ⏮
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition text-xl"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            ⏭
          </button>
        </div>

        {/* Volume */}
        <div className="mb-6">
          <label className="text-sm mb-2 block">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Equalizer */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-bold mb-3">Equalizer</h3>
          <div className="grid grid-cols-3 gap-2">
            {['bass', 'mid', 'treble'].map((band) => (
              <div key={band} className="text-center">
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={eq[band as keyof typeof eq]}
                  onChange={(e) =>
                    handleEQChange(band as any, parseFloat(e.target.value))
                  }
                  className="w-full"
                />
                <label className="text-xs text-gray-400 capitalize mt-1">
                  {band}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold mb-3">Playlist</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {songs.map((song, idx) => (
              <div
                key={song.id}
                onClick={() => setCurrentIndex(idx)}
                className={\`p-2 rounded cursor-pointer transition \${
                  idx === currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }\`}
              >
                <p className="text-sm font-semibold">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Keyboard Shortcuts',
      id: 'keyboard-shortcuts',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `function usePlayerKeyboardShortcuts(
  onPlayPause: () => void,
  onNext: () => void,
  onPrevious: () => void,
  onVolumeUp: () => void,
  onVolumeDown: () => void
): void {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown]);
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Media Session API Integration',
      id: 'media-session',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `function useMediaSessionAPI(
  song: Song,
  isPlaying: boolean,
  onPlayPause: () => void,
  onNext: () => void,
  onPrevious: () => void
): void {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const session = navigator.mediaSession;

    // Set metadata
    session.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: [
        {
          src: song.cover,
          sizes: '512x512',
          type: 'image/jpg',
        },
      ],
    });

    // Set state
    session.playbackState = isPlaying ? 'playing' : 'paused';

    // Handle action handlers
    session.setActionHandler('play', onPlayPause);
    session.setActionHandler('pause', onPlayPause);
    session.setActionHandler('nexttrack', onNext);
    session.setActionHandler('previoustrack', onPrevious);

    return () => {
      session.setActionHandler('play', null);
      session.setActionHandler('pause', null);
      session.setActionHandler('nexttrack', null);
      session.setActionHandler('previoustrack', null);
    };
  }, [song, isPlaying, onPlayPause, onNext, onPrevious]);
}`,
    },
  ],
};

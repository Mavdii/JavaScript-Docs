import type { IntegrationContent } from '@/types/content';

export const webrtcIntegration: IntegrationContent = {
  id: 'integration-webrtc',
  title: 'WebRTC & Peer Connections',
  description: 'Build real-time peer-to-peer audio, video, and data applications using WebRTC.',
  slug: 'integrations/webrtc',
  pillar: 'integrations',
  category: 'realtime',
  tags: ['webrtc', 'peer-to-peer', 'video', 'audio', 'data channels', 'streaming'],
  difficulty: 'advanced',
  contentType: 'integration',
  summary: 'Master WebRTC for building video conferencing, voice calls, and real-time data applications. Learn RTCPeerConnection, signaling, ICE candidates, and data channels.',
  relatedTopics: ['integration-realtime'],
  order: 3,
  updatedAt: '2025-06-01',
  readingTime: 30,
  featured: true,
  keywords: ['WebRTC', 'RTCPeerConnection', 'getUserMedia', 'data channels', 'ICE'],
  requiredLibraries: ['webrtc (browser APIs)'],
  setupSteps: ['Request user permissions', 'Get local media stream', 'Create RTCPeerConnection', 'Setup signaling server'],
  authNotes: 'HTTPS required for getUserMedia. Use secure WebSocket for signaling.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Getting Local Media with getUserMedia',
      id: 'getusermedia',
    },
    {
      type: 'paragraph',
      text: 'getUserMedia captures audio/video from the user\'s camera and microphone. Always request permissions and handle denials gracefully.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface MediaConstraints {
  audio?: boolean | MediaAudioConstraints;
  video?: boolean | MediaVideoConstraints;
}

async function getLocalStream(
  audio: boolean = true,
  video: boolean = true
): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio,
      video: video ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      } : false,
    });

    return stream;
  } catch (error) {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          throw new Error('Camera/microphone permission denied');
        case 'NotFoundError':
          throw new Error('Camera/microphone not found');
        case 'NotReadableError':
          throw new Error('Camera/microphone in use by another app');
        default:
          throw new Error(\`Media error: \${error.name}\`);
      }
    }
    throw error;
  }
}

// Display local video preview
async function setupLocalVideo(): Promise<void> {
  const videoElement = document.getElementById('localVideo') as HTMLVideoElement;

  try {
    const stream = await getLocalStream();
    videoElement.srcObject = stream;

    // Stop stream on unmount
    return () => {
      stream.getTracks().forEach(track => track.stop());
    };
  } catch (error) {
    console.error('Failed to get media:', error);
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Creating RTCPeerConnection',
      id: 'peer-connection',
    },
    {
      type: 'paragraph',
      text: 'RTCPeerConnection is the core of WebRTC. It manages the connection state, handles ICE candidates, and coordinates media streams between peers.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface PeerConfig {
  iceServers: RTCIceServer[];
  signalingUrl: string;
}

class PeerManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private config: PeerConfig;

  constructor(config: PeerConfig) {
    this.config = config;
  }

  async initialize(localStream: MediaStream): Promise<void> {
    this.localStream = localStream;

    // Create peer connection with ICE servers
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.config.iceServers,
    });

    // Add local tracks to connection
    localStream.getTracks().forEach(track => {
      this.peerConnection!.addTrack(track, localStream);
    });

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send to signaling server
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
    };

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE state:', this.peerConnection?.iceConnectionState);
    };

    // Handle remote tracks
    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind);
      // Display remote video/audio
      this.displayRemoteTrack(event.track, event.streams[0]);
    };
  }

  async startCall(): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    // Create offer
    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    // Set local description
    await this.peerConnection.setLocalDescription(offer);

    // Send offer to peer via signaling
    this.sendSignalingMessage({
      type: 'offer',
      sdp: offer.sdp,
    });
  }

  async handleOffer(sdp: string): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    const offer = new RTCSessionDescription({ type: 'offer', sdp });
    await this.peerConnection.setRemoteDescription(offer);

    // Create and send answer
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.sendSignalingMessage({
      type: 'answer',
      sdp: answer.sdp,
    });
  }

  async handleAnswer(sdp: string): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    const answer = new RTCSessionDescription({ type: 'answer', sdp });
    await this.peerConnection.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    try {
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  }

  private displayRemoteTrack(track: MediaStreamTrack, stream: MediaStream): void {
    const videoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
    if (videoElement && track.kind === 'video') {
      videoElement.srcObject = stream;
    }
  }

  private sendSignalingMessage(message: any): void {
    // Send via WebSocket
    console.log('Sending signaling message:', message);
  }

  close(): void {
    this.peerConnection?.close();
    this.localStream?.getTracks().forEach(track => track.stop());
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Signaling with WebSocket',
      id: 'signaling',
    },
    {
      type: 'paragraph',
      text: 'Signaling exchanges session descriptions (offer/answer) and ICE candidates between peers. It happens over a separate channel (WebSocket) before the P2P connection is established.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  sdp?: string;
  candidate?: RTCIceCandidate;
}

class SignalingClient {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, Function> = new Map();

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('Signaling connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        };

        this.ws.onerror = (error) => {
          console.error('Signaling error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Signaling disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  on(type: string, handler: Function): void {
    this.messageHandlers.set(type, handler);
  }

  send(message: SignalingMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Signaling not connected');
    }

    this.ws.send(JSON.stringify(message));
  }

  private handleMessage(message: any): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  close(): void {
    this.ws?.close();
  }
}

// Usage
const signaling = new SignalingClient();

signaling.on('offer', async (msg) => {
  console.log('Received offer');
  await peerManager.handleOffer(msg.sdp);
});

signaling.on('answer', async (msg) => {
  console.log('Received answer');
  await peerManager.handleAnswer(msg.sdp);
});

signaling.on('ice-candidate', async (msg) => {
  console.log('Received ICE candidate');
  await peerManager.addIceCandidate(msg.candidate);
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Data Channels for Real-time Communication',
      id: 'data-channels',
    },
    {
      type: 'paragraph',
      text: 'Data channels send arbitrary data (messages, files, game state) over the P2P connection with low latency. They work independently of audio/video.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class DataChannelManager {
  private dataChannel: RTCDataChannel | null = null;

  // Initiator creates the channel
  createDataChannel(peerConnection: RTCPeerConnection, label: string): void {
    this.dataChannel = peerConnection.createDataChannel(label, {
      ordered: true, // Maintain message order
      maxRetransmits: 3,
    });

    this.setupDataChannel();
  }

  // Receiver listens for channel
  setupDataChannelListener(peerConnection: RTCPeerConnection): void {
    peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.dataChannel.onerror = (event) => {
      console.error('Data channel error:', event.error);
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  }

  send(data: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel not open');
    }

    this.dataChannel.send(JSON.stringify(data));
  }

  private handleMessage(message: any): void {
    console.log('Received message:', message);
  }
}

// Send chat messages
dataChannelManager.send({
  type: 'chat',
  text: 'Hello from peer!',
  timestamp: Date.now(),
});

// Send file metadata
dataChannelManager.send({
  type: 'file-start',
  name: 'document.pdf',
  size: 1024000,
  chunks: 100,
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Screen Sharing',
      id: 'screen-sharing',
    },
    {
      type: 'paragraph',
      text: 'Share your screen or application window using getDisplayMedia. Users select what to share from a system dialog.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class ScreenShareManager {
  private screenStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private sender: RTCRtpSender | null = null;

  async startScreenShare(peerConnection: RTCPeerConnection): Promise<void> {
    this.peerConnection = peerConnection;

    try {
      // Request screen capture
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: false,
      });

      // Get the video track
      const videoTrack = this.screenStream.getVideoTracks()[0];
      if (!videoTrack) throw new Error('No video track in screen stream');

      // Find existing video sender and replace track
      const senders = this.peerConnection.getSenders();
      const videoSender = senders.find(s => s.track?.kind === 'video');

      if (videoSender) {
        this.sender = videoSender;
        await videoSender.replaceTrack(videoTrack);
      } else {
        // Add as new track if no video was being sent
        this.sender = await this.peerConnection.addTrack(videoTrack, this.screenStream);
      }

      // Handle stream end (user clicks "Stop sharing")
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      console.log('Screen sharing started');
    } catch (error) {
      console.error('Failed to start screen share:', error);
      throw error;
    }
  }

  async stopScreenShare(fallbackToCamera?: MediaStream): Promise<void> {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }

    // Switch back to camera
    if (fallbackToCamera && this.sender) {
      const videoTrack = fallbackToCamera.getVideoTracks()[0];
      if (videoTrack) {
        await this.sender.replaceTrack(videoTrack);
      }
    }

    console.log('Screen sharing stopped');
  }

  isScreenSharing(): boolean {
    return this.screenStream !== null;
  }
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'ICE Candidates & Connectivity',
      id: 'ice-candidates',
    },
    {
      type: 'paragraph',
      text: 'ICE (Interactive Connectivity Establishment) finds the best network path between peers. STUN servers help peers discover their public IP, TURN servers relay traffic if direct connection fails.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Configure ICE servers
const iceServers: RTCIceServer[] = [
  // Public STUN servers (free)
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },

  // TURN servers for relay (paid)
  {
    urls: 'turn:turnserver.example.com:3478',
    username: 'user',
    credential: 'pass',
    credentialType: 'password',
  },
];

const peerConnection = new RTCPeerConnection({
  iceServers,
});

// Monitor ICE candidate gathering
peerConnection.onicegatheringstatechange = () => {
  console.log('ICE gathering state:', peerConnection.iceGatheringState);

  if (peerConnection.iceGatheringState === 'complete') {
    console.log('All ICE candidates gathered');
  }
};

// Monitor individual candidates
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    console.log('ICE candidate:', event.candidate.candidate);
    // Send to peer
  } else {
    console.log('ICE gathering finished');
  }
};

// Monitor connection stats
setInterval(async () => {
  const stats = await peerConnection.getStats();

  stats.forEach(report => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      console.log('Video incoming bitrate:', report.bytesReceived);
      console.log('Packets received:', report.packetsReceived);
      console.log('Packets lost:', report.packetsLost);
    }

    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
      console.log('Active candidate pair:');
      console.log('  Current round-trip time:', report.currentRoundTripTime);
      console.log('  Available outgoing bitrate:', report.availableOutgoingBitrate);
    }
  });
}, 1000);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Complete Video Call Example',
      id: 'complete-example',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class VideoCall {
  private peerManager!: PeerManager;
  private signalingClient!: SignalingClient;
  private dataChannelManager!: DataChannelManager;
  private screenShareManager!: ScreenShareManager;

  async initialize(peerId: string): Promise<void> {
    // Setup signaling
    this.signalingClient = new SignalingClient();
    await this.signalingClient.connect(\`wss://signal.example.com?id=\${peerId}\`);

    // Setup peer connection
    this.peerManager = new PeerManager({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
      signalingUrl: 'wss://signal.example.com',
    });

    const localStream = await getLocalStream();
    await this.peerManager.initialize(localStream);

    // Setup data channels
    this.dataChannelManager = new DataChannelManager();
    this.dataChannelManager.createDataChannel(
      this.peerManager['peerConnection'],
      'chat'
    );

    // Setup screen sharing
    this.screenShareManager = new ScreenShareManager();

    // Handle signaling messages
    this.signalingClient.on('offer', async (msg) => {
      await this.peerManager.handleOffer(msg.sdp);
    });

    this.signalingClient.on('answer', async (msg) => {
      await this.peerManager.handleAnswer(msg.sdp);
    });

    this.signalingClient.on('ice-candidate', async (msg) => {
      await this.peerManager.addIceCandidate(msg.candidate);
    });
  }

  async call(targetPeerId: string): Promise<void> {
    this.signalingClient.send({
      type: 'call-request',
      targetPeerId,
    });

    await this.peerManager.startCall();
  }

  sendMessage(text: string): void {
    this.dataChannelManager.send({
      type: 'chat',
      text,
      sender: 'local',
      timestamp: Date.now(),
    });
  }

  async toggleScreenShare(): Promise<void> {
    if (this.screenShareManager.isScreenSharing()) {
      await this.screenShareManager.stopScreenShare();
    } else {
      await this.screenShareManager.startScreenShare(
        this.peerManager['peerConnection']
      );
    }
  }

  end(): void {
    this.peerManager.close();
    this.signalingClient.close();
  }
}`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'HTTPS Required',
      text: 'getUserMedia and getDisplayMedia require HTTPS (or localhost). Your app won\'t work over HTTP.',
    },
  ],
};

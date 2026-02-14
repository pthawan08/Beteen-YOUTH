'use client'
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, RefreshCcw, Heart, Star, Sparkles } from 'lucide-react';

export default function ValentineBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(1);
  const [selectedBG, setSelectedBG] = useState('/6.jpg'); // เริ่มต้นที่รูป 6.jpg
  const [photos, setPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState({ type: 'v4', count: 4 });
  const [countdown, setCountdown] = useState<number | string | null>(null);
  const [finalUrl, setFinalUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // เริ่มต้นการถ่ายรูป
  const startSession = async (type: string, count: number) => {
    setLayout({ type, count });
    setStep(2);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 3/4 } });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const capturedPhotos = [];
      for (let i = 0; i < count; i++) {
        await new Promise((res) => {
          let c = 3;
          setCountdown(c);
          const timer = setInterval(() => {
            c--;
            if (c > 0) setCountdown(c);
            else { clearInterval(timer); setCountdown('📸'); setTimeout(res, 600); }
          }, 1000);
        });
        capturedPhotos.push(capture());
        setPhotos([...capturedPhotos]);
      }
      stream.getTracks().forEach(t => t.stop());
      setStep(3);
    } catch (err) { alert("กรุณาอนุญาตให้ใช้งานกล้อง"); location.reload(); }
  };

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current!.videoWidth;
    canvas.height = videoRef.current!.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current!, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const handleFinish = async () => {
    setLoading(true);
    const area = document.getElementById('capture-area');
    const canvas = await html2canvas(area!, { scale: 2, useCORS: true });
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image: canvas.toDataURL('image/png') }),
    });
    const data = await res.json();
    setFinalUrl(data.url);
    setStep(4);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#ffccd5] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border-[6px] border-[#ff85a2]">
        
        {step === 1 && (
          <div className="p-8 text-center">
            <h1 className="text-4xl font-black text-[#c9184a] mb-2">CVC YOUTH</h1>
            <p className="text-[#ff4d6d] font-bold mb-6">Valentine Photo Booth 2026</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[6, 7, 8, 9].map(n => (
                <div key={n} onClick={() => setSelectedBG(`/${n}.jpg`)} 
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedBG === `/${n}.jpg` ? 'border-[#ff4d6d] scale-105 shadow-lg' : 'border-transparent opacity-70'}`}>
                  <img src={`/${n}.jpg`} alt="frame" className="w-full" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => startSession('v2', 2)} className="bg-[#ff758f] text-white py-4 rounded-2xl font-bold hover:bg-[#c9184a]">แบบ 2 ช่องแนวตั้ง</button>
              <button onClick={() => startSession('v4', 4)} className="bg-[#ff4d6d] text-white py-4 rounded-2xl font-bold hover:bg-[#c9184a]">แบบ 4 ช่องแนวตั้ง</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="relative aspect-[3/4] bg-neutral-900">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-9xl font-black drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {countdown}
            </div>
            <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1 rounded-full font-bold animate-pulse">LIVE</div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 text-center">
            <div id="capture-area" className="relative p-10 bg-cover bg-center min-h-[500px]" style={{ backgroundImage: `url(${selectedBG})` }}>
              <div className={`grid gap-2 ${layout.type === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {photos.map((src, i) => (
                  <img key={i} src={src} className="w-full aspect-[4/3] object-cover border-[3px] border-white shadow-md rounded-sm" />
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={handleFinish} disabled={loading} className="w-full bg-[#c9184a] text-white py-4 rounded-2xl font-bold text-xl shadow-lg">
                {loading ? 'กำลังสร้างรูป...' : 'ยืนยันและรับรูป ❤️'}
              </button>
              <button onClick={() => setStep(1)} className="text-gray-500 font-bold flex items-center justify-center gap-2"><RefreshCcw size={18}/> ถ่ายใหม่</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-10 text-center bg-gradient-to-b from-white to-[#fff0f3]">
            <Heart className="mx-auto text-[#ff4d6d] mb-4 animate-bounce" fill="#ff4d6d" size={48} />
            <h2 className="text-2xl font-black text-[#c9184a] mb-6">ได้รูปแล้วจ้า!</h2>
            <div className="flex justify-center mb-8 p-6 bg-white rounded-3xl shadow-xl border-2 border-[#ffccd5]">
              <QRCodeSVG value={finalUrl} size={180} />
            </div>
            <a href={finalUrl} target="_blank" className="block w-full bg-[#ff758f] text-white py-4 rounded-2xl font-bold mb-4">ดาวน์โหลดรูปภาพ</a>
            <button onClick={() => location.reload()} className="text-[#c9184a] font-bold">กลับหน้าแรก</button>
          </div>
        )}

      </div>
    </div>
  );
}
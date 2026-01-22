
import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, History, Send, Download, RefreshCcw, X, AlertCircle, Clock, Calendar } from 'lucide-react';
import { AspectRatio, AIStyle, GeneratedImage, AppState } from './types';
import { AI_STYLES, ASPECT_RATIOS } from './constants';
import { generateAIImage } from './services/geminiService';

const AestheticClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="glass-panel px-4 py-2 rounded-2xl flex flex-col items-end border-indigo-500/20 shadow-lg shadow-indigo-500/5 animate-pulse-soft">
      <div className="flex items-center gap-2 text-indigo-400 font-mono text-lg font-bold tracking-widest">
        <Clock size={16} className="animate-pulse" />
        {formatTime(time)}
      </div>
      <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 uppercase tracking-tighter">
        <Calendar size={10} />
        {formatDate(time)}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<AIStyle>(AI_STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('image_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal memuat riwayat", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('image_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setAppState(AppState.GENERATING);
    setErrorMessage('');

    try {
      const imageUrl = await generateAIImage(prompt, aspectRatio, selectedStyle.promptSuffix);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        style: selectedStyle.name
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 50));
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || "Gagal membuat gambar. Silakan coba lagi.");
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    if (confirm("Hapus semua riwayat pembuatan gambar?")) {
      setHistory([]);
      localStorage.removeItem('image_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-[400px] md:h-screen md:sticky top-0 overflow-y-auto custom-scrollbar glass-panel p-6 border-r border-gray-800 flex flex-col gap-8 z-10">
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Farhanimasi<span className="gradient-text">AI</span>
          </h1>
        </header>

        {/* Input Prompt */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-400">Masukkan Prompt Anda</label>
            <span className="text-xs text-indigo-400 cursor-pointer hover:underline" onClick={() => setPrompt("Seekor astronot kucing mengambang di luar angkasa, gaya seni digital")}>
              Coba Contoh
            </span>
          </div>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan apa yang ingin Anda buat..."
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] transition-all"
            />
            {prompt && (
              <button 
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 p-1 hover:bg-gray-800 rounded-full text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </section>

        {/* Pilih Gaya */}
        <section className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-400">Pilih Gaya Seni</label>
          <div className="grid grid-cols-3 gap-3">
            {AI_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={`relative group flex flex-col items-center gap-2 transition-all ${
                  selectedStyle.id === style.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedStyle.id === style.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-transparent'
                }`}>
                  <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  selectedStyle.id === style.id ? 'text-indigo-400' : 'text-gray-500'
                }`}>
                  {style.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Aspek Rasio */}
        <section className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-400">Aspek Rasio</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setAspectRatio(ratio.value)}
                className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                  aspectRatio === ratio.value 
                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tombol Buat */}
        <button
          onClick={handleGenerate}
          disabled={appState === AppState.GENERATING || !prompt.trim()}
          className={`mt-auto py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all ${
            appState === AppState.GENERATING || !prompt.trim()
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'gradient-bg text-white hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98]'
          }`}
        >
          {appState === AppState.GENERATING ? (
            <>
              <RefreshCcw className="animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Sparkles />
              Buat Karya Seni
            </>
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#020617] p-4 md:p-8 flex flex-col gap-8 h-screen overflow-y-auto custom-scrollbar relative">
        {/* Aesthetic Realtime Clock */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
          <AestheticClock />
        </div>

        {/* Gallery Area */}
        <section className="flex-1 flex flex-col mt-12 md:mt-0">
          {appState === AppState.IDLE && !currentImage && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in duration-700">
              <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center text-indigo-500 mb-2">
                <ImageIcon size={48} />
              </div>
              <h2 className="text-3xl font-bold">Wujudkan Imajinasi Anda</h2>
              <p className="max-w-md text-gray-400 leading-relaxed">
                Ketikkan deskripsi gambar yang Anda inginkan di bilah sisi dan saksikan keajaiban AI bekerja.
              </p>
            </div>
          )}

          {appState === AppState.GENERATING && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-indigo-400 w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Sedang Meracik Keajaiban...</h3>
                <p className="text-gray-400">AI kami sedang menerjemahkan kata-kata Anda menjadi piksel</p>
              </div>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 bg-red-500/5 rounded-3xl p-8 border border-red-500/20">
              <AlertCircle className="text-red-500 w-16 h-16" />
              <h3 className="text-2xl font-bold text-red-400">Ups! Terjadi Masalah</h3>
              <p className="text-gray-400 max-w-sm">{errorMessage}</p>
              <button 
                onClick={handleGenerate}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {(appState === AppState.SUCCESS || currentImage) && currentImage && (
            <div className="flex-1 flex flex-col gap-6 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ImageIcon className="text-indigo-500" />
                  Karya Terbaru
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadImage(currentImage.url, `farhanimasi-ai-${currentImage.id}.png`)}
                    className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all flex items-center gap-2 text-sm"
                  >
                    <Download size={18} /> Simpan
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    <RefreshCcw size={18} /> Buat Ulang
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative group bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden flex items-center justify-center p-4">
                <img 
                  src={currentImage.url} 
                  alt={currentImage.prompt} 
                  className={`max-w-full max-h-full object-contain shadow-2xl rounded-xl transition-opacity duration-1000 ${appState === AppState.GENERATING ? 'opacity-30' : 'opacity-100'}`}
                />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <p className="text-sm font-medium text-white mb-1">Prompt:</p>
                  <p className="text-xs text-gray-300 italic line-clamp-2">"{currentImage.prompt}"</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* History Area */}
        {history.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="text-indigo-400" />
                Riwayat Pembuatan
              </h3>
              <button 
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Hapus Semua
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 w-32 md:w-48 group relative cursor-pointer"
                  onClick={() => setCurrentImage(item)}
                >
                  <div className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImage?.id === item.id ? 'border-indigo-500' : 'border-gray-800'
                  }`}>
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter truncate">{item.style}</p>
                    <p className="text-xs text-gray-300 truncate">{item.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Mobile Call-to-Action */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 p-4 glass-panel border-t border-gray-800 flex gap-4 z-20">
         <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ketik ide..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 text-sm text-white focus:outline-none"
         />
         <button 
            onClick={handleGenerate}
            disabled={appState === AppState.GENERATING || !prompt.trim()}
            className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all disabled:opacity-50"
         >
            {appState === AppState.GENERATING ? <RefreshCcw className="animate-spin" /> : <Send size={20} />}
         </button>
      </div>
    </div>
  );
};

export default App;

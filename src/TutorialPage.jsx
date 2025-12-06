import React, { useState } from 'react';
import { 
  ScanFace, Mic, FileSearch, Globe, Sun, 
  ArrowRight, Play, Shield, MousePointer, 
  CheckCircle, ChevronRight, Zap, Target
} from 'lucide-react';

const TutorialPage = ({ navigateTo }) => {
  const [activeStep, setActiveStep] = useState(0);

  // ข้อมูลเครื่องมือจาก App.jsx ของคุณ นำมาจัดรูปแบบใหม่
  const tools = [
    { 
      id: 'face', 
      icon: <ScanFace size={24} />, 
      title: "Face Scanner", 
      desc: "ตรวจจับความผิดปกติของกล้ามเนื้อและการกระพริบตา",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    { 
      id: 'voice', 
      icon: <Mic size={24} />, 
      title: "Voice Analyzer", 
      desc: "วิเคราะห์คลื่นเสียง หาจุดตัดต่อที่ไม่ต่อเนื่อง",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    { 
      id: 'meta', 
      icon: <FileSearch size={24} />, 
      title: "Metadata Check", 
      desc: "เจาะลึกข้อมูลเบื้องหลังไฟล์ วันที่และอุปกรณ์ที่ใช้",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    { 
      id: 'light', 
      icon: <Sun size={24} />, 
      title: "Lighting Check", 
      desc: "เช็คทิศทางแสงเงา เทียบวัตถุกับฉากหลัง",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    { 
      id: 'search', 
      icon: <Globe size={24} />, 
      title: "Reverse Search", 
      desc: "ค้นหาต้นตอของภาพจากทั่วโลกอินเทอร์เน็ต",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "รับภารกิจ (Mission Brief)",
      desc: "อ่านรายละเอียดคดีให้ชัดเจน คำใบ้ (Hint) คือกุญแจสำคัญที่จะบอกว่าต้องใช้เครื่องมือชิ้นไหน",
      icon: <Target className="text-cyan-400" />
    },
    {
      step: "02",
      title: "เลือกเครื่องมือ (Select Tools)",
      desc: "คลิกเลือกเครื่องมือที่ 'จำเป็น' เท่านั้น (Required) ระวัง! การเลือกเครื่องมือที่ 'ต้องห้าม' (Forbidden) จะทำให้ถูกตัดคะแนน",
      icon: <MousePointer className="text-cyan-400" />
    },
    {
      step: "03",
      title: "วิเคราะห์ผล (Analyze)",
      desc: "ระบบจะทำการประมวลผลและแสดงแถบวิเคราะห์ เมื่อครบ 100% AI จะสรุปผลให้คุณทราบทันที",
      icon: <Zap className="text-cyan-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-xs font-medium mb-8 animate-fade-in-up">
          <Shield size={14} />
          <span>CYBER DETECTIVE MANUAL v2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
          Master the Art of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Deepfake Detection</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          เรียนรู้วิธีใช้งานเครื่องมือตรวจสอบสื่อสังเคราะห์ระดับสูง เพื่อแยกแยะ "ความจริง" ออกจาก "สิ่งลวงตา" ด้วยเทคโนโลยี AI
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => navigateTo('game')}
            className="group relative bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-cyan-50 transition-all flex items-center gap-2"
          >
            เข้าสู่ห้องแล็บ
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => document.getElementById('tools-grid').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 rounded-full font-bold text-sm text-white border border-slate-700 hover:bg-slate-800 transition-all"
          >
            ดูเครื่องมือ
          </button>
        </div>
      </div>

      {/* --- BENTO GRID: TOOLS --- */}
      <div id="tools-grid" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-white mb-12 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-cyan-500"></span>
          ARSENAL TOOLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[180px]">
          {/* Main Large Card */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-900/50 border border-slate-800 p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                  <Play size={24} fill="currentColor" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Real-time Analysis Core</h3>
                <p className="text-slate-400 max-w-md">
                  หัวใจสำคัญของระบบคือ AI Engine ที่ประมวลผลข้อมูลจากเครื่องมือย่อยทั้ง 5 ชนิดมารวมกัน เพื่อคำนวณความน่าจะเป็นของ Deepfake ในเสี้ยววินาที
                </p>
              </div>
              <div className="flex gap-2 mt-8">
                {[1,2,3].map(i => (
                  <div key={i} className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 animate-pulse" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Small Tool Cards */}
          {tools.map((tool, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between group hover:bg-slate-800/50 transition-all hover:-translate-y-1 ${tool.border} hover:border-opacity-50`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-lg ${tool.bg} flex items-center justify-center ${tool.color}`}>
                  {tool.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Tool 0{idx + 1}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">{tool.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{tool.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- HOW IT WORKS (Vertical Timeline) --- */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-white mb-16 text-center">WORKFLOW</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              onMouseEnter={() => setActiveStep(index)}
              className={`relative p-8 rounded-3xl border transition-all duration-300 cursor-default ${
                activeStep === index 
                ? 'bg-slate-800/80 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
                : 'bg-transparent border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`text-5xl font-bold font-mono transition-colors ${activeStep === index ? 'text-cyan-500/20' : 'text-slate-800'}`}>
                  {step.step}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    {step.icon}
                    <h3 className={`text-xl font-bold transition-colors ${activeStep === index ? 'text-white' : 'text-slate-400'}`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className={`text-sm transition-colors leading-relaxed ${activeStep === index ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.desc}
                  </p>
                </div>
                <div className={`self-center transition-opacity ${activeStep === index ? 'opacity-100' : 'opacity-0'}`}>
                  <ChevronRight className="text-cyan-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="border-t border-slate-900 bg-slate-950 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-white mb-6">พร้อมปฏิบัติหน้าที่แล้วหรือยัง?</h2>
          <p className="text-slate-400 mb-8">เข้าร่วมทีมนักสืบไซเบอร์และปกป้องโลกดิจิทัลจากข้อมูลเท็จ</p>
          <button 
             onClick={() => navigateTo('game')}
             className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
          >
            เริ่มภารกิจแรกทันที
          </button>
        </div>
      </div>

    </div>
  );
};

export default TutorialPage;
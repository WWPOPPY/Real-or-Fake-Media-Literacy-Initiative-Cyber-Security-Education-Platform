




import React, { useState, useEffect, useRef } from 'react';
// --- เพิ่ม 2 บรรทัดนี้เข้าไปครับ ---
import { toPng } from 'html-to-image'; // ✅ เพิ่มบรรทัดนี้แทน
import { jsPDF } from 'jspdf';

// --- 1. Firebase Imports (รวมให้เหลือชุดเดียว ไม่ซ้ำ) ---
import { initializeApp } from 'firebase/app';
import { 
  getAnalytics 
} from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  FacebookAuthProvider,
  TwitterAuthProvider,
  updateProfile,
  signInWithCustomToken
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  getDoc, 
  setDoc, 
  increment,
  onSnapshot
} from "firebase/firestore";

// --- 2. Icon Imports (คงเดิมไว้) ---
import {
  Shield, Search, Eye, Globe, FileSearch, AlertTriangle,
  CheckCircle, Award, Map, Lock, Play, ScanFace,
  Mic, Sun, Cpu, User, Share2, Terminal, Sparkles, RefreshCw,
  LogOut, LogIn, Edit2, Save, Download, Image as ImageIcon, FileText,
  Menu, X, Mail, Phone, MapPin, HelpCircle, Info, ChevronDown, ChevronUp,
  Facebook, Twitter, Instagram, Footprints, ArrowRight, Github, GraduationCap, BookOpen, Info as InfoIcon,
  Zap, Crosshair, Binary, Fingerprint, Activity, Bot, Star, Unlock, Target, Users, ExternalLink, Youtube,
  Maximize2, Minimize2, Radio, ClipboardList, Book, Layout, UserCheck, BrainCircuit, Lightbulb, MousePointerClick,
  Settings, Medal, UserCircle, FastForward
} from 'lucide-react';



// --- Configuration ---
const apiKey = "AIzaSyDNOcMqW6ulbhDX6CH5K6UaFMZ2rARC3tE"; 

const localFirebaseConfig = {
  apiKey: "AIzaSyAuR4Bx5zvou5WCYSMfxIwAIznG2JzbDCM",
  authDomain: "real-or-fake-etc-e500e.firebaseapp.com",
  projectId: "real-or-fake-etc-e500e",
  storageBucket: "real-or-fake-etc-e500e.firebasestorage.app",
  messagingSenderId: "635450603022",
  appId: "1:635450603022:web:7670119e99e63bd0bbae5f",
  measurementId: "G-GB5S1M82QY"
};

// --- Initialize Firebase ---

// 🎯 เพิ่มบรรทัดนี้: ประกาศตัวแปร appId ให้เป็น Global
const appId = localFirebaseConfig.appId;

// --- Initialize Firebase ---
// ...
const app = initializeApp(localFirebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// --- จบส่วนแก้ไข (ข้างล่างนี้จะเป็น function App() { ... ) ---

// --- GLOBAL DATA ---

const teamMembers = [
  { name: "นายกรภัทร เพราะสายเมือง", id: "6842402127", role: "นิสิตปริญญาบัณฑิต ชั้นปีที่ 1", image: "https://drive.google.com/thumbnail?id=1bHXZvSTe_zUfJY8Z6w8y6M1vfrOXXC3p" },
  { name: "นายณภัทร รัตนบุรี", id: "6842406727", role: "นิสิตปริญญาบัณฑิต ชั้นปีที่ 1", image: "https://drive.google.com/thumbnail?id=1XCOSLkaazGYhDHTKytuIRXdRmeSJj4Pi" },
  { name: "นางสาวพรปวีณ์ ศรุติกิตติเสถียร", id: "6842413027", role: "นิสิตปริญญาบัณฑิต ชั้นปีที่ 1", image: "https://drive.google.com/thumbnail?id=1Ib6xmJexms5iU7FNdWwWAC3Oxx_J2ECs" },
];

const tools = [
  { id: 'face_scan', name: 'Face Scanner', thName: 'สแกนใบหน้า', color: 'bg-blue-500', icon: <ScanFace size={24} />, desc: "ตรวจจับความผิดปกติของกล้ามเนื้อใบหน้า การกระพริบตา และรอยต่อ Deepfake" },
  { id: 'voice_anl', name: 'Voice Analyzer', thName: 'วิเคราะห์เสียง', color: 'bg-purple-500', icon: <Mic size={24} />, desc: "ตรวจสอบคลื่นเสียง (Waveform) เพื่อหาความไม่ต่อเนื่อง หรือเสียงสังเคราะห์จาก AI" },
  { id: 'meta_data', name: 'Metadata Check', thName: 'ดูข้อมูลไฟล์', color: 'bg-emerald-500', icon: <FileSearch size={24} />, desc: "เจาะลึกข้อมูลเบื้องหลังไฟล์ (EXIF) วันที่สร้าง กล้องที่ใช้ หรือประวัติการแก้ไข" },
  { id: 'rev_search', name: 'Reverse Search', thName: 'ค้นหาต้นตอ', color: 'bg-orange-500', icon: <Globe size={24} />, desc: "ค้นหาย้อนกลับบนอินเทอร์เน็ต เพื่อดูว่าภาพ/คลิปนี้เคยปรากฏที่ไหนมาก่อนหรือไม่" },
  { id: 'light_chk', name: 'Lighting Check', thName: 'เช็คแสงเงา', color: 'bg-yellow-500', icon: <Sun size={24} />, desc: "วิเคราะห์ทิศทางแสงและเงา (Shadow Logic) ว่าสอดคล้องกับสภาพแวดล้อมหรือไม่" },
  { id: 'logic_chk', name: 'Logic Analyzer', thName: 'ความเป็นไปได้', color: 'bg-pink-500', icon: <BrainCircuit size={24} />, desc: "วิเคราะห์ตรรกะ ความสมเหตุสมผลทางฟิสิกส์ และบริบทของสถานการณ์ (Contextual Logic)" },
];

const coreMissions = [
  { id: 1, title: "คดีที่ 1: คลิปหลุดคนดัง?", subTitle: "Deepfake Video", description: "มีคลิปนักแสดงชื่อดังพูดเชียร์เว็บพนัน! หน้าตาดูแข็งๆ ไม่เป็นธรรมชาติ จงตรวจสอบว่าเป็น Deepfake หรือไม่", hint: "Deepfake มักมีจุดบอดที่การกระพริบตาและแสงเงาที่ไม่สอดคล้องกับฉาก", required: ['face_scan', 'light_chk'], forbidden: ['voice_anl'], xpReward: 100 },
  { id: 2, title: "คดีที่ 2: เสียงปริศนาขอยืมเงิน", subTitle: "AI Voice Cloning", description: "เพื่อนโทรมาขอยืมเงินด่วน แต่เบอร์แปลกๆ และน้ำเสียงดูเรียบเฉยผิดปกติ เหมือนหุ่นยนต์", hint: "เสียงจาก AI มักจะไม่มีจังหวะหายใจ และเบอร์โทรอาจไม่ตรงกับฐานข้อมูล", required: ['voice_anl', 'rev_search'], forbidden: ['face_scan'], xpReward: 150 },
  { id: 3, title: "คดีที่ 3: ภาพข่าวปลอมระบาด", subTitle: "Gen-AI Image", description: "ภาพเหตุการณ์ประท้วงรุนแรงที่ไม่มีสำนักข่าวไหนรายงาน รายละเอียดในภาพดูเบลอๆ", hint: "ภาพ AI มักมีปัญหาที่นิ้วมือ ตัวหนังสือ หรือ Metadata ที่ระบุวันที่ไม่ถูกต้อง", required: ['meta_data', 'rev_search'], forbidden: ['voice_anl'], xpReward: 200 },
  { id: 4, title: "คดีที่ 4: CEO ปลอมตัว", subTitle: "Real-time Face Swap", description: "วิดีโอคอลจาก CEO สั่งให้โอนเงินด่วน! แต่ขอบหน้าดูเบลอๆ เวลาขยับตัวเร็วๆ", hint: "Real-time Deepfake มักมี Latency และ Artifacts บริเวณขอบใบหน้า", required: ['face_scan', 'rev_search'], forbidden: ['meta_data'], xpReward: 250 },
  { id: 5, title: "คดีที่ 5: เอกสารลับหลุด?", subTitle: "Digital Forgery", description: "เอกสารราชการที่มีลายเซ็นแปลกๆ และฟอนต์ที่ไม่เท่ากัน", hint: "การตัดต่อเอกสารมักทิ้งร่องรอย Metadata และความไม่สมบูรณ์ของแสงเงาบนกระดาษ", required: ['meta_data', 'light_chk'], forbidden: ['voice_anl'], xpReward: 300 },
  { id: 6, title: "คดีที่ 6: ช้างแว้น?", subTitle: "Viral Video Edit", description: "คลิปวิดีโอถูกเผยแพร่โดยผู้ขับขี่รถยนต์บนท้องถนน โดยด้านข้างมีผู้ขับขี่มอเตอร์ไซต์พร้อมช้างที่ซ้อนด้านหลัง ด้านผู้ขับขี่รถยนต์มีการพูดว่า ช้างใช่ไหมช้างแว้นมอเตอร์ไซต์นี่มันบ้าไปแล้ว", hint: "วิเคราะห์แสงเงาบนตัวช้าง (Lighting), ตรวจสอบคลื่นเสียงการพูด (Voice), และค้นหาที่มาของคลิป (Reverse Search)", required: ['light_chk', 'voice_anl', 'rev_search'], forbidden: ['face_scan'], xpReward: 350, videoUrl: "https://drive.google.com/file/d/1PE4P_JwbU1Dk98LBxfD36gt3HumZppw_/preview" },
  { id: 7, title: "คดีที่ 7: พายุหมุนแมวเหมียว?", subTitle: "Viral Effect", description: "คลิปวิดีโอปรากฏแมวและสุนัขที่อยู่หน้าบ้าน ถูกลมพัดเข้าไปในพายุ", hint: "ตรวจสอบความสมจริงของแสงเงา (Lighting), วิเคราะห์เสียงลมและสัตว์ (Voice), และค้นหาที่มา (Reverse Search)", required: ['light_chk', 'voice_anl', 'rev_search'], forbidden: ['face_scan'], xpReward: 400, videoUrl: "https://drive.google.com/file/d/1EZmOi_aE9rJmfj-2p3cE9a4yqKQB938D/preview" },
  { id: 8, title: "คดีที่ 8: กระโดดเชือกทะลุมิติ?", subTitle: "Impossible Physics", description: "คลิปวิดีโอสาวกำลังออกกำลังกายด้วยการกระโดดเชือก หลังจากนั้นไม่นานพื้นไม้ก็ถล่มลงมาด้านล่าง พร้อมเสียงชายตะโกนไม่ทราบความหมาย", hint: "ตรวจสอบใบหน้า (Face), แสงเงา (Lighting), เสียงตะโกน (Voice) และที่มาของคลิป (Reverse Search)", required: ['face_scan', 'light_chk', 'voice_anl'], forbidden: ['meta_data'], xpReward: 450, videoUrl: "https://drive.google.com/file/d/18GfuVIjPa732NoW0wP_Ll3At-Z0XeVUA/preview" },
  { id: 9, title: "คดีที่ 9: สิงโตนักล่า?", subTitle: "Animal Attack?", description: "นักท่องเที่ยวเป็นชาวต่างชาติอยู่บนรถ หลังจากนั้นมีสิงโตกระโดดเข้ามามีลักษณะคล้ายต้องการทำร้ายพร้อมทั้งส่งเสียงคำราม ต่อมานักท่องเที่ยวหญิงคนหนึ่งมีท่าทีจะเปิดประตูรถและภาพก็ตัดไป", hint: "ตรวจสอบความสมจริงของใบหน้าคนและสัตว์ (Face), เสียงคำราม (Voice), และค้นหาต้นตอ (Reverse Search)", required: ['face_scan', 'voice_anl', 'rev_search'], forbidden: ['light_chk'], xpReward: 500, videoUrl: "https://drive.google.com/file/d/1Zt4ZACa4Wxp-X1O2H8ulWUKlRd_DuJi6/preview" },
  { id: 10, title: "คดีที่ 10: สารลับสีเหลือง?", subTitle: "Glitched Reality", description: "คลิปวิดีโอชายป้อนอาหารให้กับเด็กชายคนหนึ่งหลังจากนั้นก็มีของเหลวสีเหลืองไหลออกมาจากด้านหลัง", hint: "ตรวจสอบใบหน้าบุคคล (Face) และความผิดปกติของแสงเงาวัตถุ (Lighting)", required: ['face_scan', 'light_chk'], forbidden: ['voice_anl'], xpReward: 550, videoUrl: "https://drive.google.com/file/d/1DhsYPEFpRwL55wLSTwvoH95d29AEAO08/preview" },
  { id: 11, title: "คดีที่ 11: สุนัขฮีโร่?", subTitle: "Hero Dog", description: "คลิปวิดีโอ โทรทัศน์กำลังจะหล่นมาทับเด็กชายซึ่งกำลังนั่งเล่นอยู่กับสุนัข ระหว่างนั้นสุนัขจึงเอาตัวเข้ามาบังโทรทัศน์ให้กับเด็กชาย และชายวัยกลางคนวิ่งเข้ามาด้วยความตกใจ เข้ามาเพื่อยกโทรทัศน์ออก มีเสียงพูดในลักษณะถามอาการเด็กชาย และชื่นชมสุนัข", hint: "ตรวจสอบใบหน้า (Face), เสียงพูด (Voice), และแสงเงา (Lighting)", required: ['face_scan', 'voice_anl', 'light_chk'], forbidden: ['rev_search'], xpReward: 600, videoUrl: "https://drive.google.com/file/d/1Bghb2R_Fa7f_pW3cE_yAB7D3g8uAGVHk/preview" },
  { id: 12, title: "คดีที่ 12: จระเข้บุกบ้าน?", subTitle: "Animal Intruder", description: "คลิปวิดีโอจระเข้พยายามจะเข้าบ้าน และเข้ามาทำร้ายเด็กชาย หลังจากนั้นแม่เด็กชายจึงเอาสายฉีดน้ำออกมาฉีดใส่จระเข้ พร้อมเสียงกรีดร้องของเด็กและเสียงตะโกนให้ปิดประตูของแม่", hint: "เช็คแสงเงา (Lighting), วิเคราะห์เสียงกรีดร้อง (Voice), และสแกนใบหน้า (Face)", required: ['light_chk', 'voice_anl', 'face_scan'], forbidden: ['meta_data'], xpReward: 650, videoUrl: "https://drive.google.com/file/d/1H_ag4jD9HwkDlgh9WvaVCwMDr47Zcr6x/preview" },
  { id: 13, title: "คดีที่ 13: ข่าวเราชนะ?", subTitle: "Fake News", description: "ข่าว เราชนะเฟส4 ในช่วงปีพ.ศ.2565 มีเนื้อหาข่าวว่าจะเริ่มโอนวันที่ 10 กุมภาพันธ์ คนละ 7,000 บาท", hint: "ดูรายละเอียดไฟล์ (Metadata) และค้นหาต้นตอข่าว (Reverse Search)", required: ['meta_data', 'rev_search'], forbidden: ['voice_anl'], xpReward: 700, imageUrl: "https://drive.google.com/thumbnail?id=1kNGWcsqhs53HCUqnUOkCYc57q91vwanu&sz=w1280" },
  { id: 14, title: "คดีที่ 14: พิธีกรรมลึกลับ?", subTitle: "Supernatural?", description: "คลิปหญิงสาวกรีดร้องห้อยศีรษะบนเพดาน ขณะมีการทำพิธีสวดบางอย่าง", hint: "วิเคราะห์เสียง (Voice), แสงเงา (Lighting), และความเป็นไปได้ทางฟิสิกส์ (Logic)", required: ['voice_anl', 'light_chk', 'logic_chk'], forbidden: ['meta_data'], xpReward: 750, videoUrl: "https://drive.google.com/file/d/1D1qKSaOVJOMPv-t5nYMAc1JufE7LD2ff/preview" },
  { id: 15, title: "คดีที่ 15: จิงโจ้นักเดินทาง?", subTitle: "Animal Travel", description: "คลิปจิงโจ้ถือตั๋วโดยสารเครื่องบินไม่ทราบสายการบิน พร้อมหญิงสาวชาวต่างชาติคล้ายกำลังโต้เถียงกัน", hint: "วิเคราะห์เสียง (Voice), แสงเงา (Lighting), และความเป็นไปได้ (Logic)", required: ['voice_anl', 'light_chk', 'logic_chk'], forbidden: ['meta_data'], xpReward: 800, videoUrl: "https://drive.google.com/file/d/1CUq69Cu8PkIpCeTX-8k1bWwUxS2Q5kbe/preview" }
];

const BADGES = [
    { id: 'newbie', name: 'Rookie Agent', description: 'เริ่มต้นเส้นทางนักสืบไซเบอร์', icon: <UserCheck size={24} />, condition: u => true },
    { id: 'first_blood', name: 'First Case Solved', description: 'ปิดคดีแรกสำเร็จ', icon: <Search size={24} />, condition: u => u.completedMissions?.length >= 1 },
    { id: 'field_agent', name: 'Field Agent', description: 'ปิดคดีครบ 5 คดี', icon: <Shield size={24} />, condition: u => u.completedMissions?.length >= 5 },
    { id: 'senior', name: 'Senior Investigator', description: 'ปิดคดีครบ 10 คดี', icon: <Star size={24} />, condition: u => u.completedMissions?.length >= 10 },
    { id: 'grandmaster', name: 'Grandmaster', description: 'พิชิตทุกคดีในระบบ', icon: <Award size={24} />, condition: u => u.completedMissions?.length >= 15 },
    { id: 'xp_warrior', name: 'XP Warrior', description: 'สะสม XP ครบ 1000 แต้ม', icon: <Zap size={24} />, condition: u => u.totalXp >= 1000 },
];

const faqData = [
  { q: "Deepfake คืออะไร?", a: "Deepfake คือสื่อสังเคราะห์ (ภาพ, เสียง, วิดีโอ) ที่สร้างขึ้นโดยปัญญาประดิษฐ์ (AI) เพื่อเลียนแบบบุคคลจริง มักถูกใช้ในการหลอกลวงหรือสร้างความเข้าใจผิด" },
  { q: "เกมนี้มีค่าใช้จ่ายหรือไม่?", a: "โครงการ REAL OR FAKE เปิดให้ใช้งานฟรีสำหรับประชาชนทั่วไป เพื่อส่งเสริมทักษะการรู้เท่าทันสื่อ (Media Literacy)" },
  { q: "ฉันจะได้รับเกียรติบัตรเมื่อไหร่?", a: "คุณจะได้รับเกียรติบัตรดิจิทัลเมื่อผ่านการทดสอบครบทั้ง 15 เลเวลและได้รับยศ Grandmaster Cyber Detective" },
  { q: "ข้อมูลส่วนตัวของฉันปลอดภัยไหม?", a: "เราใช้ Google Firebase ในการยืนยันตัวตน ข้อมูลส่วนบุคคลของคุณจะถูกเก็บรักษาอย่างปลอดภัยตามมาตรฐานสากล" }
];

// --- STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;700&display=swap');
    body { font-family: 'Sarabun', sans-serif; background-color: #020617; color: white; margin: 0; overflow-x: hidden; scroll-behavior: smooth; }
    h1, h2, h3, h4, .cyber-font { font-family: 'Rajdhani', sans-serif; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
    
    /* --- SCROLL ANIMATION CLASSES --- */
    .scroll-trigger {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease-out;
    }
    .scroll-trigger.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .delay-100 { transition-delay: 0.1s; }
    .delay-200 { transition-delay: 0.2s; }
    .delay-300 { transition-delay: 0.3s; }

    /* --- CYBERPUNK EFFECTS --- */
    .scanlines { 
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2)); 
      background-size: 100% 4px; 
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 90; pointer-events: none; opacity: 0.15; 
    }
    
    @keyframes glitch { 
      0% { text-shadow: 2px 0 rgba(0,255,255,0.7), -2px 0 rgba(255,0,255,0.7); } 
      25% { text-shadow: -2px 0 rgba(0,255,255,0.7), 2px 0 rgba(255,0,255,0.7); } 
      50% { text-shadow: -1px 0 rgba(0,255,0,0.7), 1px 0 rgba(0,0,255,0.7); } 
      75% { text-shadow: 1px 0 rgba(0,255,0,0.7), -1px 0 rgba(0,0,255,0.7); } 
      100% { text-shadow: 2px 0 rgba(0,255,255,0.7), -2px 0 rgba(255,0,255,0.7); } 
    }
    .glitch-text:hover { animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; }
    
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    .animate-float-slow { animation: float 6s ease-in-out infinite; }
    
    .neon-border { box-shadow: 0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3); }
    .neon-text { text-shadow: 0 0 5px rgba(6, 182, 212, 0.8), 0 0 10px rgba(6, 182, 212, 0.5); }
    
    /* --- GAME HUD --- */
    .hud-border {
      position: absolute;
      pointer-events: none;
      border: 1px solid rgba(6, 182, 212, 0.3);
      z-index: 10;
    }
    .hud-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: #06b6d4;
      border-style: solid;
      pointer-events: none;
      z-index: 20;
    }
    .hud-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
    .hud-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
    .hud-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
    .hud-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
    
    .tool-active-scan { animation: scan-pulse 2s infinite; }
    @keyframes scan-pulse {
      0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
      100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
    }
    
    /* Login Inputs */
    .login-input { width: 100%; padding: 12px 16px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(6,182,212,0.3); border-radius: 8px; font-weight: 500; color: #fff; transition: all 0.3s; font-size: 14px; }
    .login-input:focus { outline: none; border-color: #22d3ee; box-shadow: 0 0 15px rgba(34,211,238,0.2); background: rgba(15, 23, 42, 0.8); }
    .login-btn { width: 100%; padding: 12px; background: linear-gradient(to right, #0891b2, #2563eb); color: white; border: none; border-radius: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
    .login-btn:hover { transform: translateY(-2px); box-shadow: 0 0 20px rgba(34,211,238,0.4); }
    .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    
    /* Round Btn */
    .round-btn { display: flex; align-items: center; justify-content: flex-start; width: 45px; height: 45px; border: none; border-radius: 50%; cursor: pointer; position: relative; overflow: hidden; transition-duration: .3s; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199); }
    .round-btn-sign { width: 100%; transition-duration: .3s; display: flex; align-items: center; justify-content: center; }
    .round-btn-text { position: absolute; right: 0%; width: 0%; opacity: 0; color: white; font-size: 1em; font-weight: 600; transition-duration: .3s; padding-right: 5px; white-space: nowrap; }
    .round-btn:hover { width: 140px; border-radius: 40px; transition-duration: .3s; }
    .round-btn:hover .round-btn-sign { width: 30%; transition-duration: .3s; padding-left: 15px; }
    .round-btn:hover .round-btn-text { opacity: 1; width: 70%; transition-duration: .3s; padding-right: 15px; }
    .round-btn:active { transform: translate(2px ,2px); }
    
    /* Grid Background */
    .bg-grid {
      background-size: 40px 40px;
      background-image: linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
    }
  `}</style>
);

// --- HELPER COMPONENTS ---

const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = '0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.05)'; // Darker fade for cleaner trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const isCyan = Math.random() > 0.8; // More cyan
        ctx.fillStyle = isCyan ? '#22d3ee' : '#0e7490';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-10 pointer-events-none" />;
};

const MovingBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-grid z-0"></div>
    <style>{`@keyframes float { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } } .blob { position: absolute; filter: blur(80px); opacity: 0.3; animation: float 10s infinite ease-in-out; }`}</style>
    <div className="blob bg-blue-600 w-96 h-96 rounded-full top-0 left-0 mix-blend-screen"></div>
    <div className="blob bg-cyan-500 w-96 h-96 rounded-full bottom-0 right-0 animation-delay-2000 mix-blend-screen"></div>
    <div className="blob bg-purple-600 w-80 h-80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animation-delay-4000 mix-blend-screen"></div>
  </div>
);

const GlitchText = ({ text, className = "", size = "text-4xl" }) => (
  <div className={`relative group inline-block ${className}`}>
    <span className={`relative z-10 ${size} font-bold text-white`}>{text}</span>
    <span className={`absolute top-0 left-0 -z-10 w-full ${size} font-bold text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-75`}>{text}</span>
    <span className={`absolute top-0 left-0 -z-10 w-full ${size} font-bold text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-75 delay-75`}>{text}</span>
  </div>
);

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    ref.current.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
  };
  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  };
  return <div ref={ref} className={`transition-transform duration-200 ease-out transform-gpu interactive ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>{children}</div>;
};

const SocialRoundButton = ({ icon, label, onClick, bgColor }) => (
  <button className="round-btn" onClick={onClick} style={{ backgroundColor: bgColor }}>
    <div className="round-btn-sign text-white">{icon}</div>
    <div className="round-btn-text">{label}</div>
  </button>
);

const CoolButton = ({ icon, label, onClick, colorClass = "hover:bg-cyan-600", widthClass = "hover:w-[140px]", className = "", disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className={`cool-btn ${colorClass} ${widthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:border-cyan-400'} interactive border border-white/10 backdrop-blur-md`}>
    <div className="cool-btn-icon">{icon}</div><div className="cool-btn-text cyber-font tracking-wider">{label}</div>
  </button>
);

const TargetIcon = () => <Crosshair size={24} className="text-cyan-400 animate-spin-slow" />;

const TeamCard = ({ name, id, role, image }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <TiltCard className="h-full">
      <div className="relative bg-slate-900/60 border border-cyan-500/30 p-6 rounded-2xl flex flex-col items-center text-center h-full backdrop-blur-md overflow-hidden group hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="w-24 h-24 mb-4 rounded-full border-2 border-cyan-500/50 p-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-500 group-hover:scale-110">
          <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center relative">
            {!imgError && image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <User size={48} className="text-slate-500 group-hover:text-cyan-300 transition-colors" />
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors cyber-font tracking-wide">{name}</h3>
        <div className="inline-flex items-center gap-1 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20 mb-2">
          <Terminal size={10} className="text-cyan-500" />
          <p className="text-cyan-400 text-xs font-mono">{id}</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-3"></div>
        <p className="text-slate-400 text-xs leading-relaxed">{role}</p>
      </div>
    </TiltCard>
  );
};

const Typewriter = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => { if (i < text.length) { setDisplayedText((prev) => prev + text.charAt(i)); i++; } else { clearInterval(timer); } }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span className="font-mono text-cyan-300">{displayedText}<span className="animate-pulse">_</span></span>;
};

const InitialLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("INITIALIZING...");
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const logs = ["LOADING KERNEL...", "MOUNTING FILE SYSTEM...", "CONNECTING TO VERITAS SERVER...", "CALIBRATING NEURAL NETWORKS...", "SCANNING FOR ANOMALIES...", "VERIFYING INTEGRITY...", "ESTABLISHING SECURE PROTOCOL...", "SYSTEM READY."];
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase(2);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(prev + (Math.random() * 3 + 0.5), 100);
      });
    }, 50);
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) { setLog(logs[logIndex]); logIndex++; }
      if (logIndex > 3) setPhase(1);
    }, 400);
    return () => { clearInterval(interval); clearInterval(logInterval); };
  }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[99999] bg-[#020617] flex flex-col items-center justify-center font-mono overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
      <MatrixRain />
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        <div className="relative mb-12">
          <div className="w-32 h-32 border border-cyan-500/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]"></div>
          <div className="w-40 h-40 border border-dashed border-cyan-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite_reverse]"></div>
          <div className="w-24 h-24 bg-slate-900/80 backdrop-blur-md rounded-full border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] relative overflow-hidden">
            {phase === 0 ? <Cpu size={48} className="text-cyan-400 animate-pulse" /> : <ScanFace size={48} className="text-cyan-400" />}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-scan"></div>
          </div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-500 tracking-[0.2em]">VERITAS-OS v2.5</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-widest cyber-font glitch-text">REAL <span className="text-cyan-500">OR</span> FAKE</h1>
        <div className="text-xs text-cyan-300/70 mb-8 tracking-[0.3em] uppercase flex items-center gap-2"><Activity size={12} className="animate-pulse" /> Media Literacy Initiative</div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative mb-4"><div className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee] transition-all duration-75 ease-out relative" style={{ width: `${progress}%` }}><div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px]"></div></div></div>
        <div className="w-full flex justify-between items-end text-xs text-cyan-500 font-mono"><span className="animate-pulse">{log}</span><span>{Math.floor(progress)}%</span></div>
      </div>
    </div>
  );
};

const PageLoader = () => (
  <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-24 h-24 border-4 border-cyan-900 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Cpu className="text-cyan-500 animate-pulse" size={32} /></div>
    </div>
    <div className="mt-8 font-mono text-cyan-400 text-sm tracking-[0.3em] animate-pulse">INITIALIZING <span className="text-white">VERITAS</span> PROTOCOL...</div>
    <div className="w-64 h-1 bg-slate-800 mt-4 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '50%' }}></div></div>
    <style>{`@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
  </div>
);

const MediaVisualizer = ({ type, isAnalyzing }) => (
  <div className="relative w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
    {(type && (type.includes('Voice') || type.includes('Audio'))) && (
      <div className="flex items-center justify-center gap-1 h-32 relative z-10">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`w-2 bg-cyan-400/80 rounded-sm transition-all duration-75 shadow-[0_0_10px_#22d3ee] ${isAnalyzing ? 'animate-pulse' : ''}`} style={{ height: isAnalyzing ? `${Math.random() * 100}%` : '10%', animationDelay: `${i * 0.05}s` }}></div>
        ))}
      </div>
    )}
    {(type && (type.includes('Video') || type.includes('Face') || type.includes('Image'))) && (
      <div className="relative z-10 group">
        <div className={`w-48 h-48 border-2 border-cyan-500/50 rounded-lg relative overflow-hidden bg-slate-900/50 ${isAnalyzing ? 'animate-pulse' : ''}`}>
          {isAnalyzing && <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_1.5s_linear_infinite] z-20"></div>}
          <div className="absolute inset-0 flex items-center justify-center opacity-60"><ScanFace size={80} className="text-cyan-500/50" /></div>
          <div className="absolute top-2 left-2 text-[8px] text-cyan-500 font-mono">REC [00:0{Math.floor(Math.random() * 9)}]</div>
          <div className="absolute bottom-2 right-2 text-[8px] text-cyan-500 font-mono">ISO 800</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-cyan-500/30 rounded-full animate-spin-slow"></div>
        </div>
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>
    )}
  </div>
);

const HUDOverlay = ({ activeToolId }) => {
    if (!activeToolId) return null;

    return (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {activeToolId === 'face_scan' && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-64 h-64 border-2 border-blue-500 rounded-lg opacity-60 animate-pulse relative">
                       <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-blue-400"></div>
                       <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-blue-400"></div>
                       <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-blue-400"></div>
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-blue-400"></div>
                       <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/50"></div>
                       <div className="absolute top-0 left-1/2 h-full w-[1px] bg-blue-500/50"></div>
                       <div className="absolute top-2 left-2 text-[10px] text-blue-300 font-mono bg-blue-900/50 px-1">FACE_DETECT: ACTIVE</div>
                   </div>
                </div>
            )}
             {activeToolId === 'voice_anl' && (
                <div className="absolute bottom-10 left-0 right-0 h-32 flex items-end justify-center gap-1 px-10">
                   {[...Array(30)].map((_, i) => (
                       <div key={i} className="w-2 bg-purple-500/60 animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDuration: `${0.2 + Math.random()}s` }}></div>
                   ))}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-purple-300 font-mono bg-purple-900/50 px-1">AUDIO_WAVEFORM_ANALYSIS</div>
                </div>
            )}
             {(activeToolId === 'meta_data' || activeToolId === 'rev_search') && (
                <div className="absolute top-4 right-4 w-64 bg-slate-900/80 border border-green-500/30 p-2 font-mono text-[10px] text-green-400 animate-pulse">
                    <div>SEARCHING DATABASE...</div>
                    <div className="mt-1 text-white">Matches found: 0</div>
                    <div className="mt-1 text-white">Source ID: UNKNOWN</div>
                    <div className="mt-2 w-full h-1 bg-green-900"><div className="h-full bg-green-500 w-1/2 animate-[loading_1s_infinite]"></div></div>
                </div>
            )}
            {activeToolId === 'light_chk' && (
                    <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay flex items-center justify-center">
                        <div className="w-full h-full border-[20px] border-yellow-500/10 rounded-[40px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-300 font-mono text-sm bg-black/50 px-2 rounded">LIGHT_SOURCE_CALCULATION</div>
                    </div>
            )}
            {activeToolId === 'logic_chk' && (
                 <div className="absolute inset-0 bg-pink-500/5 mix-blend-overlay flex flex-col items-center justify-center gap-4">
                    <div className="w-48 h-48 border-2 border-dashed border-pink-500/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute text-pink-300 font-mono text-xs bg-black/70 px-3 py-1 rounded border border-pink-500/30 animate-pulse">ANALYZING LOGIC PATTERNS...</div>
                    <div className="grid grid-cols-3 gap-2 opacity-50">
                        {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{animationDelay: `${i * 0.1}s`}}></div>)}
                    </div>
                 </div>
            )}
        </div>
    )
}

const SurveyModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-slate-900/90 border border-cyan-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in zoom-in-95 duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
        <X size={24} />
      </button>
      
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-cyan-500/20 text-cyan-400 mb-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ClipboardList size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white cyber-font tracking-wide mb-2">ขอความอนุเคราะห์ช่วยตอบแบบสอบถาม</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-light">
          <p className="text-center text-cyan-100 font-medium">
            ขอความอนุเคราะห์เพื่อนๆ พี่ๆ น้องๆ ช่วยตอบแบบสอบถามงานวิจัยสั้นๆ เกี่ยวกับ สื่อปลอมที่สร้างด้วยปัญญาประดิษฐ์ (Deepfake) 🤖📰
          </p>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 my-4">
            <p className="flex items-center gap-2 text-sm text-slate-400 mb-2">
              <GraduationCap size={16} className="text-cyan-400" />
              AI Media Literacy Educational Platform: Real or Fake แพลตฟอร์มการเรียนรู้เพื่อพัฒนาความฉลาดรู้เท่าทันสื่อปัญญาประดิษฐ์: สื่อจริงหรือสื่อปลอม
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <BookOpen size={16} className="text-cyan-400" />
              นำเสนอโดย: นิสิตปริญญาบัณฑิต ชั้นปีที่ 1 คณะครุศาสตร์ สาขาเทคโนโลยีการศึกษา วิชาเอกเทคโนโลยีการศึกษา จุฬาลงกรณ์มหาวิทยาลัย
            </p>
          </div>
          
          <p>
            การตอบแบบสอบถามนี้เป็นส่วนหนึ่งของการประเมินโครงการเรียนรู้เรื่องสื่อปลอมจาก AI โดยใช้เกมจำลองการสืบสวน "REAL OR FAKE" เพื่อวัดผลสัมฤทธิ์ทางการเรียนรู้และความพึงพอใจของผู้ใช้งาน
          </p>
          <p className="font-semibold text-white mt-4">
            ขอขอบคุณทุกท่านที่สละเวลาอันมีค่าในการตอบแบบสอบถามเพื่อพัฒนางานวิจัยต่อไป 🙏
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="https://near.tl/sm/FWOwqIsda"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 interactive"
            onClick={onClose}
          >
            <ExternalLink size={20} />
            ไปหน้าแบบสอบถาม (ลิงก์ 1)
          </a>
          <a
            href="https://www.teddy17.fun/deepfake"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 border border-slate-500 flex items-center justify-center gap-2 interactive"
            onClick={onClose}
          >
            <ExternalLink size={20} />
            ไปหน้าแบบสอบถาม (ลิงก์ 2)
          </a>
        </div>
      </div>
    </div>
  </div>
);

const ManualPage = ({ onComplete }) => {
  const sectionRefs = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });
    
    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const sections = [
    {
      id: "intro",
      icon: <Terminal size={80} className="text-cyan-400" />,
      title: "WELCOME TO REAL OR FAKE",
      subtitle: "ระบบจำลองสถานการณ์เพื่อฝึกฝนทักษะ 'นักสืบไซเบอร์'",
      content: (
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <p className="text-lg text-slate-300 leading-relaxed">
            ยินดีต้อนรับสู่โปรแกรมฝึกอบรมพิเศษ ในยุคที่ความจริงถูกบิดเบือนได้ง่ายดายด้วยปลายนิ้ว 
            ภารกิจของคุณคือการแยกแยะ <span className="text-cyan-400 font-bold">"เรื่องจริง"</span> ออกจาก <span className="text-red-500 font-bold">"เรื่องลวง"</span>
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="flex flex-col items-center gap-2 animate-bounce">
                <MousePointerClick className="text-slate-400"/>
                <span className="text-xs text-slate-500">เลื่อนลงเพื่อเริ่มเรียนรู้</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "threat",
      icon: <ScanFace size={80} className="text-red-500" />,
      title: "THREAT ANALYSIS: DEEPFAKE",
      subtitle: "ภัยคุกคามรูปแบบใหม่ที่คุณต้องรู้เท่าทัน",
      content: (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-red-500/20">
              <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle/> Deepfake คืออะไร?</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                เทคโนโลยีการสร้างสื่อสังเคราะห์ (Synthetic Media) โดยใช้ปัญญาประดิษฐ์ (AI) 
                ในการสลับใบหน้า (Face Swap) หรือเลียนแบบเสียง (Voice Cloning) 
                เพื่อสร้างภาพลักษณ์ที่ดูสมจริงจนแทบแยกไม่ออก
              </p>
              <div className="w-full h-32 bg-black/50 rounded-lg overflow-hidden relative border border-white/10">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ScanFace size={48} className="text-red-500/50 animate-pulse"/>
                 </div>
                 <div className="absolute bottom-2 right-2 text-[10px] text-red-500 font-mono">AI GENERATION DETECTED</div>
              </div>
           </div>
           <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                 <h5 className="font-bold text-white mb-2">อันตรายของ Deepfake</h5>
                 <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-red-500 rounded-full mt-2"></div> การหลอกลวงทางการเงิน (Fraud)</li>
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-red-500 rounded-full mt-2"></div> การสร้างความเสื่อมเสียชื่อเสียง (Defamation)</li>
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-red-500 rounded-full mt-2"></div> การบิดเบือนข้อมูลข่าวสาร (Disinformation)</li>
                 </ul>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                 <h5 className="font-bold text-white mb-2">จุดสังเกตเบื้องต้น</h5>
                 <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-yellow-500 rounded-full mt-2"></div> การกระพริบตาที่ผิดธรรมชาติ</li>
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-yellow-500 rounded-full mt-2"></div> ขอบใบหน้าเบลอ หรือสีผิวไม่สม่ำเสมอ</li>
                    <li className="flex gap-2"><div className="min-w-[6px] h-1.5 bg-yellow-500 rounded-full mt-2"></div> เสียงพูดไม่มีจังหวะหายใจ</li>
                 </ul>
              </div>
           </div>
        </div>
      )
    },
    {
      id: "media-literacy",
      icon: <BrainCircuit size={80} className="text-yellow-400" />,
      title: "MEDIA LITERACY",
      subtitle: "ทักษะสำคัญของเด็กและเยาวชนในยุคดิจิทัล",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center text-slate-300 mb-8">
                <p className="text-lg">"อย่าเชื่อในสิ่งที่เห็น อย่าแชร์ในสิ่งที่ยังไม่ชัวร์"</p>
                <p className="text-sm text-slate-500 mt-2">การรู้เท่าทันสื่อ คือเกราะป้องกันที่ดีที่สุดในโลกไซเบอร์</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                        <Search size={24} />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Access (การเข้าถึง)</h4>
                    <p className="text-sm text-slate-400">ความสามารถในการค้นหาและเข้าถึงข้อมูลข่าวสารจากแหล่งที่หลากหลายและน่าเชื่อถือ</p>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                        <Activity size={24} />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Analyze (การวิเคราะห์)</h4>
                    <p className="text-sm text-slate-400">คิดวิเคราะห์ แยกแยะข้อเท็จจริง ตรวจสอบแหล่งที่มา และวัตถุประสงค์ของผู้ส่งสาร</p>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <Share2 size={24} />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Act (การปฏิบัติ)</h4>
                    <p className="text-sm text-slate-400">นำข้อมูลไปใช้ประโยชน์อย่างสร้างสรรค์ และส่งต่อข้อมูลที่ถูกต้องให้กับผู้อื่น</p>
                </div>
            </div>

            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 mt-8 flex flex-col md:flex-row items-center gap-6">
                 <div className="flex-shrink-0">
                    <Lightbulb size={48} className="text-yellow-400 animate-pulse" />
                 </div>
                 <div className="text-left">
                    <h4 className="font-bold text-white text-lg mb-1">คาถาป้องกันข่าวปลอม: "STOP - CHECK - ASK"</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                        <li>🛑 <strong>STOP:</strong> หยุดดูให้แน่ใจก่อน อย่าเพิ่งรีบเชื่อ</li>
                        <li>🔍 <strong>CHECK:</strong> ตรวจสอบแหล่งที่มา และเปรียบเทียบกับสำนักข่าวอื่น</li>
                        <li>❓ <strong>ASK:</strong> ถามผู้รู้ หรือใช้เครื่องมือตรวจสอบ (เช่นในเกมนี้!)</li>
                    </ul>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: "tools",
      icon: <Cpu size={80} className="text-blue-400" />,
      title: "MISSION TOOLS",
      subtitle: "อาวุธประจำกายของ Cyber Detective",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
             <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 flex flex-col items-center text-center hover:bg-blue-900/40 transition-colors">
               <ScanFace className="text-blue-400 mb-3" size={32} /> 
               <span className="font-bold text-white text-sm">Face Scan</span>
               <p className="text-xs text-slate-400 mt-2">ตรวจจับความผิดปกติของใบหน้า</p>
             </div>
             <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 flex flex-col items-center text-center hover:bg-purple-900/40 transition-colors">
               <Mic className="text-purple-400 mb-3" size={32} /> 
               <span className="font-bold text-white text-sm">Voice Analysis</span>
               <p className="text-xs text-slate-400 mt-2">วิเคราะห์คลื่นเสียงสังเคราะห์</p>
             </div>
             <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30 flex flex-col items-center text-center hover:bg-yellow-900/40 transition-colors">
               <Sun className="text-yellow-400 mb-3" size={32} /> 
               <span className="font-bold text-white text-sm">Lighting Check</span>
               <p className="text-xs text-slate-400 mt-2">ตรวจสอบทิศทางแสงและเงา</p>
             </div>
             <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/30 flex flex-col items-center text-center hover:bg-green-900/40 transition-colors">
               <Globe className="text-green-400 mb-3" size={32} /> 
               <span className="font-bold text-white text-sm">Reverse Search</span>
               <p className="text-xs text-slate-400 mt-2">ค้นหาต้นตอของภาพ/คลิป</p>
             </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] text-white overflow-y-auto overflow-x-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="fixed inset-0 z-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        {/* Navigation Dots */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
            {sections.map((section, index) => (
                <a 
                    key={index} 
                    href={`#${section.id}`} 
                    className="w-3 h-3 rounded-full bg-slate-600 hover:bg-cyan-400 transition-colors border border-black"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
                    }}
                ></a>
            ))}
        </div>

        <div className="relative z-10 pb-32">
            {sections.map((section, index) => (
                <div 
                    id={section.id}
                    key={index} 
                    ref={addToRefs} 
                    className="min-h-screen flex flex-col items-center justify-center p-8 scroll-trigger relative border-b border-white/5 last:border-0"
                >
                    <div className="max-w-6xl w-full text-center">
                        <div className="mb-8 inline-block p-6 rounded-full bg-slate-900/80 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm animate-float-slow">
                            {section.icon}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-4 cyber-font tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-slate-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            {section.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-cyan-400 mb-12 font-light tracking-wide">{section.subtitle}</p>
                        
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl mx-auto w-full max-w-5xl transform transition-all duration-700 hover:border-cyan-500/40">
                            {section.content}
                        </div>
                    </div>
                </div>
            ))}

            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">พร้อมหรือยัง? ที่จะพิสูจน์ความจริง</h2>
                    <p className="text-slate-400">โลกไซเบอร์กำลังรอคุณอยู่ Agent.</p>
                    <button 
                        onClick={onComplete}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative flex items-center gap-3">
                             เข้าสู่ระบบปฏิบัติการ <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

const Header = ({ user, currentPage, navigateTo, onSignOut, onOpenSurvey }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const NavItem = ({ page, label, icon }) => (
    <button
      onClick={() => {
        navigateTo(page);
        setIsMenuOpen(false);
      }}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 interactive whitespace-nowrap ${
        currentPage === page
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 flex-nowrap">
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => navigateTo('home')}>
            <h1 className="text-2xl font-black text-cyan-400 cyber-font tracking-widest flex items-center gap-2 group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              <Shield size={28} className="group-hover:animate-pulse" />
              <span className="hidden sm:inline-block">REAL <span className="text-white">OR</span> FAKE</span>
              <span className="inline-block sm:hidden">R/F</span>
            </h1>
          </div>
          <nav className="hidden lg:flex space-x-1 items-center">
            <NavItem page="home" label="หน้าแรก" icon={<Target size={16} />} />
            <NavItem page="manual" label="คู่มือ & ความรู้" icon={<BookOpen size={16} />} />
            <NavItem page="missions" label="คดีสืบสวน" icon={<Zap size={16} />} />
            <NavItem page="tools" label="เครื่องมือ" icon={<Cpu size={16} />} />
            <NavItem page="about" label="เกี่ยวกับเรา" icon={<Users size={16} />} />
            <NavItem page="contact" label="ติดต่อเรา" icon={<Mail size={16} />} />
            <button onClick={onOpenSurvey} className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 hover:border-yellow-400 bg-yellow-950/20 hover:bg-yellow-950/40 transition-all flex items-center gap-2 interactive whitespace-nowrap">
                <ClipboardList size={14} /> แบบสอบถามวิจัย
            </button>
          </nav>
          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 mr-2">
                    <button onClick={() => navigateTo('profile')} className="text-sm text-cyan-300 font-mono border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-950/30 hover:bg-cyan-900/50 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <UserCircle size={14}/>
                        {user.isAnonymous ? 'GUEST AGENT' : (user.displayName || 'AGENT')}
                    </button>
                    <button 
                        onClick={() => navigateTo('settings')}
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-full hover:bg-white/5"
                        title="ตั้งค่า"
                    >
                        <Settings size={18} />
                    </button>
                </div>
                
                {user.isAnonymous ? (
                    <button
                        onClick={() => navigateTo('auth')}
                        className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                        ลงทะเบียน / เข้าสู่ระบบ
                    </button>
                ) : (
                    <button
                    onClick={onSignOut}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-2 rounded-lg transition-all"
                    title="ออกจากระบบ"
                    >
                    <LogOut size={18} />
                    </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigateTo('auth')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all whitespace-nowrap"
              >
                เข้าสู่ระบบ
              </button>
            )}
            <button
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[500px] opacity-100 py-2' : 'max-h-0 opacity-0'
        } bg-slate-900/95 border-t border-cyan-500/20`}
      >
        <div className="px-4 pt-2 pb-3 space-y-2 flex flex-col">
          <NavItem page="home" label="หน้าแรก" icon={<Target size={18} />} />
          <NavItem page="profile" label="โปรไฟล์ของฉัน" icon={<UserCircle size={18} />} />
          <NavItem page="settings" label="ตั้งค่าบัญชี" icon={<Settings size={18} />} />
          <NavItem page="manual" label="คู่มือ & ความรู้" icon={<BookOpen size={18} />} />
          <NavItem page="missions" label="คดีสืบสวน" icon={<Zap size={18} />} />
          <NavItem page="tools" label="เครื่องมือ" icon={<Cpu size={18} />} />
          <NavItem page="about" label="เกี่ยวกับเรา" icon={<Users size={18} />} />
          <NavItem page="contact" label="ติดต่อเรา" icon={<Mail size={18} />} />
          <button onClick={() => { onOpenSurvey(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 flex items-center gap-2 interactive">
            <ClipboardList size={18} /> แบบสอบถามวิจัย
          </button>
        </div>
      </div>
    </header>
  );
};

const SettingsPage = ({ user, userData, onSave }) => {
    const [name, setName] = useState(user?.displayName || userData?.displayName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
            if (user?.uid) {
                const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
                await updateDoc(userRef, { displayName: name });
            }
            setMessage({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
            setTimeout(() => { if(onSave) onSave(); }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in z-20 relative">
            <SectionTitle icon={<Settings size={24} />} title="SETTINGS" subtitle="ตั้งค่าบัญชี" />
            
            <TiltCard>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">แก้ไขข้อมูลส่วนตัว</h3>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-cyan-400 mb-2">Codename (ชื่อผู้ใช้)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="ตั้งชื่อฉายาของคุณ..."
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">* ชื่อนี้จะปรากฏบนเกียรติบัตรและหน้าโปรไฟล์</p>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {message.type === 'success' ? <CheckCircle size={16}/> : <AlertTriangle size={16}/>}
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                                บันทึกการเปลี่ยนแปลง
                            </button>
                        </div>
                    </form>
                </div>
            </TiltCard>
        </div>
    );
};

const ProfilePage = ({ user, userData }) => {
    if (!userData) return <div className="text-center py-20">Loading Profile...</div>;

    const completedCount = userData.completedMissions?.length || 0;
    const earnedBadges = BADGES.filter(badge => badge.condition(userData));

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in z-20 relative">
            <SectionTitle icon={<UserCircle size={24} />} title="AGENT PROFILE" subtitle="ข้อมูลเจ้าหน้าที่" />

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: User Card */}
                <div className="md:col-span-1 space-y-6">
                    <TiltCard>
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
                            
                            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full border-4 border-cyan-500/30 p-1 mb-4 relative group">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                              {user?.photoURL ? (
                                <img 
                                src={user.photoURL} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                                />
                              ) : (
                                 <User size={64} className="text-slate-600 group-hover:text-cyan-400 transition-colors"/>
                                   )}
                              </div>
                                <div className="absolute bottom-0 right-0 bg-cyan-600 p-2 rounded-full border-2 border-slate-900">
                                    <Shield size={16} className="text-white"/>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{userData.displayName || 'Unknown Agent'}</h2>
                            <p className="text-cyan-400 font-mono text-sm mb-4">ID: {userData.userId?.slice(0,8).toUpperCase()}</p>

                            <div className="grid grid-cols-2 gap-2 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="text-slate-400">Total XP</div>
                                <div className="font-bold text-yellow-400">{userData.totalXp || 0}</div>
                                <div className="text-slate-400">Missions</div>
                                <div className="font-bold text-green-400">{completedCount} / {coreMissions.length}</div>
                            </div>
                        </div>
                    </TiltCard>

                     <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2"><Activity size={16} className="text-cyan-400"/> Recent Activity</h4>
                        {completedCount > 0 ? (
                            <ul className="space-y-2 text-sm text-slate-400">
                                {userData.completedMissions.slice(-3).reverse().map(mid => (
                                    <li key={mid} className="flex items-center gap-2">
                                        <CheckCircle size={12} className="text-green-500"/>
                                        <span>Completed Case #{mid}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-slate-500 italic">No missions completed yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Badges & Stats */}
                <div className="md:col-span-2 space-y-8">
                     {/* Badges Section */}
                     <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                            <Medal className="text-yellow-400"/> Achievements & Badges
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {BADGES.map(badge => {
                                const isUnlocked = earnedBadges.some(b => b.id === badge.id);
                                return (
                                    <div 
                                        key={badge.id} 
                                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center gap-3 relative overflow-hidden group ${
                                            isUnlocked 
                                            ? 'bg-slate-800/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                                            : 'bg-slate-900/40 border-slate-800 opacity-60 grayscale'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-full ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-600'}`}>
                                            {badge.icon}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1">{badge.description}</p>
                                        </div>
                                        {isUnlocked && <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>}
                                    </div>
                                );
                            })}
                        </div>
                     </div>

                     {/* Stats Progress */}
                     <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                            <Target className="text-red-400"/> Training Progress
                        </h3>
                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Mission Completion</span>
                                    <span className="text-cyan-400 font-bold">{Math.round((completedCount / coreMissions.length) * 100)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000" 
                                        style={{ width: `${(completedCount / coreMissions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-center mt-6">
                                <div>
                                    <div className="text-2xl font-bold text-white">{userData.currentLevel}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Current Level</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-400">{earnedBadges.length}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Badges Earned</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-cyan-400">{userData.totalXp}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Total XP</div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

const AuthPage = ({ navigateTo, setIsLoadingPage, handleProviderLogin }) => {
  const [username, setUsername] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', age: '', school: '', consent: false });

  const handleSignInWithName = async () => {
    if (!auth || !username.trim()) return;
    try {
      setIsLoadingPage(true);
      const userCredential = await signInAnonymously(auth);
      await updateProfile(userCredential.user, { displayName: username.trim() });
      await setDoc(doc(db, "artifacts", appId, "users", userCredential.user.uid), {
        displayName: username.trim(),
        currentLevel: 1,
        totalXp: 0,
        completedMissions: [],
        skipsRemaining: 3
      }, { merge: true });
      navigateTo('home');
    } catch (error) {
      console.error("Sign In with Name Failed:", error);
      setIsLoadingPage(false);
    }
  };

  const handleRegister = async (e) => {
      e.preventDefault();
      if (!formData.consent) return alert("กรุณายืนยันการยินยอมข้อมูล (Consent)");
      try {
          setIsLoadingPage(true);
          const result = await signInAnonymously(auth);
          const user = result.user;
          await updateProfile(user, { displayName: `${formData.firstName} ${formData.lastName}` });
          if (db) {
            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'userData'), {
                ...formData,
                joinedAt: new Date().toISOString(),
                role: "Junior Fact-Checker",
                xp: 0
            });
            // Also init main user doc
            await setDoc(doc(db, "artifacts", appId, "users", user.uid), {
                displayName: `${formData.firstName} ${formData.lastName}`,
                currentLevel: 1, totalXp: 0, completedMissions: [], skipsRemaining: 3
            }, { merge: true });
          }
          navigateTo('home');
      } catch (error) {
          console.error("Registration Error:", error);
          alert("เกิดข้อผิดพลาด: " + error.message);
          setIsLoadingPage(false);
      }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Left Side: Visual */}
        <div className="hidden md:flex flex-col items-center justify-center text-center space-y-6 p-8">
            <div className="relative">
                <div className="w-48 h-48 border-[1px] border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="w-40 h-40 border-[1px] border-dashed border-cyan-400/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-900/20 backdrop-blur-md rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <Shield size={64} className="text-cyan-400 animate-pulse" />
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-white cyber-font tracking-widest">REAL OR <span className="text-cyan-500">FAKE</span></h2>
                <p className="text-slate-400 text-sm font-mono mt-2">Media Literacy Initiative</p>
            </div>
            <div className="flex gap-2 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ONLINE</span>
                <span className="flex items-center gap-1"><Lock size={10}/> ENCRYPTED</span>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-slate-900/80 border border-cyan-500/30 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
            
            <div className="mb-8 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white cyber-font tracking-wider flex items-center gap-2 justify-center md:justify-start">
                    {isRegisterMode ? <User size={24} className="text-cyan-400"/> : <LogIn size={24} className="text-cyan-400"/>}
                    {isRegisterMode ? "NEW AGENT REGISTRATION" : "AGENT AUTHENTICATION"}
                </h3>
                <p className="text-slate-400 text-xs mt-2 font-light">กรุณาระบุข้อมูลเพื่อเข้าสู่ระบบปฏิบัติการ</p>
            </div>

            {!isRegisterMode ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                     <div>
                        <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">Codename (Optional)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="ระบุชื่อฉายา..."
                                className="login-input pl-10"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                     </div>
                     
                     <button
                        onClick={handleSignInWithName}
                        className="login-btn w-full flex items-center justify-center gap-2"
                     >
                        เข้าสู่ระบบ<ArrowRight size={18} />
                     </button>

                     <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or connect with</span></div>
                     </div>

                     <div className="flex justify-center gap-4">
                        <SocialRoundButton icon={<span className="font-bold">G</span>} label="Google" onClick={() => handleProviderLogin('google')} bgColor="#db4437" />
                        <SocialRoundButton icon={<Facebook size={20} />} label="Facebook" onClick={() => handleProviderLogin('facebook')} bgColor="#1877f2" />
                        <SocialRoundButton icon={<Twitter size={20} />} label="Twitter" onClick={() => handleProviderLogin('twitter')} bgColor="#1da1f2" />
                    </div>

                    <div className="text-center mt-6">
                        <button onClick={() => setIsRegisterMode(true)} className="text-cyan-400 text-sm hover:underline hover:text-cyan-300 transition-colors">
                            ลงทะเบียนผู้ใช้ใหม่ (New Registration)
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-cyan-500 font-bold ml-1 uppercase">ชื่อ (First Name)</label>
                            <input required className="login-input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] text-cyan-500 font-bold ml-1 uppercase">นามสกุล (Last Name)</label>
                            <input required className="login-input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-1">
                            <label className="text-[10px] text-cyan-500 font-bold ml-1 uppercase">อายุ</label>
                            <input required type="number" className="login-input text-center" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                        </div>
                        <div className="col-span-3">
                            <label className="text-[10px] text-cyan-500 font-bold ml-1 uppercase">สถานศึกษา</label>
                            <input required className="login-input" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5 flex items-start gap-3">
                        <input required type="checkbox" id="consent" className="mt-1 accent-cyan-500 w-4 h-4" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
                        <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                            ข้าพเจ้ายินยอมให้เก็บรวบรวมข้อมูลส่วนบุคคลเพื่อใช้ในการวิจัยและพัฒนาโครงการ (Data Privacy Consent)
                        </label>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="login-btn w-full mb-3">ยืนยันการลงทะเบียน</button>
                        <button type="button" onClick={() => setIsRegisterMode(false)} className="w-full text-slate-500 text-xs hover:text-white py-2 transition-colors">
                            ย้อนกลับ (Back to Login)
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

const ActiveGame = ({ currentMission, setGameState, aiStatus, aiMessage, handleNextMission, handleSkipMission, startMission, gameState, tools, selectedTools, useTool, isAnalyzing, analysisProgress, geminiExplanation, glassCard, skipsRemaining }) => {
  const isPass = aiStatus === 'pass';
  const isFail = aiStatus === 'fail';

  const MissionMedia = () => {
    const { videoUrl, imageUrl, title } = currentMission;
    
    if (videoUrl) {
        // Check for Google Drive or YouTube to use iframe
        const isEmbed = videoUrl.includes('drive.google.com') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
        
        if (isEmbed) {
            return (
                <iframe
                    src={videoUrl}
                    title={title}
                    className="w-full h-full rounded-lg shadow-inner bg-black border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }
        
        return (
            <video 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain rounded-lg shadow-inner bg-black"
                poster="https://placehold.co/1280x720/0f172a/67e8f9?text=Deepfake+Evidence"
            />
        );
    }
    if (imageUrl) {
        return (
            <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-contain rounded-lg shadow-inner bg-black"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1280x720/0f172a/67e8f9?text=Image+Evidence+Not+Found"; }}
            />
        );
    }
    return <MediaVisualizer type="File" isAnalyzing={false} />;
  }

  const ToolSelectionCard = ({ tool }) => {
    const isSelected = selectedTools.includes(tool.id);
    const isDisabled = isAnalyzing || isPass || isFail;

    return (
        <button 
            onClick={() => !isDisabled && useTool(tool.id)}
            disabled={isDisabled}
            className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 overflow-hidden ${
                isDisabled 
                    ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800'
                    : isSelected 
                        ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-800/40 border-white/10 hover:border-cyan-400/50 hover:bg-slate-800/80'
            }`}
        >
            <div className={`p-3 rounded-full mb-2 transition-all duration-300 ${isSelected ? 'bg-cyan-500 text-white scale-110' : 'bg-slate-900 text-slate-400 group-hover:text-cyan-400'}`}>
                {tool.icon}
            </div>
            <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`}>{tool.thName}</span>
            {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>}
        </button>
    );
  };
  
  const AnalysisResultCard = () => (
    <div className={`bg-slate-900/90 backdrop-blur-xl border-2 p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500 ${isPass ? 'border-emerald-500 shadow-emerald-500/20' : 'border-red-500 shadow-red-500/20'}`}>
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`p-4 rounded-full ${isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {isPass ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
            </div>
            <div>
                <h3 className="text-3xl font-black text-white cyber-font tracking-wide">
                    {isPass ? "MISSION ACCOMPLISHED" : "MISSION FAILED"}
                </h3>
                <p className={`text-sm font-bold tracking-widest ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPass ? "VERDICT: REAL / CONTEXTUAL FAKE" : "VERDICT: INCORRECT ANALYSIS"}
                </p>
            </div>
        </div>
        
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-6">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                <Bot size={16} /> REAL OR FAKE
Media Literacy Initiative
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">{aiMessage}</p>
            {geminiExplanation && (
                <div className="mt-4 pt-4 border-t border-white/10 text-slate-400 text-xs font-mono">
                    <p className="text-yellow-500/80 mb-1 flex items-center gap-1"><BrainCircuit size={12}/> DEEP ANALYSIS:</p>
                    {geminiExplanation}
                </div>
            )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isPass && (
                <button onClick={handleNextMission} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                    คดีต่อไป <ArrowRight size={20}/>
                </button>
            )}
            <button onClick={() => startMission(currentMission.id)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
                <RefreshCw size={20}/> เริ่มใหม่
            </button>
            <button onClick={() => setGameState('missions')} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-6 py-3 rounded-xl font-bold border border-slate-600 transition-colors">
                กลับหน้าเมนู
            </button>
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold tracking-widest mb-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                LIVE INVESTIGATION
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white cyber-font">{currentMission.title}</h2>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleSkipMission}
                disabled={skipsRemaining <= 0 || isAnalyzing || isPass}
                className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 transition-all ${skipsRemaining > 0 ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20' : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'}`}
                title="ข้ามภารกิจนี้ไปเลย (ไม่ได้รับ XP เต็มจำนวน)"
            >
                <FastForward size={16} /> ข้าม ({skipsRemaining})
            </button>
            <button onClick={() => setGameState('missions')} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30 text-sm font-bold transition-colors">
                ABORT MISSION
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Main Display */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative bg-black rounded-2xl border border-cyan-900 overflow-hidden shadow-2xl flex-grow min-h-[300px] group">
                {/* Cinematic Bars */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none"></div>
                
                {/* HUD Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 z-20"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 z-20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 z-20"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 z-20"></div>

                <HUDOverlay activeToolId={isAnalyzing ? selectedTools[selectedTools.length-1] : null} />
                
                <div className={`w-full h-full flex items-center justify-center transition-all duration-700 ${isAnalyzing ? 'scale-95 opacity-60 grayscale' : 'scale-100'}`}>
                    <MissionMedia />
                </div>

                {isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                        <div className="bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/50 text-center backdrop-blur-sm shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in fade-in zoom-in">
                            <RefreshCw size={48} className="text-cyan-400 mx-auto animate-spin mb-4" />
                            <p className="text-xl font-bold text-white mb-1 cyber-font tracking-widest">ANALYZING...</p>
                            <p className="text-cyan-400 font-mono text-lg">{analysisProgress}%</p>
                            <div className="w-48 h-1 bg-slate-800 mt-3 rounded-full overflow-hidden mx-auto">
                                <div className="h-full bg-cyan-500 transition-all duration-100" style={{width: `${analysisProgress}%`}}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-slate-300 text-sm leading-relaxed"><span className="text-cyan-400 font-bold mr-2">BRIEFING:</span>{currentMission.description}</p>
            </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-lg flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Cpu size={18} className="text-cyan-400"/> TOOLS</h3>
                    <span className="text-xs text-slate-500 font-mono">SELECT 1-3</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {tools.map(tool => <ToolSelectionCard key={tool.id} tool={tool} />)}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg mb-6">
                    <p className="text-xs text-yellow-200/80 flex gap-2 leading-tight">
                        <Info size={14} className="flex-shrink-0 mt-0.5" /> 
                        <span className="font-bold">HINT:</span> {currentMission.hint}
                    </p>
                </div>

                <button 
                    onClick={glassCard}
                    disabled={selectedTools.length === 0 || isAnalyzing || isPass || isFail}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                        selectedTools.length === 0 || isAnalyzing || isPass || isFail
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-500/20 hover:scale-[1.02]'
                    }`}
                >
                    {isAnalyzing ? 'PROCESSING...' : <><Terminal size={20}/> EXECUTE ANALYSIS</>}
                </button>
            </div>
        </div>
      </div>

      {/* Result Modal Overlay */}
      {(isPass || isFail) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="max-w-2xl w-full">
                <AnalysisResultCard />
            </div>
        </div>
      )}
    </div>
  );
};

const SignalDecryptionGame = ({ onClose, onWin }) => {
  const [targetPos, setTargetPos] = useState(50);
  const [cursorPos, setCursorPos] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCursorPos(prev => {
        let next = prev + (direction * 2);
        if (next >= 100 || next <= 0) {
          setDirection(d => d * -1);
          return next >= 100 ? 100 : 0;
        }
        return next;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [isRunning, direction]);

  const handleLock = () => {
    setIsRunning(false);
    if (Math.abs(cursorPos - targetPos) < 10) {
      setResult('success');
      setTimeout(onWin, 1500);
    } else {
      setResult('fail');
      setTimeout(() => { setIsRunning(true); setResult(null); }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl p-8 max-w-sm w-full relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-in zoom-in duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X size={20} /></button>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white cyber-font tracking-widest mb-1 flex items-center justify-center gap-2"><Zap className="text-yellow-400" /> SIGNAL INTERCEPT</h3>
          <p className="text-xs text-slate-400 font-mono">Lock the signal frequency to decode.</p>
        </div>
        <div className="h-12 bg-slate-800 rounded-full relative mb-8 overflow-hidden border border-white/10">
          <div className="absolute top-0 bottom-0 bg-yellow-500/30 border-x-2 border-yellow-400 w-[20%] transform -translate-x-1/2" style={{ left: `${targetPos}%` }}></div>
          <div className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#fff] transform -translate-x-1/2 transition-none" style={{ left: `${cursorPos}%` }}></div>
        </div>
        <div className="flex justify-center">
          {result === 'success' ? (
            <div className="text-green-400 font-bold flex items-center gap-2 animate-pulse"><CheckCircle /> SIGNAL ACQUIRED! +50 XP</div>
          ) : result === 'fail' ? (
            <div className="text-red-400 font-bold flex items-center gap-2 animate-shake"><AlertTriangle /> SIGNAL LOST... RETRYING</div>
          ) : (
            <button onClick={handleLock} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-900/50 active:scale-95 transition-transform w-full">LOCK SIGNAL</button>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title, subtitle }) => {
  const titleRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    
    if (titleRef.current) {
        observer.observe(titleRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={titleRef} className="text-center mb-12 relative scroll-trigger">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full -z-10"></div>
      <div className="inline-flex items-center justify-center gap-2 text-cyan-400 mb-3 bg-cyan-950/30 px-4 py-1 rounded-full border border-cyan-500/30 backdrop-blur-sm">
        {icon}
        <h3 className="text-sm font-bold tracking-widest uppercase cyber-font">{subtitle}</h3>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white cyber-font glitch-text tracking-tight">{title}</h2>
    </div>
  );
};

const ContactPage = ({ glassCard }) => (
  <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in z-20 relative">
    <div className="text-center mb-16">
        <SectionTitle icon={<Mail size={24} />} title="CONTACT US" subtitle="ติดต่อเรา" />
        <p className="text-slate-400 mt-4">ช่องทางการติดต่อและสอบถามข้อมูลเพิ่มเติมเกี่ยวกับโครงการวิจัย</p>
    </div>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <TiltCard><div className={`${glassCard} p-6 rounded-2xl flex items-start gap-5 hover:bg-slate-800/80 transition-colors group backdrop-blur-md`}><div className="bg-blue-600/20 p-4 rounded-xl text-blue-500 mt-1 border border-blue-500/20 group-hover:scale-110 transition-transform"><Facebook size={24} /></div><div><h3 className="font-bold text-white mb-1 cyber-font">เพจ ETC</h3><p className="text-sm text-slate-400 mb-2">ETC - Chulalongkorn University</p><a href="https://www.facebook.com/EtcCommunity/?locale=th_TH" target="_blank" rel="noreferrer" className="text-cyan-400 text-sm hover:underline flex items-center gap-1">ไปที่เพจ <ArrowRight size={12} /></a></div></div></TiltCard>
        <TiltCard><div className={`${glassCard} p-6 rounded-2xl flex items-start gap-5 hover:bg-slate-800/80 transition-colors group backdrop-blur-md`}><div className="bg-pink-500/20 p-4 rounded-xl text-pink-500 mt-1 border border-pink-500/20 group-hover:scale-110 transition-transform"><Globe size={24} /></div><div><h3 className="font-bold text-white mb-1 cyber-font">เว็บไซต์</h3><p className="text-sm text-slate-400 mb-2">ภาควิชาเทคโนโลยีและสื่อสารการศึกษา</p><a href="https://www.edu.chula.ac.th/edtech" target="_blank" rel="noreferrer" className="text-cyan-400 text-sm hover:underline break-all flex items-center gap-1">edu.chula.ac.th/edtech <ArrowRight size={12} /></a></div></div></TiltCard>
        <TiltCard><div className={`${glassCard} p-6 rounded-2xl flex items-start gap-5 hover:bg-slate-800/80 transition-colors group backdrop-blur-md`}><div className="bg-green-500/20 p-4 rounded-xl text-green-500 mt-1 border border-green-500/20 group-hover:scale-110 transition-transform"><Phone size={24} /></div><div><h3 className="font-bold text-white mb-1 cyber-font">เบอร์โทรศัพท์</h3><p className="text-slate-300 font-mono text-lg text-cyan-300">090 678 9068</p></div></div></TiltCard>
        <TiltCard><div className={`${glassCard} p-6 rounded-2xl flex items-start gap-5 hover:bg-slate-800/80 transition-colors group backdrop-blur-md`}><div className="bg-purple-500/20 p-4 rounded-xl text-purple-500 mt-1 border border-purple-500/20 group-hover:scale-110 transition-transform"><MapPin size={24} /></div><div><h3 className="font-bold text-white mb-1 cyber-font">ที่ตั้ง</h3><p className="text-slate-300 text-sm">อาคารคณะครุศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</p></div></div></TiltCard>
      </div>
      <TiltCard className="h-full">
        <div className={`${glassCard} p-8 rounded-3xl h-full sticky top-24 border-t-4 border-t-cyan-500 backdrop-blur-md`}>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 cyber-font"><Mail className="text-cyan-400" /> SECURE MESSAGE</h3>
          <form className="space-y-4">
            <div><label className="text-xs text-cyan-500 ml-1 mb-1 block font-mono">AGENT NAME</label><input type="text" placeholder="ระบุชื่อ..." className={`w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors`} /></div>
            <div><label className="text-xs text-cyan-500 ml-1 mb-1 block font-mono">CONTACT EMAIL</label><input type="email" placeholder="example@email.com" className={`w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors`} /></div>
            <div><label className="text-xs text-cyan-500 ml-1 mb-1 block font-mono">ENCRYPTED MESSAGE</label><textarea rows="4" placeholder="พิมพ์ข้อความของคุณที่นี่..." className={`w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors`}></textarea></div>
            <button className={`interactive w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-transform active:scale-95 flex items-center justify-center gap-2 group`}>SEND TRANSMISSION <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
          </form>
        </div>
      </TiltCard>
    </div>
  </div>
);

const ToolsPage = ({ navigateTo }) => {
  const [activeTool, setActiveTool] = useState(tools[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <SectionTitle icon={<Cpu size={24} />} title="CYBER TOOLKIT" subtitle="ฐานข้อมูลเครื่องมือ" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tool List (Left) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 border border-cyan-500/30 p-1 rounded-2xl backdrop-blur-md">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 mb-1 ${
                  activeTool.id === tool.id
                    ? 'bg-gradient-to-r from-cyan-900/80 to-slate-900 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTool.id === tool.id ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {tool.icon}
                </div>
                <div>
                  <p className={`font-bold ${activeTool.id === tool.id ? 'text-white' : ''}`}>{tool.thName}</p>
                  <p className="text-[10px] uppercase tracking-wider font-mono opacity-70">{tool.name}</p>
                </div>
                {activeTool.id === tool.id && <ChevronDown className="ml-auto text-cyan-500 -rotate-90" size={20} />}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Detail (Right) */}
        <div className="lg:col-span-8">
          <TiltCard className="h-full">
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl overflow-hidden backdrop-blur-xl h-full flex flex-col">
              {/* Visualizer Header */}
              <div className="relative h-64 bg-black/50 border-b border-cyan-500/20">
                <HUDOverlay activeToolId={activeTool.id} />
                <MediaVisualizer type={activeTool.name} isAnalyzing={true} />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-cyan-400 shadow-lg`}>
                        {activeTool.icon}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white cyber-font">{activeTool.thName}</h2>
                        <p className="text-xs text-cyan-300 font-mono tracking-widest">{activeTool.name}</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30 animate-pulse">
                    SYSTEM ONLINE
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 flex-grow">
                <div className="prose prose-invert max-w-none">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Info size={18} className="text-cyan-500" /> คำอธิบายหลักการทำงาน
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-lg border border-white/5">
                        {activeTool.desc}
                    </p>
                    
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Activity size={18} className="text-purple-500" /> Technical Details
                    </h3>
                    <ul className="space-y-3">
                        {activeTool.id === 'face_scan' && (
                            <>
                                <li className="flex gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2"></div><span><strong>Facial Landmark Tracking:</strong> ตรวจสอบความสม่ำเสมอของการเคลื่อนไหวกล้ามเนื้อ 68 จุดบนใบหน้า</span></li>
                                <li className="flex gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2"></div><span><strong>Blinking Rate Analysis:</strong> วิเคราะห์อัตราการกะพริบตาและ Micro-expression</span></li>
                            </>
                        )}
                        {/* Add other specific details as needed, defaulting to generic if not specified above */}
                        {!['face_scan'].includes(activeTool.id) && (
                            <li className="flex gap-3 text-sm text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2"></div><span>Algorithm ประมวลผลขั้นสูงเพื่อตรวจจับความผิดปกติในระดับพิกเซลและคลื่นสัญญาณดิจิทัล</span></li>
                        )}
                    </ul>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                    <CoolButton
                        icon={<Zap size={18} />}
                        label="ทดลองใช้ในภารกิจ"
                        onClick={() => navigateTo('missions')}
                        colorClass="bg-cyan-600 hover:bg-cyan-500"
                        className="px-6 py-3"
                        widthClass="hover:w-[200px]"
                    />
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};

const MissionsPage = ({ navigateTo, startMission, currentLevel, userData, showMinigame, setShowMinigame, gainXp }) => {
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpanded = (id) => setExpandedId(expandedId === id ? null : id);
  const completedMissions = userData?.completedMissions || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <div className="flex justify-between items-center mb-8">
          <div>
            <SectionTitle icon={<Map size={24} />} title="MISSION SELECT" subtitle="แผนที่ภารกิจ" />
          </div>
          <div className="hidden md:block">
             <button 
                onClick={() => setShowMinigame(true)}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 animate-pulse transition-colors"
             >
                <Zap size={14} /> BONUS SIGNAL
             </button>
          </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 relative">
        {/* Connector Line Background */}
        <div className="absolute left-[28px] top-10 bottom-10 w-1 bg-slate-800 -z-10 hidden md:block"></div>

        {coreMissions.map((mission, index) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isCurrent = mission.id === currentLevel && !isCompleted;
          const isLocked = mission.id > currentLevel && !isCompleted;
          const isExpanded = expandedId === mission.id;

          return (
            <div key={mission.id} className={`relative transition-all duration-500 ${isExpanded ? 'mb-8 scale-[1.02]' : 'mb-4'}`}>
                <div 
                    className={`
                        relative bg-slate-900/90 border backdrop-blur-md rounded-2xl p-1 overflow-hidden
                        ${isCurrent ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : isCompleted ? 'border-emerald-500/30' : 'border-slate-700 opacity-70'}
                    `}
                >
                    {/* Header */}
                    <div 
                        className="flex items-center gap-4 p-4 cursor-pointer"
                        onClick={() => toggleExpanded(mission.id)}
                    >
                        {/* Status Icon */}
                        <div className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-bold border-2
                            ${isCompleted ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 
                              isCurrent ? 'bg-cyan-900/20 border-cyan-500 text-cyan-400 animate-pulse' : 
                              'bg-slate-800 border-slate-600 text-slate-500'}
                        `}>
                            {isCompleted ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : mission.id}
                        </div>

                        <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isCurrent ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    CASE #{mission.id.toString().padStart(3, '0')}
                                </span>
                                {isCurrent && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold animate-pulse">NEW</span>}
                            </div>
                            <h3 className={`text-lg md:text-xl font-bold truncate ${isCompleted ? 'text-slate-400' : 'text-white'}`}>{mission.title}</h3>
                            <p className="text-xs text-slate-500 truncate">{mission.subTitle}</p>
                        </div>

                        <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1"><Zap size={14} className="text-yellow-500"/> {mission.xpReward} XP</div>
                            {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <div className={`bg-black/20 border-t border-white/5 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0 border-none'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <p className="text-xs text-cyan-400 font-bold uppercase mb-1">Mission Briefing</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{mission.description}</p>
                                </div>
                                <div className="bg-yellow-900/10 border border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start">
                                    <Info size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-yellow-200/80 italic">{mission.hint}</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between gap-4">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); !isLocked && startMission(mission.id); }}
                                    disabled={isLocked}
                                    className={`
                                        w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                                        ${isLocked ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]'}
                                    `}
                                >
                                    {isCompleted ? <><RefreshCw size={16}/> เล่นซ้ำ</> : isLocked ? <><Lock size={16}/> ยังไม่ปลดล็อค</> : <><Play size={16}/> เริ่มภารกิจ</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
      {showMinigame && <SignalDecryptionGame onClose={() => setShowMinigame(false)} onWin={() => { gainXp(50); setShowMinigame(false); }} />}
    </div>
  );
};

const AboutPage = ({ teamMembers, faqData }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-child').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <SectionTitle icon={<Users size={24} />} title="TEAM & FAQ" subtitle="เกี่ยวกับโครงการ" />

      {/* Team Section */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold text-white mb-8 text-center cyber-font scroll-child scroll-trigger">ทีมผู้พัฒนา</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={member.id} className={`scroll-child scroll-trigger delay-${idx * 100}`}>
                <TeamCard {...member} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-slate-500 text-sm italic scroll-child scroll-trigger">
          โปรแกรมการศึกษานี้เป็นส่วนหนึ่งของวิชา 2766224 PROGRAMMING FOR EDUCATION คำอธิบายรายวิชา
แนวคิดและวิธีการเขียนโปรแกรม การเขียนผังงาน โครงสร้างและรูปแบบภาษาด้วยโปรแกรมขั้นสูง การออกแบบส่วนปฏิสัมพันธ์กับผู้ใช้ การประยุกต์กราฟิกและสื่อประสม และการบูรณาการองค์ความรู้ที่เป็นระบบ
        </div>
      </div>

      {/* Advisor Section - Added as requested */}
      <div className="mb-16 scroll-child scroll-trigger">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-yellow-500/30 p-1 rounded-2xl shadow-xl">
            <div className="bg-slate-900/90 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-yellow-500/30 p-1 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                            <GraduationCap size={48} className="text-yellow-500" />
                        </div>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 mb-3">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Project Advisor</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">รองศาสตราจารย์ ดร.ประกอบ กรณีกิจ</h3>
                    <p className="text-slate-400 text-sm md:text-base">ภาควิชาเทคโนโลยีและสื่อสารการศึกษา คณะครุศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</p>
                </div>
            </div>
        </div>
      </div>

      {/* Research Survey Section - Added as requested */}
      <div className="mb-16 scroll-child scroll-trigger">
        <div className="bg-slate-900/60 border border-cyan-500/30 p-8 rounded-2xl text-center backdrop-blur-md">
            <div className="inline-block p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-4">
                <ClipboardList size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">แบบสอบถามงานวิจัย</h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                ขอความร่วมมือผู้ใช้งานทุกท่าน ตอบแบบสอบถามเพื่อเป็นข้อมูลในการพัฒนาระบบและงานวิจัยต่อไป ข้อมูลของท่านจะเป็นประโยชน์อย่างยิ่ง
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="https://near.tl/sm/FWOwqIsda" target="_blank" rel="noreferrer" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105">
                    ทำแบบสอบถาม (Link 1) <ExternalLink size={16} />
                </a>
                <a href="https://www.teddy17.fun/deepfake" target="_blank" rel="noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105">
                    ทำแบบสอบถาม (Link 2) <ExternalLink size={16} />
                </a>
            </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto scroll-child scroll-trigger">
        <h3 className="text-3xl font-bold text-white mb-8 text-center cyber-font flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-cyan-400"/> คำถามที่พบบ่อย (FAQ)
        </h3>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-slate-900/80 border border-cyan-500/30 rounded-xl overflow-hidden interactive">
              <button
                className="w-full text-left p-4 flex justify-between items-center text-white hover:bg-slate-800/70 transition-colors"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <span className="font-semibold text-lg flex items-center gap-2"><Book size={20} className="text-cyan-400"/>{item.q}</span>
                {activeFaq === index ? <ChevronUp size={24} className="text-cyan-300"/> : <ChevronDown size={24} className="text-slate-400"/>}
              </button>
              <div className={`p-4 bg-slate-800/50 border-t border-cyan-500/10 transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-slate-300 leading-relaxed pl-6">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CertificatePage = ({ setGameState, certificateRef, isEditingName, certName, setCertName, setIsEditingName, handleDownloadPDF, handleDownloadPNG }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex flex-col items-center min-h-[80vh] justify-center">
            <SectionTitle icon={<Award size={32} />} title="CERTIFICATION" subtitle="ยืนยันความสำเร็จ" />

            <div className="bg-slate-900/50 border border-cyan-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl max-w-5xl w-full">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    
                    {/* Preview Area */}
                    <div className="flex-grow w-full lg:w-2/3">
                        <div className="relative w-full aspect-[1.414/1] bg-white rounded overflow-hidden">
                            
                           {/* --- ส่วนเกียรติบัตร (Safe Mode สำหรับ html-to-image) --- */}
                            <div ref={certificateRef} id="certificate-target" className="w-full h-full relative bg-white p-10 flex flex-col items-center text-center" style={{ border: '20px double #cbd5e1' }}>
                                
                                {/* Background: ใช้สีขาวล้วน ตัดปัญหา Gradient บน Safari */}
                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: '#ffffff' }}></div>
                                <div className="absolute inset-0 border-[1px] border-slate-300 m-4 pointer-events-none"></div>

                                {/* มุมตกแต่ง */}
                                <div className="absolute top-6 left-6 w-24 h-24" style={{ borderTop: '4px solid #0891b2', borderLeft: '4px solid #0891b2' }}></div>
                                <div className="absolute bottom-6 right-6 w-24 h-24" style={{ borderBottom: '4px solid #0891b2', borderRight: '4px solid #0891b2' }}></div>

                                {/* Header */}
                                <div className="relative z-10 w-full mt-4">
                                    <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
                                        <Shield size={24} color="#155e75" />
                                        <span className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: '#155e75' }}>Real Or Fake Initiative</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-serif font-black uppercase tracking-widest mb-2" style={{ color: '#0f172a' }}>Certificate</h1>
                                    <p className="text-xl font-serif italic tracking-wide" style={{ color: '#0e7490' }}>Of Cyber Intelligence Mastery</p>
                                </div>

                                {/* ชื่อผู้รับ */}
                                <div className="flex-grow flex flex-col justify-center w-full my-4">
                                    <p className="italic font-serif text-lg mb-6" style={{ color: '#64748b' }}>This is to certify that</p>
                                    <div className="relative">
                                        {isEditingName ? (
                                            <input type="text" value={certName} onChange={(e) => setCertName(e.target.value)} className="text-4xl md:text-5xl font-bold text-center bg-transparent w-full font-serif focus:outline-none" style={{ color: '#0f172a', borderBottom: '2px solid #06b6d4' }} autoFocus />
                                        ) : (
                                            <h2 className="text-4xl md:text-5xl font-bold font-serif inline-block px-12 pb-4 min-w-[300px]" style={{ color: '#0f172a', borderBottom: '2px solid #cbd5e1' }}>{certName}</h2>
                                        )}
                                    </div>
                                    <p className="font-serif text-lg leading-relaxed max-w-2xl mx-auto mt-8" style={{ color: '#475569' }}>
                                        Has successfully completed the advanced training program on <br/>
                                        <span className="font-bold" style={{ color: '#0f172a' }}>Digital Forensics & Deepfake Detection</span>.
                                    </p>
                                    <div className="mt-6">
                                        <div className="inline-flex items-center gap-3 px-8 py-2 rounded-full" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                                            <Award size={20} color="#facc15" />
                                            <span className="font-bold tracking-widest text-sm uppercase" style={{ color: '#facc15' }}>Grandmaster Rank</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="relative z-10 w-full grid grid-cols-2 gap-12 mt-auto items-end px-8 pb-4">
                                    <div className="text-center">
                                        <div className="h-16 flex items-end justify-center pb-2">
                                            <span className="font-serif italic text-2xl font-bold" style={{ color: '#155e75' }}>EdTech Team 67</span> 
                                        </div>
                                        <div className="w-full mx-auto mb-2" style={{ borderTop: '1px solid #94a3b8' }}></div>
                                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#0f172a' }}>Project Organizer</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="h-16 flex items-end justify-center pb-2">
                                            <p className="text-lg font-mono" style={{ color: '#334155' }}>{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                        </div>
                                        <div className="w-full mx-auto mb-2" style={{ borderTop: '1px solid #94a3b8' }}></div>
                                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#0f172a' }}>Date Issued</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* ปุ่มแก้ไขชื่อ */}
                            <button 
                                onClick={() => setIsEditingName(!isEditingName)}
                                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-50 text-cyan-600"
                            >
                                {isEditingName ? <Save size={20}/> : <Edit2 size={20}/>}
                            </button>
                        </div>
                    </div>

                    {/* เมนูด้านขวา */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">ดาวน์โหลดเกียรติบัตร</h3>
                            <p className="text-sm text-slate-400">บันทึกความสำเร็จของคุณเพื่อนำไปใช้ใน Portfolio หรือแชร์บนโซเชียลมีเดีย</p>
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={handleDownloadPNG} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20">
                                <ImageIcon size={24}/> บันทึกเป็นรูปภาพ (PNG)
                            </button>
                            <button onClick={handleDownloadPDF} className="w-full bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
                                <FileText size={24}/> บันทึกเป็นเอกสาร (PDF)
                            </button>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <button onClick={() => setGameState('missions')} className="w-full text-slate-400 hover:text-white py-2 flex items-center justify-center gap-2 transition-colors">
                                <ArrowRight className="rotate-180" size={16}/> กลับไปหน้าเลือกภารกิจ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ navigateTo }) => (
  <footer className="bg-slate-950/80 border-t border-cyan-500/20 mt-12 py-12 relative z-40 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-xl font-bold text-white mb-4 cyber-font flex items-center gap-2">
            <Shield className="text-cyan-500"/> REAL OR FAKE
          </h4>
          <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
            การพัฒนาสื่อการศึกษาที่ส่งเสริมการตระหนักรู้ต่อสื่อที่ถูกสร้างด้วยปัญญาประดิษฐ์ (Deepfake) ในยุค Generative AI และการเสริมสร้างทักษะการแยกแยะสื่อจริงและสื่อจาก Generative AI รวมถึงความเข้าใจภัยคุกคามทางไซเบอร์ที่ส่งผลต่อชุมชนและสังคม ผ่านสื่อการเรียนรู้แบบ interactive
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-cyan-400 mb-4 cyber-font">เมนูหลัก</h4>
          <ul className="space-y-2 text-sm">
            <li><button className="hover:text-cyan-300 transition-colors flex items-center gap-2" onClick={() => navigateTo('home')}><ArrowRight size={12}/> หน้าหลัก</button></li>
            <li><button className="hover:text-cyan-300 transition-colors flex items-center gap-2" onClick={() => navigateTo('manual')}><ArrowRight size={12}/> คู่มือ & ความรู้</button></li>
            <li><button className="hover:text-cyan-300 transition-colors flex items-center gap-2" onClick={() => navigateTo('missions')}><ArrowRight size={12}/> เริ่มคดีสืบสวน</button></li>
            <li><button className="hover:text-cyan-300 transition-colors flex items-center gap-2" onClick={() => navigateTo('tools')}><ArrowRight size={12}/> เครื่องมือ</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-cyan-400 mb-4 cyber-font">ติดต่อเรา</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3"><Mail size={18} className="text-cyan-500 mt-0.5 flex-shrink-0" /><span className="break-all">edu.chula.ac.th/edtech</span></li>
            <li className="flex items-start gap-3"><Facebook size={18} className="text-cyan-500 mt-0.5 flex-shrink-0" /><a href="https://www.facebook.com/EtcCommunity/?locale=th_TH" target="_blank" rel="noreferrer" className="hover:text-white">ETC - Chulalongkorn University</a></li>
            <li className="flex items-start gap-3"><Globe size={18} className="text-cyan-500 mt-0.5 flex-shrink-0" /><a href="https://www.edu.chula.ac.th/edtech" target="_blank" rel="noreferrer" className="hover:text-white">www.edu.chula.ac.th/edtech</a></li>
            <li className="flex items-start gap-3"><Phone size={18} className="text-cyan-500 mt-0.5 flex-shrink-0" /><span>090 678 9068</span></li>
            <li className="flex items-start gap-3"><MapPin size={18} className="text-cyan-500 mt-0.5 flex-shrink-0" /><span>ภาควิชาเทคโนโลยีและสื่อสารการศึกษา คณะครุศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</span></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Real Or Fake Project. All rights reserved.
      </div>
    </div>
  </footer>
);

const Home = ({ navigateTo, userData }) => {
  const currentLevel = userData?.currentLevel || 1;
  const totalXp = userData?.totalXp || 0;
  const progress = Math.min((currentLevel - 1) / (coreMissions.length - 1) * 100, 100);
  const nextMission = coreMissions.find(m => m.id === currentLevel);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Animate children with staggered delay
          const children = entry.target.querySelectorAll('.scroll-child');
          children.forEach((child, index) => {
             setTimeout(() => child.classList.add('is-visible'), index * 100);
          });
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.scroll-section');
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const getRank = (level) => {
    if (level > 14) return { name: "Grandmaster Cyber Detective", color: "text-red-500", icon: <Award size={20} /> };
    if (level > 10) return { name: "Senior Investigator", color: "text-yellow-500", icon: <Star size={20} /> };
    if (level > 5) return { name: "Field Agent", color: "text-lime-500", icon: <UserCheck size={20} /> };
    return { name: "Trainee Analyst", color: "text-slate-400", icon: <Footprints size={20} /> };
  };

  const rank = getRank(currentLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 relative z-10">
      
      {/* Hero Section */}
      <div className="scroll-section scroll-trigger text-center pt-20 pb-24 relative overflow-hidden rounded-3xl bg-slate-900/40 border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] group">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-cyan-500/30 rounded-full px-4 py-1 mb-6 backdrop-blur-md scroll-child scroll-trigger">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-cyan-300 tracking-wider">CYBER SECURITY EDUCATION PLATFORM</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-none tracking-tighter scroll-child scroll-trigger delay-100">
            <span className="block glitch-text" data-text="REAL">REAL</span>
            <span className="block text-4xl md:text-5xl text-cyan-500 my-2 font-mono tracking-[0.5em]">OR</span>
            <span className="block glitch-text text-red-500" data-text="FAKE">FAKE</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light scroll-child scroll-trigger delay-200">
            ฝึกทักษะ <span className="text-cyan-400 font-bold">"นักสืบไซเบอร์"</span> เพื่อปกป้องตัวคุณจากภัยคุกคาม Deepfake ด้วยเทคโนโลยีจำลองสถานการณ์เสมือนจริง
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 scroll-child scroll-trigger delay-300">
            <button 
                onClick={() => navigateTo('missions')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-3 group"
            >
                <Play fill="currentColor" className="group-hover:translate-x-1 transition-transform" /> 
                เริ่มภารกิจแรก
            </button>
            <button 
                onClick={() => navigateTo('manual')}
                className="bg-slate-800/50 hover:bg-slate-700/50 text-cyan-300 border border-cyan-500/30 px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md transition-all hover:border-cyan-400 flex items-center gap-2"
            >
                <BookOpen size={20} /> คู่มือความรู้
            </button>
          </div>
        </div>
        
        {/* Decorative Blobs */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
      </div>
      
      {/* Player Stats */}
      {userData?.userId && (
        <div className="scroll-section scroll-trigger bg-slate-900/60 border border-cyan-500/30 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3 cyber-font">
                <div className="bg-cyan-500/20 p-2 rounded-lg"><User size={24} className="text-cyan-400"/></div>
                ข้อมูลนักสืบ
             </h3>
             <div className="flex items-center gap-2">
                 <button onClick={() => navigateTo('profile')} className="text-xs font-bold text-cyan-400 hover:text-white border border-cyan-500/30 px-3 py-1.5 rounded-lg bg-cyan-950/30 transition-colors">
                     ดูโปรไฟล์เต็ม
                 </button>
                 <span className="font-mono text-xs text-slate-500 bg-black/30 px-3 py-1.5 rounded border border-white/10">ID: {userData.userId.slice(0,8)}...</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="p-5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-colors group scroll-child scroll-trigger">
              <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Current Rank</p>
                    <p className={`text-xl font-bold ${rank.color} cyber-font group-hover:scale-105 transition-transform origin-left`}>{rank.name}</p>
                  </div>
                  <div className="p-2 bg-black/30 rounded-lg text-white">{rank.icon}</div>
              </div>
            </TiltCard>
            
            <TiltCard className="p-5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-colors group scroll-child scroll-trigger delay-100">
              <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Mission Progress</p>
                    <p className="text-2xl font-bold text-white cyber-font">{currentLevel} <span className="text-sm text-slate-500">/ {coreMissions.length}</span></p>
                  </div>
                  <div className="p-2 bg-black/30 rounded-lg text-cyan-400"><Target size={20}/></div>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progress}%` }}></div>
              </div>
            </TiltCard>
            
            <TiltCard className="p-5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-yellow-500/30 transition-colors group scroll-child scroll-trigger delay-200">
              <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total XP</p>
                    <p className="text-3xl font-bold text-yellow-400 cyber-font group-hover:scale-105 transition-transform origin-left">{totalXp}</p>
                  </div>
                  <div className="p-2 bg-black/30 rounded-lg text-yellow-400"><Zap size={20}/></div>
              </div>
            </TiltCard>
          </div>
        </div>
      )}

      {/* Next Mission CTA */}
      {nextMission && currentLevel <= coreMissions.length && (
        <div className="scroll-section scroll-trigger bg-gradient-to-r from-slate-900 to-slate-800 border border-orange-500/30 p-1 rounded-2xl shadow-xl">
            <div className="bg-slate-900/90 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <div className="flex items-center gap-6 z-10">
                    <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20 animate-pulse">
                        <Target size={32} className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-orange-400 cyber-font tracking-widest uppercase mb-1">ภารกิจถัดไปรอคุณอยู่</p>
                        <h3 className="text-2xl font-bold text-white mb-1">{nextMission.title}</h3>
                        <p className="text-slate-400 text-sm">{nextMission.subTitle}</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigateTo('missions')}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:scale-105 z-10"
                >
                    เริ่มคดีทันที <ArrowRight size={20} />
                </button>
                
                {/* Background Effect */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-900/10 to-transparent pointer-events-none"></div>
            </div>
        </div>
      )}

      {/* Feature Tools Section */}
      <div className="scroll-section">
        <SectionTitle icon={<Cpu size={24} />} title="CYBER TOOLKIT" subtitle="เครื่องมือสืบสวนระดับสูง" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.slice(0, 3).map((tool, idx) => (
            <div key={tool.id} className={`scroll-child scroll-trigger delay-${idx * 100}`}>
                <TiltCard>
                    <div className="bg-slate-900/60 border border-white/10 p-8 rounded-2xl flex flex-col items-start h-full backdrop-blur-md group hover:border-cyan-400 hover:bg-slate-800/60 transition-all duration-300">
                    <div className={`p-4 rounded-xl ${tool.color.replace('bg-', 'bg-opacity-10 bg-')} border border-white/5 text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 cyber-font tracking-wide group-hover:text-cyan-300 transition-colors">{tool.thName}</h3>
                    <p className="text-slate-400 text-sm flex-grow leading-relaxed">{tool.desc}</p>
                    <div className="mt-6 pt-4 border-t border-white/5 w-full flex justify-between items-center">
                        <span className="text-xs font-mono text-slate-500">{tool.name}</span>
                        <button onClick={() => navigateTo('tools')} className="text-cyan-400 hover:text-white transition-colors"><ArrowRight size={20}/></button>
                    </div>
                    </div>
                </TiltCard>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('manual'); // Default start with Manual Page
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false); 

  const [gameState, setGameState] = useState('missions');
  const [currentMission, setCurrentMission] = useState(null);
  const [selectedTools, setSelectedTools] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [geminiExplanation, setGeminiExplanation] = useState("");

  const [certName, setCertName] = useState("Cyber Detective");
  const [isEditingName, setIsEditingName] = useState(false);
  const certificateRef = useRef(null);

  // Style definition for Glass Card effects
  const glassCardStyle = "bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-500/40 transition-all duration-300";

  useEffect(() => {
    if (!auth || !db) {
      console.warn("Firebase or Firestore not initialized.");
      setIsAuthReady(true);
      setIsLoading(false);
      return;
    }
    const initialAuth = async () => {
        try {
            const initialToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
            if (initialToken) { await signInWithCustomToken(auth, initialToken); } 
            else { await signInAnonymously(auth); }
        } catch (error) { await signInAnonymously(auth); }
    };
    initialAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      setIsLoading(false);
      if (currentUser) setCertName(currentUser.displayName || "Cyber Detective");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    ]).then(() => console.log("PDF Libraries loaded")).catch(err => console.error("Failed to load PDF libraries", err));
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user || !db) return;
    const userDocRef = doc(db, "artifacts", appId, "users", user.uid);
    const initializeUser = async () => {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          displayName: user.displayName || 'Anonymous User',
          currentLevel: 1, totalXp: 0, completedMissions: [], lastLogin: new Date().toISOString(), userId: user.uid,
          skipsRemaining: 3
        });
      } else {
        // Migration for existing users who might not have skipsRemaining
        const data = docSnap.data();
        if (data.skipsRemaining === undefined) {
             await updateDoc(userDocRef, { skipsRemaining: 3 });
        }
      }
    };
    initializeUser();
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) setUserData({ id: doc.id, ...doc.data(), userId: doc.id });
      else setUserData(null);
    });
    return () => unsubscribe();
  }, [isAuthReady, user, db]);

  const navigateTo = (page) => {
        setIsLoadingPage(true);
        setTimeout(() => {
            setCurrentPage(page);
            setIsLoadingPage(false);
            window.scrollTo(0, 0);
        }, 300);
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try { 
        setIsLoadingPage(true); 
        await signOut(auth); 
        navigateTo('auth'); 
    } finally { 
        setIsLoadingPage(false); 
    }
  };

  const handleProviderLogin = async (providerType) => {
    if (!auth) return alert("Firebase config not found");
    setIsLoadingPage(true);
    try {
      if (providerType === 'guest') await signInAnonymously(auth);
      else {
        let provider;
        if (providerType === 'google') provider = new GoogleAuthProvider();
        if (providerType === 'facebook') provider = new FacebookAuthProvider();
        if (providerType === 'twitter') provider = new TwitterAuthProvider();
        await signInWithPopup(auth, provider);
      }
      navigateTo('home');
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-supported-in-this-environment') await signInAnonymously(auth);
      navigateTo('home');
    } finally { setIsLoadingPage(false); }
  };

  const startMission = (missionId) => {
    const mission = coreMissions.find(m => m.id === missionId);
    if (!mission) return;
    setCurrentMission(mission);
    setSelectedTools([]);
    setAiStatus(null);
    setAiMessage("");
    setGeminiExplanation("");
    setAnalysisProgress(0);
    setGameState('active');
  };

  const useTool = (toolId) => {
    setSelectedTools(prev => prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId].slice(0, 3));
  };

  const executeAnalysis = async () => {
    if (selectedTools.length === 0 || isAnalyzing || !currentMission) return;
    setIsAnalyzing(true); setAiStatus(null); setAiMessage(""); setGeminiExplanation("");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      setAnalysisProgress(Math.min(progress, 99));
      if (progress >= 100) clearInterval(interval);
    }, 200);

    const passed = currentMission.required.some(t => selectedTools.includes(t)) && !currentMission.forbidden.some(t => selectedTools.includes(t));
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval); setAnalysisProgress(100);

    let status = passed ? 'pass' : 'fail';
    let message = passed ? "การวิเคราะห์ถูกต้อง! พบหลักฐานสำคัญเพียงพอที่จะระบุประเภทสื่อ" : "การวิเคราะห์คลาดเคลื่อน! เครื่องมือที่เลือกยังไม่ตรงจุด หรือมีเครื่องมือที่ไม่เหมาะสม";
    
    try {
        const result = await fetchAIExplanation(currentMission.title, currentMission.description, currentMission.required.map(id => tools.find(t => t.id === id).thName), selectedTools.map(id => tools.find(t => t.id === id).thName), passed);
        setGeminiExplanation(result.text);
    } catch (e) { setGeminiExplanation("AI ไม่สามารถประมวลผลคำอธิบายได้ในขณะนี้"); }

    setAiStatus(status); setAiMessage(message); setIsAnalyzing(false);
  };

  const handleNextMission = async () => {
    if (!user || !userData || !currentMission) return;
    const newLevel = currentMission.id + 1;
    const newTotalXp = userData.totalXp + currentMission.xpReward;
    const newCompletedMissions = [...userData.completedMissions, currentMission.id];
    try {
      await setDoc(doc(db, "artifacts", appId, "users", user.uid), {
        currentLevel: newLevel > coreMissions.length ? coreMissions.length + 1 : newLevel,
        totalXp: newTotalXp, completedMissions: newCompletedMissions,
      }, { merge: true });
      if (newLevel > coreMissions.length) setGameState('certificate');
      else { startMission(newLevel); }
    } catch (error) { console.error(error); }
  };
  
  const handleSkipMission = async () => {
      if (!user || !userData || !currentMission || (userData.skipsRemaining || 0) <= 0) return;
      const newLevel = currentMission.id + 1;
      // Skip logic: increment level, add to completed but NO XP, decrease skips
      const newCompletedMissions = [...userData.completedMissions, currentMission.id];
      const newSkips = (userData.skipsRemaining || 0) - 1;
      
      try {
        await updateDoc(doc(db, "artifacts", appId, "users", user.uid), {
            currentLevel: newLevel > coreMissions.length ? coreMissions.length + 1 : newLevel,
            completedMissions: newCompletedMissions,
            skipsRemaining: newSkips
        });
        if (newLevel > coreMissions.length) setGameState('certificate');
        else { startMission(newLevel); }
      } catch (error) { console.error("Skip error:", error); }
  }

  const gainXp = async (amount) => {
      if(!userData) return;
      const newTotalXp = userData.totalXp + amount;
      try {
          await setDoc(doc(db, "artifacts", appId, "users", user.uid), {
              totalXp: newTotalXp
          }, { merge: true });
      } catch(err) { console.error(err); }
  };
  
  // ... (fetchAIExplanation, handleDownloadPDF, handleDownloadPNG, effects remain same)
  const fetchAIExplanation = async (caseTitle, caseDescription, requiredTools, selectedTools, isSuccess) => {
      const systemPrompt = "คุณคือผู้เชี่ยวชาญด้านนิติวิทยาศาสตร์ดิจิทัล (Digital Forensic Analyst) ในเกม 'REAL OR FAKE' อธิบายผลลัพธ์สั้นๆ ให้ผู้เล่นเข้าใจ";
      const userQuery = `คดี: ${caseTitle} (${caseDescription}). สถานะ: ${isSuccess ? "สำเร็จ" : "ล้มเหลว"}. เครื่องมือที่ต้องใช้: ${requiredTools}. เครื่องมือที่เลือก: ${selectedTools}. อธิบายเหตุผลสั้นๆ`;
      
      if (!apiKey) return { text: "จำลองคำตอบ AI: การเลือกเครื่องมือของคุณมีความสมเหตุสมผลในการตรวจสอบความผิดปกติของไฟล์" };
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
        });
        const json = await response.json();
        return { text: json?.candidates?.[0]?.content?.parts?.[0]?.text || "No response" };
      } catch (e) { return { text: "Error connecting to AI" }; }
  };

// --- ฟังก์ชันดาวน์โหลดรูปภาพ (ใช้ html-to-image) ---
  const handleDownloadPNG = async () => {
    const input = certificateRef.current;
    if (!input) {
        alert("ไม่พบส่วนประกอบเกียรติบัตร");
        return;
    }

    try {
        // loading state (ถ้าต้องการ)
        document.body.style.cursor = 'wait';

        const dataUrl = await toPng(input, { 
            quality: 1.0, 
            cacheBust: true, 
            pixelRatio: 2, // เพิ่มความชัด 2 เท่า
            backgroundColor: '#ffffff' // บังคับพื้นหลังขาวกันภาพดำ
        });

        const link = document.createElement('a');
        link.download = `Certificate_${certName}.png`;
        link.href = dataUrl;
        link.click();
        
        document.body.style.cursor = 'default';

    } catch (err) {
        document.body.style.cursor = 'default';
        console.error("PNG Download Failed:", err);
        alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ: " + err.message);
    }
  };

  // --- ฟังก์ชันดาวน์โหลด PDF (ใช้ html-to-image + jspdf) ---
  const handleDownloadPDF = async () => {
    const input = certificateRef.current;
    if (!input) return;

    try {
        document.body.style.cursor = 'wait';

        // 1. แปลง HTML เป็นรูปภาพก่อน
        const imgData = await toPng(input, {
            quality: 1.0,
            cacheBust: true,
            pixelRatio: 2, // เพิ่มความชัด
            backgroundColor: '#ffffff'
        });
        
        // 2. สร้าง PDF แนวนอน (Landscape) ขนาด A4
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // 3. ใส่รูปลงไปให้เต็มหน้ากระดาษ
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Certificate_${certName}.pdf`);

        document.body.style.cursor = 'default';

    } catch (err) {
        document.body.style.cursor = 'default';
        console.error("PDF Download Failed:", err);
        alert("เกิดข้อผิดพลาดในการบันทึก PDF: " + err.message);
    }
  };

  useEffect(() => {
    if (currentPage === 'missions' && userData) {
        if (userData.currentLevel > coreMissions.length) setGameState('certificate');
        else if (gameState !== 'active') setGameState('missions');
    } else if (currentPage !== 'missions' && gameState !== 'active') setGameState('home');
  }, [currentPage, userData]);

  useEffect(() => {
    if (userData && userData.currentLevel > coreMissions.length) {
        const lastSeen = localStorage.getItem('surveyLastSeen');
        if (!lastSeen) setShowSurveyModal(true);
    }
  }, [userData]);

  const closeSurveyModal = () => { setShowSurveyModal(false); localStorage.setItem('surveyLastSeen', Date.now().toString()); };

  if (isLoading || isLoadingPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-cyan-400">
        <GlobalStyles />
        <MatrixRain />
        <div className="relative z-10 text-center space-y-4">
            <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h1 className="text-3xl font-bold cyber-font tracking-widest animate-pulse">SYSTEM BOOTING...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      <GlobalStyles />
      <MovingBackground />
      <div className="scanlines"></div>
      
      {showSurveyModal && <SurveyModal onClose={closeSurveyModal} />}

      {!user && currentPage !== 'auth' && currentPage !== 'manual' && (
        <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900/90 border-2 border-red-500/50 p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] max-w-md w-full animate-in zoom-in-95 duration-300">
                <AlertTriangle size={64} className="text-red-500 mx-auto mb-6 animate-bounce"/>
                <h3 className="text-3xl font-black text-white mb-2 cyber-font">ACCESS DENIED</h3>
                <p className="text-slate-400 mb-8">ระบบรักษาความปลอดภัย: กรุณายืนยันตัวตนก่อนเข้าถึงฐานข้อมูลคดีสืบสวน</p>
                <button
                    onClick={() => navigateTo('auth')}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                >
                    ไปที่หน้าเข้าสู่ระบบ
                </button>
            </div>
        </div>
      )}

      {currentPage === 'manual' ? (
         <ManualPage onComplete={() => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage('auth'); setIsLoadingPage(false); window.scrollTo(0, 0); }, 800); }} />
      ) : (
        <>
          <Header 
            user={user} 
            currentPage={currentPage} 
            navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }} 
            onSignOut={handleSignOut}
            onOpenSurvey={() => setShowSurveyModal(true)} 
          />
          <main className="flex-grow relative z-10 flex flex-col">
              <div className="flex-grow w-full">
                    {currentPage === 'home' && <Home navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }} userData={userData} />}
                    {currentPage === 'landing' && <Home navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }} userData={userData} />}
                    {currentPage === 'auth' && <AuthPage navigateTo={navigateTo} setIsLoadingPage={setIsLoadingPage} handleProviderLogin={handleProviderLogin} />}
                    {currentPage === 'tools' && <ToolsPage navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }} />}
                    {currentPage === 'about' && <AboutPage teamMembers={teamMembers} faqData={faqData} />}
                    {currentPage === 'contact' && <ContactPage glassCard={glassCardStyle} />}
                    {currentPage === 'settings' && user && (
                        <SettingsPage 
                            user={user} 
                            userData={userData} 
                            onSave={() => {
                                setIsLoadingPage(true);
                                setTimeout(() => {
                                    setIsLoadingPage(false);
                                    window.scrollTo(0,0);
                                }, 800);
                            }}
                        />
                    )}
                    {currentPage === 'profile' && user && (
                        <ProfilePage user={user} userData={userData} />
                    )}
                    
                    {currentPage === 'missions' && (gameState === 'missions' || gameState === 'home') && userData && 
                        <MissionsPage 
                            navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }}
                            startMission={startMission} 
                            currentLevel={userData?.currentLevel || 1} 
                            userData={userData}
                            showMinigame={showMinigame}
                            setShowMinigame={setShowMinigame}
                            gainXp={gainXp}
                        />
                    }

                    {currentPage === 'missions' && (gameState === 'active' || gameState === 'pass' || gameState === 'fail') && (
                        <ActiveGame 
                            currentMission={currentMission} 
                            setGameState={setGameState} 
                            aiStatus={aiStatus} 
                            aiMessage={aiMessage} 
                            handleNextMission={handleNextMission}
                            handleSkipMission={handleSkipMission}
                            startMission={startMission} 
                            gameState={gameState} 
                            tools={tools} 
                            selectedTools={selectedTools} 
                            useTool={useTool} 
                            isAnalyzing={isAnalyzing} 
                            analysisProgress={analysisProgress} 
                            geminiExplanation={geminiExplanation} 
                            glassCard={executeAnalysis}
                            skipsRemaining={userData.skipsRemaining !== undefined ? userData.skipsRemaining : 3}
                        />
                    )}
                    {currentPage === 'missions' && gameState === 'certificate' && <CertificatePage setGameState={setGameState} certificateRef={certificateRef} isEditingName={isEditingName} certName={certName} setCertName={setCertName} setIsEditingName={setIsEditingName} handleDownloadPDF={handleDownloadPDF} handleDownloadPNG={handleDownloadPNG} />}
                </div>
            </main>
            <Footer navigateTo={(page) => { setIsLoadingPage(true); setTimeout(() => { setCurrentPage(page); setIsLoadingPage(false); window.scrollTo(0, 0); }, 300); }} />
        </>
      )}
    </div>
  );
};

export default App;
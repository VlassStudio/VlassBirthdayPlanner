'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, X, PartyPopper, Check, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─── Types ───────────────────────────────────────────────────────────────────
type FloatAnim = 'float' | 'spin' | 'bounce' | 'sway';
type KidsEntry = 'gift' | 'rocket' | 'star' | 'wave' | 'portal' | 'explode';
type BgPattern = 'dots' | 'stars' | 'waves' | 'hexagons' | 'stripes' | 'bubbles';
type AdultEntry = 'envelope' | 'curtain' | 'dissolve' | 'rise' | 'shutter';
type DecorStyle = 'corners' | 'lines' | 'glow' | 'particles' | 'rings' | 'none';
type BtnStyle = 'outline' | 'solid' | 'neon' | 'underline';

interface KidsVisual {
  bgGradient: string;
  accentColor: string;
  secondaryColor: string;
  emojis: string[];
  icon: string;
  titleFont: string;
  cardBg: string;
  cardRadius: number;
  cardBorder: string;
  cardShadow: string;
  floatAnim: FloatAnim;
  entryAnim: KidsEntry;
  titleColor: string;
  pillBg: string;
  pillText: string;
  btnRadius: number;
  dark?: boolean;
  bgPattern?: BgPattern;
}

interface AdultVisual {
  bg: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  fontFamily: string;
  titleSize: number;
  titleWeight: number;
  titleStyle: 'normal' | 'italic';
  cardBg: string;
  cardRadius: number;
  cardBorder: string;
  btnStyle: BtnStyle;
  btnBg: string;
  btnBorder: string;
  btnTextColor: string;
  decorStyle: DecorStyle;
  entryAnimation: AdultEntry;
  openIcon: string;
}

// ─── Kids Configs (25 themes) ────────────────────────────────────────────────
const kidsConfigs: Record<string, KidsVisual> = {
  dino:         { bgGradient:'linear-gradient(160deg,#D1FAE5,#A7F3D0,#6EE7B7)', accentColor:'#059669', secondaryColor:'#10B981', emojis:['🦕','🌴','🦖','🍃','🥚','🌿'], icon:'🥚', titleFont:'"Fredoka One",cursive', cardBg:'#FFFFFF', cardRadius:28, cardBorder:'4px solid #A7F3D0', cardShadow:'0 20px 60px rgba(5,150,105,0.25)', floatAnim:'bounce', entryAnim:'gift', titleColor:'#065F46', pillBg:'#D1FAE5', pillText:'#065F46', btnRadius:16, bgPattern:'dots' },
  space:        { bgGradient:'linear-gradient(160deg,#0F172A,#1E293B,#0F172A)', accentColor:'#60A5FA', secondaryColor:'#818CF8', emojis:['🚀','⭐','🌎','👽','☄️','🛸'], icon:'🚀', titleFont:'"Orbitron",sans-serif', cardBg:'rgba(30,41,59,0.9)', cardRadius:12, cardBorder:'1px solid rgba(96,165,250,0.3)', cardShadow:'0 0 40px rgba(96,165,250,0.2)', floatAnim:'float', entryAnim:'rocket', titleColor:'#E0F2FE', pillBg:'rgba(96,165,250,0.15)', pillText:'#93C5FD', btnRadius:6, bgPattern:'stars', dark:true },
  unicorn:      { bgGradient:'linear-gradient(160deg,#FFF0FB,#FCE7F3,#EDE9FE)', accentColor:'#A855F7', secondaryColor:'#EC4899', emojis:['🦄','🌈','✨','🍰','💜','🌸'], icon:'🦄', titleFont:'"Pacifico",cursive', cardBg:'#FFFFFF', cardRadius:40, cardBorder:'3px solid #E879F9', cardShadow:'0 20px 60px rgba(168,85,247,0.2)', floatAnim:'sway', entryAnim:'star', titleColor:'#7C3AED', pillBg:'#F3E8FF', pillText:'#7C3AED', btnRadius:100, bgPattern:'bubbles' },
  superhero:    { bgGradient:'linear-gradient(160deg,#1A0A00,#2D1200,#1A0A00)', accentColor:'#FBBF24', secondaryColor:'#EF4444', emojis:['🦸','💥','⚡','💪','🔥','🦹'], icon:'🦸', titleFont:'"Bangers",cursive', cardBg:'rgba(44,18,0,0.8)', cardRadius:4, cardBorder:'3px solid #FBBF24', cardShadow:'0 0 30px rgba(251,191,36,0.3)', floatAnim:'bounce', entryAnim:'explode', titleColor:'#FDE68A', pillBg:'rgba(251,191,36,0.15)', pillText:'#FBBF24', btnRadius:4, bgPattern:'stripes', dark:true },
  mermaid:      { bgGradient:'linear-gradient(160deg,#0C4A6E,#075985,#0E7490)', accentColor:'#22D3EE', secondaryColor:'#67E8F9', emojis:['🧜‍♀️','🐟','🪸','🌊','🐠','🐙'], icon:'🧜‍♀️', titleFont:'"Quicksand",sans-serif', cardBg:'rgba(8,145,178,0.3)', cardRadius:20, cardBorder:'2px solid rgba(34,211,238,0.4)', cardShadow:'0 20px 40px rgba(34,211,238,0.15)', floatAnim:'sway', entryAnim:'wave', titleColor:'#ECFEFF', pillBg:'rgba(34,211,238,0.15)', pillText:'#22D3EE', btnRadius:100, bgPattern:'waves', dark:true },
  safari:       { bgGradient:'linear-gradient(160deg,#451A03,#713F12,#92400E)', accentColor:'#FBBF24', secondaryColor:'#F59E0B', emojis:['🦁','🌴','🐘','🦓','🐒','🌿'], icon:'🦁', titleFont:'"Fredoka One",cursive', cardBg:'rgba(120,53,15,0.8)', cardRadius:16, cardBorder:'2px solid rgba(251,191,36,0.3)', cardShadow:'0 20px 40px rgba(0,0,0,0.4)', floatAnim:'sway', entryAnim:'gift', titleColor:'#FEF3C7', pillBg:'rgba(251,191,36,0.2)', pillText:'#FBBF24', btnRadius:12, bgPattern:'dots', dark:true },
  space5:       { bgGradient:'linear-gradient(160deg,#0D0018,#1A0040,#0D0018)', accentColor:'#C084FC', secondaryColor:'#A855F7', emojis:['🪐','🌌','🛸','⭐','🌠','✨'], icon:'🪐', titleFont:'"Orbitron",sans-serif', cardBg:'rgba(88,28,135,0.3)', cardRadius:16, cardBorder:'1px solid rgba(192,132,252,0.4)', cardShadow:'0 0 40px rgba(192,132,252,0.2)', floatAnim:'float', entryAnim:'portal', titleColor:'#F3E8FF', pillBg:'rgba(192,132,252,0.15)', pillText:'#C084FC', btnRadius:8, bgPattern:'stars', dark:true },
  dinosaur2:    { bgGradient:'linear-gradient(160deg,#14532D,#166534,#15803D)', accentColor:'#86EFAC', secondaryColor:'#4ADE80', emojis:['🦖','🌋','🌿','🥚','🌴','💥'], icon:'🦖', titleFont:'"Bangers",cursive', cardBg:'rgba(20,83,45,0.8)', cardRadius:8, cardBorder:'3px solid #4ADE80', cardShadow:'0 0 30px rgba(74,222,128,0.2)', floatAnim:'bounce', entryAnim:'explode', titleColor:'#DCFCE7', pillBg:'rgba(134,239,172,0.2)', pillText:'#86EFAC', btnRadius:6, bgPattern:'dots', dark:true },
  fairy:        { bgGradient:'linear-gradient(160deg,#581C87,#6D28D9,#7C3AED)', accentColor:'#F0ABFC', secondaryColor:'#E879F9', emojis:['🧚','🌸','✨','🌟','🍄','🦋'], icon:'🧚', titleFont:'"Pacifico",cursive', cardBg:'rgba(109,40,217,0.4)', cardRadius:32, cardBorder:'2px solid rgba(240,171,252,0.5)', cardShadow:'0 20px 50px rgba(240,171,252,0.15)', floatAnim:'float', entryAnim:'star', titleColor:'#FAE8FF', pillBg:'rgba(240,171,252,0.15)', pillText:'#F0ABFC', btnRadius:100, bgPattern:'stars', dark:true },
  monster:      { bgGradient:'linear-gradient(160deg,#052E16,#14532D,#166534)', accentColor:'#4ADE80', secondaryColor:'#86EFAC', emojis:['👾','🟢','👀','🦷','😈','💚'], icon:'👾', titleFont:'"Bangers",cursive', cardBg:'rgba(5,46,22,0.9)', cardRadius:0, cardBorder:'4px solid #4ADE80', cardShadow:'0 0 20px rgba(74,222,128,0.3)', floatAnim:'bounce', entryAnim:'explode', titleColor:'#DCFCE7', pillBg:'rgba(74,222,128,0.15)', pillText:'#4ADE80', btnRadius:0, bgPattern:'hexagons', dark:true },
  robot2:       { bgGradient:'linear-gradient(160deg,#0F172A,#1E293B)', accentColor:'#94A3B8', secondaryColor:'#CBD5E1', emojis:['🤖','⚙️','🔩','💡','🔋','📡'], icon:'🤖', titleFont:'monospace', cardBg:'rgba(30,41,59,0.95)', cardRadius:4, cardBorder:'1px solid #475569', cardShadow:'0 0 20px rgba(148,163,184,0.1)', floatAnim:'spin', entryAnim:'portal', titleColor:'#CBD5E1', pillBg:'rgba(148,163,184,0.1)', pillText:'#94A3B8', btnRadius:2, bgPattern:'hexagons', dark:true },
  castle:       { bgGradient:'linear-gradient(160deg,#1E3A5F,#1E40AF,#1D4ED8)', accentColor:'#93C5FD', secondaryColor:'#BFDBFE', emojis:['🏰','🛡️','⚔️','👑','🐉','🦅'], icon:'🏰', titleFont:'serif', cardBg:'rgba(30,64,175,0.4)', cardRadius:2, cardBorder:'2px solid rgba(147,197,253,0.4)', cardShadow:'0 20px 40px rgba(147,197,253,0.1)', floatAnim:'float', entryAnim:'wave', titleColor:'#DBEAFE', pillBg:'rgba(147,197,253,0.15)', pillText:'#93C5FD', btnRadius:2, bgPattern:'stripes', dark:true },
  zoo:          { bgGradient:'linear-gradient(160deg,#7C2D12,#9A3412,#C2410C)', accentColor:'#FB923C', secondaryColor:'#FDBA74', emojis:['🦁','🐘','🦒','🦓','🐆','🦊'], icon:'🦁', titleFont:'"Fredoka One",cursive', cardBg:'rgba(154,52,18,0.7)', cardRadius:20, cardBorder:'3px solid rgba(251,146,60,0.5)', cardShadow:'0 20px 40px rgba(0,0,0,0.3)', floatAnim:'bounce', entryAnim:'gift', titleColor:'#FFF7ED', pillBg:'rgba(251,146,60,0.2)', pillText:'#FB923C', btnRadius:100, bgPattern:'dots', dark:true },
  magic:        { bgGradient:'linear-gradient(160deg,#2E1065,#4C1D95,#5B21B6)', accentColor:'#FCD34D', secondaryColor:'#F9A8D4', emojis:['🪄','✨','🌟','🔮','⭐','💫'], icon:'🪄', titleFont:'"Pacifico",cursive', cardBg:'rgba(76,29,149,0.5)', cardRadius:24, cardBorder:'2px solid rgba(252,211,77,0.4)', cardShadow:'0 0 40px rgba(252,211,77,0.15)', floatAnim:'float', entryAnim:'star', titleColor:'#FDE68A', pillBg:'rgba(252,211,77,0.1)', pillText:'#FCD34D', btnRadius:100, bgPattern:'stars', dark:true },
  construction: { bgGradient:'linear-gradient(160deg,#1C1100,#2D1A00,#3B2200)', accentColor:'#FBBF24', secondaryColor:'#F59E0B', emojis:['🚧','⚒️','🏗️','🦺','🔧','🚛'], icon:'🚧', titleFont:'"Bangers",cursive', cardBg:'rgba(44,26,0,0.95)', cardRadius:4, cardBorder:'4px dashed #FBBF24', cardShadow:'0 0 20px rgba(251,191,36,0.2)', floatAnim:'bounce', entryAnim:'explode', titleColor:'#FEF3C7', pillBg:'rgba(251,191,36,0.15)', pillText:'#FBBF24', btnRadius:4, bgPattern:'stripes', dark:true },
  music:        { bgGradient:'linear-gradient(160deg,#450A4F,#701A75,#86198F)', accentColor:'#F0ABFC', secondaryColor:'#E879F9', emojis:['🎵','🎸','🎤','🎹','🥁','🎶'], icon:'🎵', titleFont:'"Pacifico",cursive', cardBg:'rgba(112,26,117,0.5)', cardRadius:20, cardBorder:'2px solid rgba(240,171,252,0.4)', cardShadow:'0 20px 40px rgba(240,171,252,0.1)', floatAnim:'bounce', entryAnim:'star', titleColor:'#FAE8FF', pillBg:'rgba(240,171,252,0.1)', pillText:'#F0ABFC', btnRadius:100, bgPattern:'waves', dark:true },
  science:      { bgGradient:'linear-gradient(160deg,#0A2740,#0C4A6E,#075985)', accentColor:'#38BDF8', secondaryColor:'#7DD3FC', emojis:['🔬','⚗️','🧪','💡','🧬','🔭'], icon:'🔬', titleFont:'monospace', cardBg:'rgba(12,74,110,0.7)', cardRadius:8, cardBorder:'1px solid rgba(56,189,248,0.4)', cardShadow:'0 0 30px rgba(56,189,248,0.1)', floatAnim:'float', entryAnim:'portal', titleColor:'#E0F2FE', pillBg:'rgba(56,189,248,0.1)', pillText:'#38BDF8', btnRadius:4, bgPattern:'hexagons', dark:true },
  art:          { bgGradient:'linear-gradient(160deg,#FFFBF0,#FFF7E0)', accentColor:'#EC4899', secondaryColor:'#F97316', emojis:['🎨','🖌️','🖍️','✏️','🎭','🖼️'], icon:'🎨', titleFont:'"Pacifico",cursive', cardBg:'#FFFFFF', cardRadius:40, cardBorder:'4px solid transparent', cardShadow:'0 20px 50px rgba(236,72,153,0.15)', floatAnim:'sway', entryAnim:'star', titleColor:'#18181B', pillBg:'#FCE7F3', pillText:'#DB2777', btnRadius:100, bgPattern:'dots' },
  beach:        { bgGradient:'linear-gradient(160deg,#0369A1,#0284C7,#0EA5E9)', accentColor:'#FCD34D', secondaryColor:'#FDE68A', emojis:['🏖️','🌊','🐚','☀️','🦀','⛱️'], icon:'🏖️', titleFont:'"Fredoka One",cursive', cardBg:'rgba(2,132,199,0.4)', cardRadius:24, cardBorder:'2px solid rgba(252,211,77,0.5)', cardShadow:'0 20px 40px rgba(252,211,77,0.1)', floatAnim:'sway', entryAnim:'wave', titleColor:'#E0F2FE', pillBg:'rgba(252,211,77,0.15)', pillText:'#FCD34D', btnRadius:100, bgPattern:'waves', dark:true },
  farm:         { bgGradient:'linear-gradient(160deg,#1A2E05,#365314,#4D7C0F)', accentColor:'#A3E635', secondaryColor:'#BEF264', emojis:['🐮','🐔','🐷','🌻','🚜','🌾'], icon:'🚜', titleFont:'"Fredoka One",cursive', cardBg:'rgba(54,83,20,0.8)', cardRadius:12, cardBorder:'3px solid rgba(163,230,53,0.4)', cardShadow:'0 20px 40px rgba(0,0,0,0.3)', floatAnim:'bounce', entryAnim:'gift', titleColor:'#ECFCCB', pillBg:'rgba(163,230,53,0.15)', pillText:'#A3E635', btnRadius:12, bgPattern:'dots', dark:true },
  pirate:       { bgGradient:'linear-gradient(160deg,#0C1B33,#1E3A5F,#0C1B33)', accentColor:'#EF4444', secondaryColor:'#FBBF24', emojis:['🏴‍☠️','⚓','🦜','⚔️','💀','🗺️'], icon:'🏴‍☠️', titleFont:'"Bangers",cursive', cardBg:'rgba(12,27,51,0.9)', cardRadius:4, cardBorder:'3px solid #EF4444', cardShadow:'0 0 30px rgba(239,68,68,0.2)', floatAnim:'sway', entryAnim:'wave', titleColor:'#FEF2F2', pillBg:'rgba(239,68,68,0.15)', pillText:'#EF4444', btnRadius:4, bgPattern:'stripes', dark:true },
  fairytale:    { bgGradient:'linear-gradient(160deg,#3B0764,#6D28D9,#7C3AED)', accentColor:'#FCD34D', secondaryColor:'#F9A8D4', emojis:['📖','🏰','🧙','🌟','🦋','🌸'], icon:'📖', titleFont:'serif', cardBg:'rgba(91,33,182,0.4)', cardRadius:0, cardBorder:'2px solid rgba(252,211,77,0.5)', cardShadow:'0 20px 40px rgba(252,211,77,0.1)', floatAnim:'float', entryAnim:'portal', titleColor:'#FDE68A', pillBg:'rgba(252,211,77,0.1)', pillText:'#FCD34D', btnRadius:0, bgPattern:'stars', dark:true },
  robot:        { bgGradient:'linear-gradient(160deg,#1A1A2E,#16213E,#0F3460)', accentColor:'#00B4D8', secondaryColor:'#48CAE4', emojis:['🤖','💻','⚡','🔌','📱','🎮'], icon:'🤖', titleFont:'monospace', cardBg:'rgba(15,52,96,0.7)', cardRadius:0, cardBorder:'2px solid rgba(0,180,216,0.5)', cardShadow:'0 0 30px rgba(0,180,216,0.15)', floatAnim:'spin', entryAnim:'portal', titleColor:'#CAF0F8', pillBg:'rgba(0,180,216,0.1)', pillText:'#00B4D8', btnRadius:0, bgPattern:'hexagons', dark:true },
  candy:        { bgGradient:'linear-gradient(160deg,#FF0066,#FF4499,#FF80BB)', accentColor:'#FFFFFF', secondaryColor:'#FFE5F0', emojis:['🍭','🍬','🍡','🍑','🍓','🎪'], icon:'🍭', titleFont:'"Fredoka One",cursive', cardBg:'#FFFFFF', cardRadius:100, cardBorder:'none', cardShadow:'0 20px 50px rgba(255,0,102,0.3)', floatAnim:'bounce', entryAnim:'star', titleColor:'#FF0066', pillBg:'#FFE5F0', pillText:'#FF0066', btnRadius:100, bgPattern:'bubbles' },
  sports:       { bgGradient:'linear-gradient(160deg,#052E16,#14532D,#166534)', accentColor:'#4ADE80', secondaryColor:'#FFFFFF', emojis:['⚽','🏆','🏅','🎯','⚡','🏃'], icon:'🏆', titleFont:'"Bangers",cursive', cardBg:'rgba(20,83,45,0.8)', cardRadius:8, cardBorder:'3px solid #4ADE80', cardShadow:'0 0 30px rgba(74,222,128,0.2)', floatAnim:'bounce', entryAnim:'explode', titleColor:'#DCFCE7', pillBg:'rgba(74,222,128,0.15)', pillText:'#4ADE80', btnRadius:6, bgPattern:'stripes', dark:true },
  princess:     { bgGradient:'linear-gradient(160deg,#FFF0F7,#FCE7F3,#FFDCEE)', accentColor:'#DB2777', secondaryColor:'#F472B6', emojis:['👑','💎','🌸','🦢','💗','🌺'], icon:'👑', titleFont:'"Pacifico",cursive', cardBg:'#FFFFFF', cardRadius:32, cardBorder:'3px solid #FBCFE8', cardShadow:'0 20px 60px rgba(219,39,119,0.15)', floatAnim:'float', entryAnim:'star', titleColor:'#831843', pillBg:'#FCE7F3', pillText:'#DB2777', btnRadius:100, bgPattern:'bubbles' },
  space2:       { bgGradient:'linear-gradient(160deg,#1A0040,#2D0060,#1A0040)', accentColor:'#818CF8', secondaryColor:'#A5B4FC', emojis:['🪐','🌙','💫','🌌','🛰️','🔭'], icon:'🌙', titleFont:'monospace', cardBg:'rgba(45,0,96,0.6)', cardRadius:20, cardBorder:'1px solid rgba(129,140,248,0.4)', cardShadow:'0 0 40px rgba(129,140,248,0.15)', floatAnim:'float', entryAnim:'portal', titleColor:'#E0E7FF', pillBg:'rgba(129,140,248,0.15)', pillText:'#818CF8', btnRadius:8, bgPattern:'stars', dark:true },
};

// ─── Adult Configs (25 themes) ───────────────────────────────────────────────
const adultConfigs: Record<string, AdultVisual> = {
  minimalist: { bg:'#FAFAFA', accentColor:'#18181B', textColor:'#18181B', subtextColor:'#71717A', fontFamily:'sans-serif', titleSize:32, titleWeight:300, titleStyle:'normal', cardBg:'#F4F4F5', cardRadius:0, cardBorder:'1px solid #E4E4E7', btnStyle:'outline', btnBg:'transparent', btnBorder:'#18181B', btnTextColor:'#18181B', decorStyle:'lines', entryAnimation:'dissolve', openIcon:'✉️' },
  gold:       { bg:'#FFFDF9', accentColor:'#D4AF37', textColor:'#332200', subtextColor:'#5C4A33', fontFamily:'Georgia,serif', titleSize:38, titleWeight:400, titleStyle:'italic', cardBg:'rgba(212,175,55,0.04)', cardRadius:4, cardBorder:'1px solid rgba(212,175,55,0.25)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#D4AF37', btnTextColor:'#B45309', decorStyle:'corners', entryAnimation:'envelope', openIcon:'✨' },
  neon:       { bg:'#030014', accentColor:'#C084FC', textColor:'#FAFAFA', subtextColor:'#A78BFA', fontFamily:'sans-serif', titleSize:34, titleWeight:700, titleStyle:'normal', cardBg:'rgba(192,132,252,0.05)', cardRadius:12, cardBorder:'1px solid rgba(192,132,252,0.3)', btnStyle:'neon', btnBg:'transparent', btnBorder:'#C084FC', btnTextColor:'#C084FC', decorStyle:'glow', entryAnimation:'rise', openIcon:'🔮' },
  retro:      { bg:'#120025', accentColor:'#FF00FF', textColor:'#FFFFFF', subtextColor:'#FF80FF', fontFamily:'monospace', titleSize:22, titleWeight:700, titleStyle:'normal', cardBg:'rgba(255,0,255,0.05)', cardRadius:0, cardBorder:'2px solid #FF00FF', btnStyle:'neon', btnBg:'transparent', btnBorder:'#FF00FF', btnTextColor:'#FF00FF', decorStyle:'particles', entryAnimation:'shutter', openIcon:'📼' },
  tropical:   { bg:'#F0FDF4', accentColor:'#059669', textColor:'#064E3B', subtextColor:'#1B4D3E', fontFamily:'sans-serif', titleSize:36, titleWeight:300, titleStyle:'normal', cardBg:'rgba(5,150,105,0.04)', cardRadius:24, cardBorder:'1px solid rgba(5,150,105,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#059669', btnTextColor:'#059669', decorStyle:'rings', entryAnimation:'curtain', openIcon:'🌺' },
  blackTie:   { bg:'#09090B', accentColor:'#FFFFFF', textColor:'#FFFFFF', subtextColor:'#71717A', fontFamily:'Georgia,serif', titleSize:36, titleWeight:700, titleStyle:'italic', cardBg:'#111113', cardRadius:2, cardBorder:'1px solid #27272A', btnStyle:'solid', btnBg:'#FFFFFF', btnBorder:'#FFFFFF', btnTextColor:'#09090B', decorStyle:'corners', entryAnimation:'envelope', openIcon:'🤵' },
  wine:       { bg:'#1A0010', accentColor:'#F472B6', textColor:'#FDF2F8', subtextColor:'#F9A8D4', fontFamily:'Georgia,serif', titleSize:38, titleWeight:400, titleStyle:'italic', cardBg:'rgba(168,0,80,0.15)', cardRadius:16, cardBorder:'1px solid rgba(244,114,182,0.3)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#F472B6', btnTextColor:'#F472B6', decorStyle:'glow', entryAnimation:'rise', openIcon:'🍷' },
  candle:     { bg:'#1C0F00', accentColor:'#FCD34D', textColor:'#FEF3C7', subtextColor:'#FDE68A', fontFamily:'Georgia,serif', titleSize:36, titleWeight:400, titleStyle:'italic', cardBg:'rgba(251,191,36,0.06)', cardRadius:4, cardBorder:'1px solid rgba(252,211,77,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#FCD34D', btnTextColor:'#FCD34D', decorStyle:'particles', entryAnimation:'dissolve', openIcon:'🕯️' },
  speakeasy:  { bg:'#111A24', accentColor:'#94A3B8', textColor:'#E2E8F0', subtextColor:'#94A3B8', fontFamily:'Georgia,serif', titleSize:34, titleWeight:400, titleStyle:'italic', cardBg:'rgba(71,85,105,0.2)', cardRadius:4, cardBorder:'1px solid rgba(148,163,184,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#94A3B8', btnTextColor:'#94A3B8', decorStyle:'lines', entryAnimation:'curtain', openIcon:'🍸' },
  artDeco:    { bg:'#0D0D00', accentColor:'#EF4444', textColor:'#FEF2F2', subtextColor:'#FECACA', fontFamily:'serif', titleSize:32, titleWeight:700, titleStyle:'normal', cardBg:'rgba(239,68,68,0.06)', cardRadius:0, cardBorder:'1px solid rgba(239,68,68,0.3)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#EF4444', btnTextColor:'#EF4444', decorStyle:'corners', entryAnimation:'shutter', openIcon:'🏛️' },
  jazz:       { bg:'#1A0000', accentColor:'#F43F5E', textColor:'#FFF1F2', subtextColor:'#FDA4AF', fontFamily:'serif', titleSize:48, titleWeight:700, titleStyle:'normal', cardBg:'rgba(244,63,94,0.06)', cardRadius:0, cardBorder:'none', btnStyle:'solid', btnBg:'#F43F5E', btnBorder:'#F43F5E', btnTextColor:'#FFFFFF', decorStyle:'lines', entryAnimation:'rise', openIcon:'🎷' },
  masala:     { bg:'#1C0000', accentColor:'#FB923C', textColor:'#FFF7ED', subtextColor:'#FED7AA', fontFamily:'sans-serif', titleSize:34, titleWeight:300, titleStyle:'normal', cardBg:'rgba(251,146,60,0.06)', cardRadius:20, cardBorder:'1px solid rgba(251,146,60,0.25)', btnStyle:'solid', btnBg:'#FB923C', btnBorder:'#FB923C', btnTextColor:'#FFFFFF', decorStyle:'rings', entryAnimation:'curtain', openIcon:'🍛' },
  galaxy:     { bg:'#020024', accentColor:'#6366F1', textColor:'#E0E7FF', subtextColor:'#A5B4FC', fontFamily:'sans-serif', titleSize:34, titleWeight:600, titleStyle:'normal', cardBg:'rgba(99,102,241,0.08)', cardRadius:16, cardBorder:'1px solid rgba(99,102,241,0.3)', btnStyle:'neon', btnBg:'transparent', btnBorder:'#6366F1', btnTextColor:'#6366F1', decorStyle:'particles', entryAnimation:'dissolve', openIcon:'🌌' },
  midnight:   { bg:'#030712', accentColor:'#F8FAFC', textColor:'#F1F5F9', subtextColor:'#94A3B8', fontFamily:'sans-serif', titleSize:36, titleWeight:200, titleStyle:'normal', cardBg:'rgba(255,255,255,0.02)', cardRadius:0, cardBorder:'1px solid rgba(255,255,255,0.07)', btnStyle:'underline', btnBg:'transparent', btnBorder:'transparent', btnTextColor:'#F8FAFC', decorStyle:'none', entryAnimation:'dissolve', openIcon:'🌙' },
  royal:      { bg:'#1A0040', accentColor:'#C084FC', textColor:'#F3E8FF', subtextColor:'#D8B4FE', fontFamily:'serif', titleSize:34, titleWeight:700, titleStyle:'normal', cardBg:'rgba(192,132,252,0.06)', cardRadius:0, cardBorder:'1px solid rgba(192,132,252,0.3)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#C084FC', btnTextColor:'#C084FC', decorStyle:'corners', entryAnimation:'envelope', openIcon:'👑' },
  tinsel:     { bg:'#0D1F0D', accentColor:'#FCD34D', textColor:'#F0FDF4', subtextColor:'#BBF7D0', fontFamily:'Georgia,serif', titleSize:34, titleWeight:400, titleStyle:'italic', cardBg:'rgba(252,211,77,0.05)', cardRadius:8, cardBorder:'1px solid rgba(252,211,77,0.25)', btnStyle:'solid', btnBg:'#FCD34D', btnBorder:'#FCD34D', btnTextColor:'#0D1F0D', decorStyle:'particles', entryAnimation:'rise', openIcon:'🎄' },
  urban:      { bg:'#111111', accentColor:'#E5E5E5', textColor:'#E5E5E5', subtextColor:'#737373', fontFamily:'sans-serif', titleSize:40, titleWeight:800, titleStyle:'normal', cardBg:'#1A1A1A', cardRadius:0, cardBorder:'none', btnStyle:'solid', btnBg:'#E5E5E5', btnBorder:'#E5E5E5', btnTextColor:'#111111', decorStyle:'lines', entryAnimation:'shutter', openIcon:'🏙️' },
  safariAdult:{ bg:'#0D1F0A', accentColor:'#86EFAC', textColor:'#F0FDF4', subtextColor:'#A7F3D0', fontFamily:'sans-serif', titleSize:34, titleWeight:300, titleStyle:'normal', cardBg:'rgba(134,239,172,0.05)', cardRadius:12, cardBorder:'1px solid rgba(134,239,172,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#86EFAC', btnTextColor:'#86EFAC', decorStyle:'rings', entryAnimation:'curtain', openIcon:'🦁' },
  opera:      { bg:'#200020', accentColor:'#E879F9', textColor:'#FAE8FF', subtextColor:'#D946EF', fontFamily:'serif', titleSize:36, titleWeight:700, titleStyle:'italic', cardBg:'rgba(232,121,249,0.06)', cardRadius:0, cardBorder:'1px solid rgba(232,121,249,0.3)', btnStyle:'neon', btnBg:'transparent', btnBorder:'#E879F9', btnTextColor:'#E879F9', decorStyle:'glow', entryAnimation:'rise', openIcon:'🎭' },
  luxury:     { bg:'#0A0500', accentColor:'#F97316', textColor:'#FFF7ED', subtextColor:'#FED7AA', fontFamily:'Georgia,serif', titleSize:40, titleWeight:400, titleStyle:'italic', cardBg:'rgba(249,115,22,0.06)', cardRadius:4, cardBorder:'1px solid rgba(249,115,22,0.25)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#F97316', btnTextColor:'#F97316', decorStyle:'corners', entryAnimation:'envelope', openIcon:'💎' },
  festival:   { bg:'#040824', accentColor:'#FBBF24', textColor:'#FFFBEB', subtextColor:'#FDE68A', fontFamily:'sans-serif', titleSize:36, titleWeight:700, titleStyle:'normal', cardBg:'rgba(251,191,36,0.06)', cardRadius:12, cardBorder:'1px solid rgba(251,191,36,0.25)', btnStyle:'solid', btnBg:'#FBBF24', btnBorder:'#FBBF24', btnTextColor:'#040824', decorStyle:'particles', entryAnimation:'shutter', openIcon:'🎉' },
  vintage:    { bg:'#FAF7F2', accentColor:'#7C3AED', textColor:'#2E1065', subtextColor:'#4C1D95', fontFamily:'Georgia,serif', titleSize:34, titleWeight:400, titleStyle:'italic', cardBg:'rgba(124,58,237,0.04)', cardRadius:4, cardBorder:'1px solid rgba(124,58,237,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#7C3AED', btnTextColor:'#7C3AED', decorStyle:'corners', entryAnimation:'dissolve', openIcon:'📻' },
  cosmo:      { bg:'#1A0820', accentColor:'#EC4899', textColor:'#FDF2F8', subtextColor:'#F9A8D4', fontFamily:'sans-serif', titleSize:38, titleWeight:700, titleStyle:'normal', cardBg:'rgba(236,72,153,0.06)', cardRadius:24, cardBorder:'1px solid rgba(236,72,153,0.25)', btnStyle:'solid', btnBg:'#EC4899', btnBorder:'#EC4899', btnTextColor:'#FFFFFF', decorStyle:'glow', entryAnimation:'rise', openIcon:'🌠' },
  gala:       { bg:'#F0FDFA', accentColor:'#0D9488', textColor:'#042F2E', subtextColor:'#0F766E', fontFamily:'sans-serif', titleSize:36, titleWeight:300, titleStyle:'normal', cardBg:'rgba(13,148,136,0.04)', cardRadius:16, cardBorder:'1px solid rgba(13,148,136,0.25)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#0D9488', btnTextColor:'#0D9488', decorStyle:'rings', entryAnimation:'curtain', openIcon:'🥂' },
  mood:       { bg:'#1A0005', accentColor:'#F43F5E', textColor:'#FFF1F2', subtextColor:'#FDA4AF', fontFamily:'sans-serif', titleSize:34, titleWeight:300, titleStyle:'normal', cardBg:'rgba(244,63,94,0.05)', cardRadius:32, cardBorder:'1px solid rgba(244,63,94,0.2)', btnStyle:'outline', btnBg:'transparent', btnBorder:'#F43F5E', btnTextColor:'#F43F5E', decorStyle:'rings', entryAnimation:'dissolve', openIcon:'🧘' },
  aurora:     { bg:'#011528', accentColor:'#38BDF8', textColor:'#E0F2FE', subtextColor:'#7DD3FC', fontFamily:'sans-serif', titleSize:34, titleWeight:400, titleStyle:'normal', cardBg:'rgba(56,189,248,0.05)', cardRadius:20, cardBorder:'1px solid rgba(56,189,248,0.2)', btnStyle:'neon', btnBg:'transparent', btnBorder:'#38BDF8', btnTextColor:'#38BDF8', decorStyle:'glow', entryAnimation:'rise', openIcon:'🪐' },
};

// ─── Background Pattern SVGs ─────────────────────────────────────────────────
function getBgPattern(pattern: BgPattern, color: string): string {
  const c = encodeURIComponent(color);
  switch (pattern) {
    case 'dots':     return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='1.5' fill='${c}' opacity='0.25'/></svg>")`;
    case 'stars':    return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><text x='8' y='20' font-size='14' opacity='0.18'>★</text><text x='25' y='35' font-size='9' opacity='0.12'>★</text></svg>")`;
    case 'waves':    return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='20'><path d='M0 10 Q15 0 30 10 Q45 20 60 10' fill='none' stroke='${c}' stroke-width='1' opacity='0.2'/></svg>")`;
    case 'hexagons': return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><polygon points='14,2 24,8 24,20 14,26 4,20 4,8' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.2'/></svg>")`;
    case 'stripes':  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='0' y1='20' x2='20' y2='0' stroke='${c}' stroke-width='1' opacity='0.15'/></svg>")`;
    case 'bubbles':  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='10' cy='10' r='6' fill='none' stroke='${c}' stroke-width='1' opacity='0.2'/><circle cx='30' cy='30' r='4' fill='none' stroke='${c}' stroke-width='0.8' opacity='0.15'/></svg>")`;
    default:         return 'none';
  }
}

const patternSize: Record<BgPattern, string> = {
  dots: '20px 20px', stars: '40px 40px', waves: '60px 20px',
  hexagons: '28px 28px', stripes: '20px 20px', bubbles: '40px 40px',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function ThemeRenderer({ party, scale = 1, forceOpen = false }: { party: any; scale?: number; forceOpen?: boolean }) {
  const [isOpened, setIsOpened] = useState(forceOpen);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'yes' | 'no'>(null);
  const [form, setForm] = useState({ name: '', children: 1, adults: 1, diet: '', plusOne: false, message: '' });
  const [willDropOff, setWillDropOff] = useState<'yes' | 'no'>('no');
  const [submitted, setSubmitted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!party) return null;

  const { theme, name, date, time, location, type, customText } = party;
  const formattedDate = date ? new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const welcomeText   = customText?.welcome    || (type === 'adult' ? 'YOU ARE INVITED' : 'YAYYY! PARTY TIME!');
  const subtitleText  = customText?.subtitle   || (type === 'adult' ? 'Kehadiran Anda adalah kebahagiaan kami' : 'Ayo datang dan rayakan bersama!');
  const rsvpButtonText = customText?.rsvpButton || (type === 'adult' ? 'Buka RSVP' : 'RSVP SEKARANG! 🎈');
  const closingText   = (customText?.closing && customText.closing.trim()) ? customText.closing : (type === 'adult' ? "Dress to impress & Let's party!" : 'Bring your biggest smile!');

  useEffect(() => { setIsOpened(forceOpen); setRsvpOpen(false); setWillDropOff('no'); }, [theme, forceOpen]);

  const kidsConfig  = kidsConfigs[theme]  || kidsConfigs.dino;
  const adultConfig = adultConfigs[theme] || adultConfigs.gold;

  const handleOpen = () => {
    setIsOpened(true);
    const colors = type === 'kids'
      ? [kidsConfig.accentColor, kidsConfig.secondaryColor, '#FF3366', '#FFD700']
      : [adultConfig.accentColor, '#FFFFFF', '#FFD700'];
    const duration = 2500;
    const end = Date.now() + duration;

    const canvas = canvasRef.current;
    if (canvas) {
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
      const frame = () => {
        myConfetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors });
        myConfetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else {
      const frame = () => {
        confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  };

  const renderRsvpModal = (isKids: boolean) => {
    const modalBg = isKids 
      ? (kidsConfig.cardBg === 'transparent' ? 'white' : kidsConfig.cardBg)
      : (adultConfig.bg === 'transparent' ? '#18181B' : adultConfig.bg);

    const modalBorder = isKids ? kidsConfig.cardBorder : adultConfig.cardBorder;
    const modalRadius = isKids ? kidsConfig.cardRadius : adultConfig.cardRadius;
    const font = isKids ? kidsConfig.titleFont : adultConfig.fontFamily;
    const textClr = isKids ? kidsConfig.titleColor : adultConfig.textColor;
    const subTextClr = isKids ? (kidsConfig.dark ? 'rgba(255,255,255,0.7)' : '#71717A') : adultConfig.subtextColor;
    
    const closeBtnBg = isKids ? kidsConfig.pillBg : 'transparent';
    const closeBtnColor = isKids ? kidsConfig.titleColor : adultConfig.accentColor;

    const submitBtnBg = isKids ? kidsConfig.accentColor : adultConfig.btnBg;
    const submitBtnBorder = isKids ? 'none' : `1px solid ${adultConfig.btnBorder}`;
    const submitBtnColor = isKids 
      ? (kidsConfig.accentColor === '#FFFFFF' ? '#FF0066' : (kidsConfig.dark ? '#000' : '#fff'))
      : adultConfig.btnTextColor;
    const submitBtnRadius = isKids 
      ? kidsConfig.btnRadius 
      : (adultConfig.btnStyle === 'neon' || adultConfig.btnStyle === 'outline' ? 100 : (adultConfig.cardRadius > 8 ? 100 : 4));
    
    const getOptionStyle = (s: 'yes' | 'no') => {
      const active = rsvpStatus === s;
      if (isKids) {
        const activeBg = kidsConfig.accentColor;
        const activeText = kidsConfig.accentColor === '#FFFFFF' ? '#FF0066' : (kidsConfig.dark ? '#0B132B' : '#FFFFFF');
        const inactiveBg = kidsConfig.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        const inactiveText = kidsConfig.dark ? 'rgba(255,255,255,0.6)' : '#64748B';
        const borderColor = active ? kidsConfig.accentColor : (kidsConfig.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)');
        return {
          flex: 1, padding: 14, borderRadius: kidsConfig.btnRadius || 20,
          border: `3px solid ${borderColor}`,
          background: active ? activeBg : inactiveBg, fontWeight: 800, fontSize: 15, cursor: 'pointer',
          color: active ? activeText : inactiveText, transition: 'all 0.2s', fontFamily: kidsConfig.titleFont
        };
      } else {
        return {
          flex: 1, padding: 14, borderRadius: adultConfig.cardRadius > 8 ? 8 : 2,
          border: `1px solid ${active ? adultConfig.accentColor : '#27272A'}`,
          background: active ? 'rgba(255,255,255,0.08)' : 'transparent', fontWeight: 800, fontSize: 15, cursor: 'pointer',
          color: active ? adultConfig.accentColor : adultConfig.subtextColor, transition: 'all 0.2s', fontFamily: adultConfig.fontFamily
        };
      }
    };

    const isLightBg = isKids ? !kidsConfig.dark : (adultConfig.bg === '#FAFAFA' || adultConfig.bg === '#FFFBF0' || adultConfig.bg === '#FAF7F2' || adultConfig.bg === '#F0FDFA');

    const inputStyle: React.CSSProperties = {
      padding: '12px 16px', borderRadius: isKids ? (kidsConfig.btnRadius || 14) : (adultConfig.cardRadius > 8 ? 8 : 2),
      border: isKids ? `2px solid ${kidsConfig.pillBg}` : `1px solid ${adultConfig.accentColor}40`,
      background: isLightBg ? '#FFFFFF' : '#1E293B', color: isLightBg ? '#18181B' : '#FAFAFA',
      fontSize: isKids ? 14 : 13, fontWeight: isKids ? 600 : 400, outline: 'none', width: '100%', fontFamily: font
    };

    const isNameValid = form.name.trim().length > 0;

    return (
      <AnimatePresence>
        {rsvpOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: isKids ? (kidsConfig.dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)') : 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <style>{`.rsvp-input::placeholder { color: ${isLightBg ? '#9CA3AF' : 'rgba(255, 255, 255, 0.4)'} !important; opacity: 1; }`}</style>
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              style={{ background: modalBg, width: '100%', maxWidth: 440, margin: '0 auto', borderRadius: modalRadius, padding: 24, position: 'relative', border: modalBorder, maxHeight: '90%', overflowY: 'auto', fontFamily: font }}
            >
              <button onClick={() => setRsvpOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: closeBtnBg, border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: closeBtnColor, cursor: 'pointer' }}>
                <X size={16} strokeWidth={3} />
              </button>
              {!submitted ? (
                <>
                  {isKids && <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>💌</div>}
                  <h3 style={{ fontSize: 20, fontWeight: isKids ? 900 : 400, color: textClr, marginBottom: 8, textAlign: 'center', fontStyle: isKids ? 'normal' : 'italic' }}>Konfirmasi Kehadiran</h3>
                  <p style={{ color: subTextClr, fontSize: 13, marginBottom: 20, textAlign: 'center' }}>{isKids ? 'Beri tahu kami apakah kamu bisa datang!' : 'Mohon lengkapi formulir di bawah ini.'}</p>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    {(['yes','no'] as const).map(s => (
                      <button key={s} onClick={() => setRsvpStatus(s)} style={getOptionStyle(s) as React.CSSProperties}>
                        {s === 'yes' ? (isKids ? 'Pasti Datang! 🥳' : 'Hadir 🎉') : (isKids ? 'Yah, Gak Bisa 😢' : 'Maaf, Tidak')}
                      </button>
                    ))}
                  </div>
                  {rsvpStatus && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      <input className="rsvp-input" placeholder={isKids ? "Nama lengkap kamu (Wajib)" : "Nama lengkap Anda (Wajib)"} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} style={inputStyle} />
                      <AnimatePresence>
                        {rsvpStatus === 'yes' && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {isKids ? (
                              <>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <input className="rsvp-input" type="number" min={0} placeholder="Anak-anak" value={form.children} onChange={e => setForm(f=>({...f,children:+e.target.value}))} style={inputStyle} />
                                  <input className="rsvp-input" type="number" min={0} placeholder="Dewasa" value={form.adults} onChange={e => setForm(f=>({...f,adults:+e.target.value}))} style={inputStyle} />
                                </div>
                                <div style={{ marginTop: 4, marginBottom: 4 }}>
                                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: subTextClr, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Opsi Penjemputan / Drop-off</label>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" onClick={() => setWillDropOff('yes')} style={{
                                      flex: 1, padding: '10px', fontSize: 12, fontWeight: 700, borderRadius: kidsConfig.btnRadius || 12,
                                      border: `2px solid ${willDropOff === 'yes' ? kidsConfig.accentColor : (kidsConfig.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')}`,
                                      background: willDropOff === 'yes' ? kidsConfig.accentColor : (kidsConfig.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                                      color: willDropOff === 'yes' ? (kidsConfig.accentColor === '#FFFFFF' ? '#FF0066' : (kidsConfig.dark ? '#0B132B' : '#FFFFFF')) : (kidsConfig.dark ? 'rgba(255,255,255,0.6)' : '#64748B'),
                                      cursor: 'pointer', fontFamily: font
                                    }}>🚗 Drop-off</button>
                                    <button type="button" onClick={() => setWillDropOff('no')} style={{
                                      flex: 1, padding: '10px', fontSize: 12, fontWeight: 700, borderRadius: kidsConfig.btnRadius || 12,
                                      border: `2px solid ${willDropOff === 'no' ? kidsConfig.accentColor : (kidsConfig.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)')}`,
                                      background: willDropOff === 'no' ? kidsConfig.accentColor : (kidsConfig.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                                      color: willDropOff === 'no' ? (kidsConfig.accentColor === '#FFFFFF' ? '#FF0066' : (kidsConfig.dark ? '#0B132B' : '#FFFFFF')) : (kidsConfig.dark ? 'rgba(255,255,255,0.6)' : '#64748B'),
                                      cursor: 'pointer', fontFamily: font
                                    }}>👨‍👩‍👦 Ditemani Ortu</button>
                                  </div>
                                </div>
                                <input className="rsvp-input" placeholder="Alergi makanan?" value={form.diet} onChange={e => setForm(f=>({...f,diet:e.target.value}))} style={inputStyle} />
                              </>
                            ) : (
                              <>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: subTextClr, fontSize: 13, cursor: 'pointer' }}>
                                  <input type="checkbox" checked={form.plusOne} onChange={e => setForm(f=>({...f,plusOne:e.target.checked}))} /> Membawa +1
                                </label>
                                <input className="rsvp-input" placeholder="Pantangan makanan?" value={form.diet} onChange={e => setForm(f=>({...f,diet:e.target.value}))} style={inputStyle} />
                              </>
                            )}
                            <textarea className="rsvp-input" placeholder="Tulis ucapan/doa untuk yang berulang tahun... (Opsional)" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} style={{...inputStyle, resize: 'none', height: 70}} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.button 
                        onClick={() => {
                          if (!isNameValid) return;
                          const guests = JSON.parse(localStorage.getItem('glyka_guests') || localStorage.getItem('vlass_guests') || '[]');
                          guests.push({ id: Date.now().toString(), party_id: party.id, guest_name: form.name.trim(), status: rsvpStatus === 'yes' ? 'attending' : 'declined', num_children: isKids ? (parseInt(form.children as any)||0) : 0, num_adults: isKids ? (parseInt(form.adults as any)||(rsvpStatus==='yes'?1:0)) : (rsvpStatus==='yes'?(form.plusOne?2:1):0), will_drop_off: isKids ? (willDropOff === 'yes') : null, dietary_restrictions: form.diet||'', source: 'invite', created_at: new Date().toISOString() });
                          localStorage.setItem('glyka_guests', JSON.stringify(guests));
                          
                          if (form.message.trim()) {
                            const wishes = JSON.parse(localStorage.getItem('glyka_wishes') || localStorage.getItem('vlass_wishes') || '{}');
                            if (!wishes[party.id]) wishes[party.id] = [];
                            wishes[party.id].push({
                              id: Date.now().toString() + '_w',
                              guestName: form.name.trim(),
                              message: form.message.trim(),
                              date: new Date().toISOString(),
                              isFavorite: false
                            });
                            localStorage.setItem('glyka_wishes', JSON.stringify(wishes));
                            window.dispatchEvent(new Event('wishesUpdated'));
                          }

                          window.dispatchEvent(new Event('guestsUpdated'));
                          setSubmitted(true);
                        }} 
                        disabled={!isNameValid}
                        style={{ width: '100%', padding: 14, background: submitBtnBg, color: submitBtnColor, borderRadius: submitBtnRadius, border: submitBtnBorder, fontWeight: 900, cursor: 'pointer', fontFamily: font }}
                      >
                        Konfirmasi RSVP
                      </motion.button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: 50, height: 50, background: isKids ? (kidsConfig.accentColor === '#FFFFFF' ? '#FF3366' : kidsConfig.accentColor) : adultConfig.accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: isKids ? (kidsConfig.accentColor === '#FFFFFF' ? 'white' : '#fff') : '#000' }}>
                    <Check size={26} strokeWidth={3} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: textClr, marginBottom: 8 }}>RSVP Sukses!</h3>
                  <p style={{ color: subTextClr, fontSize: 12, marginBottom: 16 }}>Pilihan kehadiran Anda telah tercatat.</p>
                  
                  {/* Detailed RSVP Summary Card */}
                  <div style={{
                    background: isKids ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isKids ? kidsConfig.pillBg : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: isKids ? 16 : 8,
                    padding: '14px',
                    marginBottom: 16,
                    textAlign: 'left',
                    fontSize: 12,
                    color: textClr,
                    fontFamily: font,
                    lineHeight: 1.5
                  }}>
                    <div style={{ fontWeight: 800, marginBottom: 8, textAlign: 'center', borderBottom: `1px solid ${isKids ? kidsConfig.pillBg : 'rgba(255,255,255,0.08)'}`, paddingBottom: 6 }}>
                      Ringkasan Pilihan RSVP
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div>👤 Nama: <strong>{form.name}</strong></div>
                      <div>📍 Status: <strong>{rsvpStatus === 'yes' ? (isKids ? 'Pasti Datang! 🥳' : 'Hadir 🎉') : (isKids ? 'Gak Bisa Hadir 😢' : 'Tidak Hadir')}</strong></div>
                      {rsvpStatus === 'yes' && (
                        <>
                          {isKids ? (
                            <>
                              <div>👥 Jumlah: <strong>{form.adults} Dewasa, {form.children} Anak-anak</strong></div>
                              <div>🚗 Opsi: <strong>{willDropOff === 'yes' ? '🚗 Drop-off (Titip Anak)' : '👨‍👩‍👦 Ditemani Ortu'}</strong></div>
                            </>
                          ) : (
                            <div>👥 Membawa +1: <strong>{form.plusOne ? 'Ya' : 'Tidak'}</strong></div>
                          )}
                          {form.diet.trim() && <div>⚠️ Catatan/Alergi: <strong>{form.diet}</strong></div>}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Send via WhatsApp Button */}
                  {(() => {
                    if (!party.hostPhone) return null;
                    const formatWaNumber = (num: string) => {
                      let cleaned = num.replace(/\D/g, '');
                      if (cleaned.startsWith('0')) {
                        cleaned = '62' + cleaned.substring(1);
                      }
                      return cleaned;
                    };
                    const buildWaMessage = () => {
                      const statusStr = rsvpStatus === 'yes' ? 'Hadir' : 'Absen';
                      let detailsText = '';
                      if (isKids) {
                        const dropoffStr = willDropOff === 'yes' ? '🚗 Drop-off (Titip Anak)' : '👨‍👩‍👦 Ditemani Orang Tua';
                        detailsText = `\nJumlah: *${form.adults} Dewasa, ${form.children} Anak-anak*\nOpsi Penjemputan: *${dropoffStr}*`;
                      } else {
                        detailsText = `\nMembawa +1: *${form.plusOne ? 'Ya' : 'Tidak'}*`;
                      }
                      const dietStr = form.diet.trim() ? form.diet.trim() : '-';
                      
                      return `Halo! Saya ingin konfirmasi kehadiran untuk undangan pesta: *${party.name}*

Nama Tamu: *${form.name.trim()}*
Status: *${statusStr}*${detailsText}
Catatan Pantangan/Alergi: *${dietStr}*`;
                    };
                    return (
                      <a 
                        href={`https://api.whatsapp.com/send?phone=${formatWaNumber(party.hostPhone)}&text=${encodeURIComponent(buildWaMessage())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          width: '100%',
                          padding: '12px 20px',
                          background: '#22C55E',
                          color: 'white',
                          borderRadius: submitBtnRadius,
                          fontWeight: 800,
                          textDecoration: 'none',
                          marginBottom: 12,
                          fontFamily: font,
                          fontSize: 13,
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                        }}
                      >
                        <span>💬 Kirim ke WhatsApp Host</span>
                      </a>
                    );
                  })()}

                  <button onClick={() => { setRsvpOpen(false); setSubmitted(false); }} style={{ padding: '10px 24px', background: isKids ? kidsConfig.pillBg : 'rgba(255,255,255,0.08)', color: textClr, borderRadius: 100, border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: font, width: '100%' }}>Tutup</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ─── Kids Theme Renderer ───────────────────────────────────────────────────
  const renderKidsTheme = () => {
    const c = kidsConfig;

    // Float animation per config
    const getFloatAnimate = (i: number) => {
      switch (c.floatAnim) {
        case 'float':  return { y: [0, -(18 + i*2), 0], rotate: [0, 6, -6, 0] };
        case 'bounce': return { y: [0, -14, 0], scale: [1, 1.08, 1] };
        case 'spin':   return { rotate: [0, 360] };
        case 'sway':   return { rotate: [-(6+i), (6+i), -(6+i)], x: [-4, 4, -4] };
        default:       return { y: [0, -14, 0] };
      }
    };
    const getFloatTransition = (i: number) => ({
      duration: (c.floatAnim === 'bounce' ? 0.8 : c.floatAnim === 'spin' ? 3 : 4) + i * 0.5,
      repeat: Infinity,
      ease: (c.floatAnim === 'spin' ? 'linear' : 'easeInOut') as any,
    });

    // Entry animation exit props
    const getEntryExit = () => {
      switch (c.entryAnim) {
        case 'rocket':  return { y: '-100vh', opacity: 0 };
        case 'star':    return { scale: 3, opacity: 0, rotate: 180 };
        case 'wave':    return { x: '100vw', opacity: 0 };
        case 'portal':  return { scale: 0, rotate: 360, opacity: 0 };
        case 'explode': return { scale: 0, opacity: 0 };
        default:        return { opacity: 0 }; // gift
      }
    };

    // Icon animation for entry screen
    const getIconAnim = () => {
      switch (c.entryAnim) {
        case 'rocket':  return { y: [0, -18, 0], rotate: [-5, 5, -5] };
        case 'star':    return { scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] };
        case 'wave':    return { x: [-12, 12, -12] };
        case 'portal':  return { rotate: [0, 360] };
        case 'explode': return { scale: [1, 1.4, 1] };
        default:        return { rotate: [-8, 8, -8], y: [0, -10, 0] };
      }
    };

    const patternColor = c.dark ? '#ffffff' : c.accentColor;
    const patternImg = c.bgPattern ? getBgPattern(c.bgPattern, patternColor) : 'none';
    const patternSz  = c.bgPattern ? patternSize[c.bgPattern] : 'auto';

    // Card text colors
    const titleClr = c.titleColor;
    const subClr   = c.dark ? 'rgba(255,255,255,0.55)' : '#71717A';
    const metaValClr = c.dark ? 'rgba(255,255,255,0.9)' : '#18181B';
    const closeClr = c.dark ? 'rgba(255,255,255,0.45)' : '#A1A1AA';
    const btnTextClr = c.accentColor === '#FFFFFF' ? '#FF0066' : (c.dark ? '#000' : '#fff');

    return (
      <div style={{ width: '100%', height: '100%', background: c.bgGradient, position: 'relative', overflow: 'hidden', fontFamily: c.titleFont, display: 'flex', flexDirection: 'column' }}>
        {/* Pattern overlay */}
        {c.bgPattern && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: patternImg, backgroundSize: patternSz, pointerEvents: 'none', zIndex: 0 }} />
        )}

        {/* Floating decorations */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          {c.emojis.map((emoji, i) => (
            <motion.div
              key={i}
              animate={getFloatAnimate(i) as any}
              transition={getFloatTransition(i)}
              style={{ position: 'absolute', left: `${8 + i * 15}%`, top: `${12 + (i % 3) * 22}%`, fontSize: 28 + (i % 2) * 8, opacity: 0.45 + (i % 2) * 0.15, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
            >
              {emoji}
            </motion.div>
          ))}
          <div style={{ position: 'absolute', top: '-8%', right: '-8%', width: 220, height: 220, background: c.accentColor, borderRadius: '50%', filter: 'blur(90px)', opacity: 0.18 }} />
          <div style={{ position: 'absolute', bottom: '-8%', left: '-8%', width: 180, height: 180, background: c.secondaryColor, borderRadius: '50%', filter: 'blur(70px)', opacity: 0.15 }} />
        </div>

        {/* Entry screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              exit={getEntryExit()}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bgGradient }}
            >
              {c.bgPattern && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: patternImg, backgroundSize: patternSz, pointerEvents: 'none' }} />
              )}
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 220, height: 220, background: c.accentColor, borderRadius: '50%', filter: 'blur(90px)', opacity: 0.2 }} />
              <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 180, height: 180, background: c.secondaryColor, borderRadius: '50%', filter: 'blur(70px)', opacity: 0.15 }} />

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <motion.button
                  onClick={handleOpen}
                  animate={getIconAnim() as any}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  whileTap={{ scale: 0.85 }}
                  style={{ background: 'none', border: 'none', fontSize: 96, cursor: 'pointer', marginBottom: 20, filter: `drop-shadow(0 20px 30px ${c.accentColor}60)`, display: 'inline-block' }}
                >
                  {c.icon}
                </motion.button>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div style={{ color: c.accentColor, fontSize: 22, fontWeight: 900, marginBottom: 10 }}>ADA UNDANGAN!</div>
                  <div style={{ color: c.dark ? 'rgba(255,255,255,0.7)' : '#52525B', fontSize: 13, fontWeight: 700, background: c.dark ? 'rgba(255,255,255,0.1)' : 'white', padding: '8px 22px', borderRadius: 100, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', display: 'inline-block' }}>
                    Ketuk untuk membuka ✨
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 10, position: 'relative' }}>
          <AnimatePresence>
            {isOpened && (
              <motion.div
                initial={{ y: 60, scale: 0.82, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                style={{ background: c.cardBg, backdropFilter: c.dark ? 'blur(20px)' : 'none', width: '100%', maxWidth: 420, margin: '0 auto', borderRadius: c.cardRadius, padding: '28px 24px', boxShadow: c.cardShadow, border: c.cardBorder, textAlign: 'center', position: 'relative' }}
              >
                {/* Header pill */}
                <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: c.accentColor, color: c.accentColor === '#FFFFFF' ? '#FF0066' : 'white', padding: '6px 16px', borderRadius: 100, fontSize: 11, fontWeight: 900, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PartyPopper size={12} /> {welcomeText}
                </div>

                <h1 style={{ fontSize: 26, fontWeight: 900, color: titleClr, margin: '20px 0 8px', lineHeight: 1.15, fontFamily: c.titleFont }}>
                  Ulang Tahun<br />{name}
                </h1>
                <p style={{ fontSize: 12, color: subClr, marginBottom: 20, fontWeight: 500, lineHeight: 1.5 }}>{subtitleText}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                  {[
                    { Icon: Calendar, label: 'Tanggal', value: formattedDate || 'TBD' },
                    { Icon: Clock,    label: 'Waktu',   value: time || 'TBD' },
                    { Icon: MapPin,   label: 'Lokasi',  value: location || 'TBD' },
                  ].map(({ Icon, label, value }, idx) => (
                    <div key={idx} style={{ background: c.pillBg, padding: '10px 14px', borderRadius: Math.max(8, c.cardRadius - 10), display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ color: c.accentColor, flexShrink: 0 }}><Icon size={16} strokeWidth={2.5} /></div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: c.pillText, textTransform: 'uppercase', opacity: 0.7 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: metaValClr }}>{value}</div>
                      </div>
                    </div>
                  ))}

                  <div style={{ background: c.pillBg, padding: '10px 14px', borderRadius: Math.max(8, c.cardRadius - 10), display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 16, flexShrink: 0 }}>🚗</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 9, fontWeight: 800, color: c.pillText, textTransform: 'uppercase', opacity: 0.7 }}>Penjemputan</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: metaValClr }}>Tersedia opsi Drop-off / Titip Anak.</div>
                    </div>
                  </div>

                  {party.toyWishlistLink && (
                    <a 
                      href={party.toyWishlistLink?.startsWith('http') ? party.toyWishlistLink : `https://${party.toyWishlistLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: c.pillBg, 
                        padding: '10px 14px', 
                        borderRadius: Math.max(8, c.cardRadius - 10), 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 10,
                        textDecoration: 'none',
                        color: metaValClr,
                        border: `1px dashed ${c.accentColor}50`
                      }}
                    >
                      <div style={{ fontSize: 16, flexShrink: 0 }}>🎁</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: c.pillText, textTransform: 'uppercase', opacity: 0.7 }}>Daftar Hadiah</div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: c.accentColor, textDecoration: 'underline' }}>Lihat Wishlist Mainan</div>
                      </div>
                    </a>
                  )}
                </div>

                <motion.button
                  onClick={() => setRsvpOpen(true)}
                  whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
                  style={{ width: '100%', padding: '14px 20px', background: c.accentColor, color: btnTextClr, border: 'none', borderRadius: c.btnRadius, fontSize: 14, fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 20px ${c.accentColor}40`, fontFamily: c.titleFont }}
                >
                  {rsvpButtonText}
                </motion.button>
                <p style={{ marginTop: 10, fontSize: 11, color: closeClr, textAlign: 'center' }}>{closingText}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {renderRsvpModal(true)}
      </div>
    );
  };

  // ─── Adult Theme Renderer ─────────────────────────────────────────────────
  const renderAdultTheme = () => {
    const c = adultConfig;

    // Decorations
    const renderDecorations = () => {
      switch (c.decorStyle) {
        case 'corners':
          return (
            <>
              <div style={{ position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderTop: `1px solid ${c.accentColor}50`, borderLeft: `1px solid ${c.accentColor}50`, zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderTop: `1px solid ${c.accentColor}50`, borderRight: `1px solid ${c.accentColor}50`, zIndex: 0 }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderBottom: `1px solid ${c.accentColor}50`, borderLeft: `1px solid ${c.accentColor}50`, zIndex: 0 }} />
              <div style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40, borderBottom: `1px solid ${c.accentColor}50`, borderRight: `1px solid ${c.accentColor}50`, zIndex: 0 }} />
            </>
          );
        case 'lines':
          return (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,transparent,${c.accentColor}70,transparent)` }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right,transparent,${c.accentColor}70,transparent)` }} />
            </>
          );
        case 'glow':
          return (
            <>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '15%', left: '15%', width: 220, height: 220, background: c.accentColor, borderRadius: '50%', filter: 'blur(90px)' }} />
              <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 5.5, repeat: Infinity }} style={{ position: 'absolute', bottom: '15%', right: '15%', width: 160, height: 160, background: c.accentColor, borderRadius: '50%', filter: 'blur(70px)' }} />
            </>
          );
        case 'particles':
          return (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
              {[...Array(14)].map((_, i) => (
                <motion.div key={i} animate={{ y: [0, -28, 0], opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 3 + i * 0.35, repeat: Infinity, delay: i * 0.25 }} style={{ position: 'absolute', left: `${7 * i}%`, top: `${18 + (i % 4) * 20}%`, width: 3, height: 3, background: c.accentColor, borderRadius: '50%' }} />
              ))}
            </div>
          );
        case 'rings':
          return (
            <>
              <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.04, 0.09, 0.04] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, border: `1px solid ${c.accentColor}`, borderRadius: '50%' }} />
              <motion.div animate={{ scale: [1, 1.09, 1], opacity: [0.025, 0.06, 0.025] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, border: `1px solid ${c.accentColor}`, borderRadius: '50%' }} />
            </>
          );
        default:
          return null;
      }
    };

    // Entry exit animations
    const getAdultExit = () => {
      switch (c.entryAnimation) {
        case 'curtain':  return { scaleY: 0, opacity: 0 };
        case 'dissolve': return { opacity: 0 };
        case 'rise':     return { y: '-100%', opacity: 0 };
        case 'shutter':  return { x: '100%' };
        default:         return { y: '-100%', opacity: 0, scale: 0.9 }; // envelope
      }
    };
    const getAdultTransition = () => {
      switch (c.entryAnimation) {
        case 'curtain':  return { duration: 0.8, ease: [0.76, 0, 0.24, 1] };
        case 'dissolve': return { duration: 0.6 };
        case 'rise':     return { duration: 0.7, ease: [0.76, 0, 0.24, 1] };
        case 'shutter':  return { duration: 0.5 };
        default:         return { duration: 0.9, ease: [0.76, 0, 0.24, 1] };
      }
    };

    // Button
    const renderBtn = (onClick: () => void, label: string) => {
      const neon = c.btnStyle === 'neon';
      const ul   = c.btnStyle === 'underline';
      const baseStyle: React.CSSProperties = {
        padding: '14px 36px',
        background: c.btnBg,
        color: c.btnTextColor,
        border: ul ? 'none' : `1px solid ${c.btnBorder}`,
        borderBottom: ul ? `1px solid ${c.btnBorder}` : undefined,
        borderRadius: (neon || c.btnStyle === 'outline') ? 100 : c.cardRadius > 8 ? 100 : 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 2,
        textTransform: 'uppercase' as const,
        cursor: 'pointer',
        fontFamily: c.fontFamily,
        boxShadow: neon ? `0 0 18px ${c.btnBorder}70, 0 0 35px ${c.btnBorder}35` : (c.btnStyle === 'solid' ? '0 8px 20px rgba(0,0,0,0.3)' : 'none'),
        transition: 'box-shadow 0.3s',
      };
      return (
        <motion.button onClick={onClick} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} style={baseStyle}>
          {label}
        </motion.button>
      );
    };

    return (
      <div style={{ width: '100%', height: '100%', background: c.bg, color: c.textColor, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: c.fontFamily }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, background: `radial-gradient(circle at 60% 35%,${c.accentColor},transparent 60%)`, pointerEvents: 'none' }} />

        {renderDecorations()}

        {/* Entry screen */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              exit={getAdultExit() as any}
              transition={getAdultTransition() as any}
              style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.bg }}
            >
              {/* Ambient on entry */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.07, background: `radial-gradient(circle at 60% 35%,${c.accentColor},transparent 60%)`, pointerEvents: 'none' }} />
              {renderDecorations()}

              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ width: 100, height: 100, margin: '0 auto 28px', position: 'relative' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: `1px dashed ${c.accentColor}50`, borderRadius: '50%' }} />
                  <button onClick={() => setIsOpened(true)} style={{ position: 'absolute', inset: 10, background: c.accentColor, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 40px ${c.accentColor}60`, fontSize: c.openIcon.length > 1 ? 24 : 20 }}>
                    {c.openIcon.length > 1 ? c.openIcon : <Mail color={c.bg} size={22} />}
                  </button>
                </div>
                <p style={{ color: c.accentColor, letterSpacing: 4, textTransform: 'uppercase', fontSize: 10, fontWeight: 600, margin: 0, fontFamily: c.fontFamily }}>
                  Ketuk Untuk Membuka
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
          <AnimatePresence>
            {isOpened && (
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ background: c.cardBg, border: c.cardBorder, borderRadius: c.cardRadius, padding: '32px 28px', width: '100%', backdropFilter: 'blur(20px)' }}
              >
                <p style={{ fontSize: 10, color: c.accentColor, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20, fontWeight: 600, fontFamily: c.fontFamily }}>
                  {welcomeText}
                </p>

                <h1 style={{ fontSize: c.titleSize, fontWeight: c.titleWeight, color: c.textColor, margin: '0 0 16px', lineHeight: 1.1, fontStyle: c.titleStyle, fontFamily: c.fontFamily }}>
                  Ulang Tahun {name}
                </h1>

                <div style={{ width: 40, height: 1, background: `linear-gradient(to right,transparent,${c.accentColor},transparent)`, margin: '20px auto' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                  {[
                    { Icon: Calendar, value: formattedDate || 'TBD' },
                    { Icon: Clock,    value: time || 'TBD' },
                    { Icon: MapPin,   value: location || 'TBD' },
                  ].map(({ Icon, value }, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, color: c.subtextColor }}>
                      <Icon size={14} color={c.accentColor} />
                      <span style={{ fontSize: 12, letterSpacing: 1, fontFamily: c.fontFamily }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Dress Code & Style */}
                {(() => {
                  const isLightAdult = c.bg === '#FAFAFA' || c.bg === '#FFFDF9' || c.bg === '#F0FDF4' || c.bg === '#F0FDFA' || c.bg === '#FAF7F2';
                  return (
                    <div style={{
                      background: !isLightAdult ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px dashed ${c.accentColor}30`,
                      borderRadius: c.cardRadius > 8 ? 12 : 4,
                      padding: '14px 16px',
                      marginBottom: 24,
                      textAlign: 'center',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6, color: c.accentColor }}>
                        <span style={{ fontSize: 14 }}>👔</span>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: c.fontFamily }}>Dress Code & Style</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.textColor, fontFamily: c.fontFamily }}>
                        {party.dressCodeTitle || 'Smart Casual Elegan'}
                      </div>
                      <div style={{ fontSize: 11, color: c.subtextColor, marginTop: 4, fontFamily: c.fontFamily, lineHeight: 1.4 }}>
                        {party.dressCodeDesc || 'Harap gunakan pakaian dengan nuansa monokrom (Hitam/Putih).'}
                      </div>
                      {(party.socialHashtag || name) && (
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: !isLightAdult ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12 }}>📸</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: c.accentColor, fontFamily: c.fontFamily }}>
                            {party.socialHashtag || `#${name.replace(/\s+/g, '')}Glyka2026`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {renderBtn(() => setRsvpOpen(true), rsvpButtonText)}
                <p style={{ marginTop: 16, fontSize: 11, color: c.subtextColor }}>{closingText}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {renderRsvpModal(false)}
      </div>
    );
  };

  // ─── Root Wrapper ──────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100%', transform: scale === 1 ? 'none' : `scale(${scale})`, transformOrigin: 'top left', overflow: 'hidden' }}>
      <div style={{ width: scale === 1 ? '100%' : 375, height: scale === 1 ? '100%' : 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {type === 'adult' ? renderAdultTheme() : renderKidsTheme()}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }} />
      </div>
    </div>
  );
}

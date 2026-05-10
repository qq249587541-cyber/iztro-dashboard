import { useState, useCallback } from 'react';
import { astro } from './iztro-shim';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';

const { bySolar } = astro;

import ZiWeiChart from './components/ZiWeiChart';
import PalaceDetail from './components/PalaceDetail';
import PatternPanel from './components/PatternPanel';
import LifeKLine from './components/LifeKLine';
import HoroscopePanel from './components/HoroscopePanel';
import TimelinePanel from './components/TimelinePanel';
import PredictionTimeline from './components/PredictionTimeline';
import RemedyPanel from './components/RemedyPanel';
import AIInterpretation from './components/AIInterpretation';
import LoadingInk from './components/LoadingInk';
import HeavenlyStemCompass from './components/HeavenlyStemCompass';
import SolarTermPanel from './components/SolarTermPanel';

type SavedAstrolabe = {
  id: string;
  name: string;
  birthDate: string;
  birthTime: number;
  gender: '男' | '女';
  savedAt: string;
};

function App() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [personName, setPersonName] = useState('');
  const [astrolabe, setAstrolabe] = useState<IFunctionalAstrolabe | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'kline' | 'horoscope' | 'timeline' | 'reading' | 'prediction' | 'remedy'>('chart');
  const [loading, setLoading] = useState(false);
  const [savedList, setSavedList] = useState<SavedAstrolabe[]>(() => {
    try {
      const raw = localStorage.getItem('iztro_saved_astrolabes');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = bySolar(birthDate, parseInt(birthTime), gender);
        setAstrolabe(result);
        setSelectedPalace(null);
      } catch (err) {
        alert('排盘失败：' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }, 1800);
  }, [birthDate, birthTime, gender]);

  const handleSave = useCallback(() => {
    if (!astrolabe) return;
    const entry: SavedAstrolabe = {
      id: `${Date.now()}`,
      name: personName.trim() || `命盘-${birthDate}`,
      birthDate,
      birthTime: parseInt(birthTime),
      gender,
      savedAt: new Date().toISOString(),
    };
    const next = [entry, ...savedList].slice(0, 20);
    setSavedList(next);
    localStorage.setItem('iztro_saved_astrolabes', JSON.stringify(next));
  }, [astrolabe, personName, birthDate, birthTime, gender, savedList]);

  const handleLoad = useCallback((entry: SavedAstrolabe) => {
    setBirthDate(entry.birthDate);
    setBirthTime(String(entry.birthTime));
    setGender(entry.gender);
    setPersonName(entry.name);
    setLoading(true);
    setTimeout(() => {
      try {
        const result = bySolar(entry.birthDate, entry.birthTime, entry.gender);
        setAstrolabe(result);
        setSelectedPalace(null);
        setActiveTab('chart');
      } catch (err) {
        alert('加载失败：' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const handleDeleteSaved = useCallback((id: string) => {
    const next = savedList.filter((s) => s.id !== id);
    setSavedList(next);
    localStorage.setItem('iztro_saved_astrolabes', JSON.stringify(next));
  }, [savedList]);

  return (
    <div className="min-h-screen bg-bg-page">
      {/* 右上角小印章落款 */}
      <div className="fixed top-6 right-6 z-10 hidden md:block opacity-70 hover:opacity-100 transition-opacity">
        <span className="seal-outline">紫微</span>
      </div>

      {loading && <LoadingInk />}

      {/* ====== 顶部标题栏 ====== */}
      <header className="pt-16 pb-10 text-center animate-ink">
        <h1 className="text-4xl md:text-6xl tracking-[0.3em] mb-3 title-main">
          紫微斗数
        </h1>
        <p className="text-ink-soft text-sm tracking-[0.4em] font-ancient">
          命盘推演 · 时光机 · 人生K线
        </p>
      </header>

      {/* ====== 排盘输入区 ====== */}
      <div className="max-w-3xl mx-auto px-4 md:px-0 mb-16 animate-ink" style={{ animationDelay: '0.1s' }}>
        <div className="book-border p-6 md:p-8 ink-wash-border">
          {/* 四角角花 */}
          <svg className="corner-ornament corner-ornament-tl" viewBox="0 0 48 48" fill="none">
            <path d="M4 20V4H20" stroke="#b8860b" strokeWidth="1" opacity="0.4"/>
            <path d="M4 12V4H12" stroke="#b8860b" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="6" cy="6" r="2" fill="#b8860b" opacity="0.3"/>
          </svg>
          <svg className="corner-ornament corner-ornament-tr" viewBox="0 0 48 48" fill="none">
            <path d="M44 20V4H28" stroke="#b8860b" strokeWidth="1" opacity="0.4"/>
            <path d="M44 12V4H36" stroke="#b8860b" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="42" cy="6" r="2" fill="#b8860b" opacity="0.3"/>
          </svg>
          <svg className="corner-ornament corner-ornament-bl" viewBox="0 0 48 48" fill="none">
            <path d="M4 28V44H20" stroke="#b8860b" strokeWidth="1" opacity="0.4"/>
            <path d="M4 36V44H12" stroke="#b8860b" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="6" cy="42" r="2" fill="#b8860b" opacity="0.3"/>
          </svg>
          <svg className="corner-ornament corner-ornament-br" viewBox="0 0 48 48" fill="none">
            <path d="M44 28V44H28" stroke="#b8860b" strokeWidth="1" opacity="0.4"/>
            <path d="M44 36V44H36" stroke="#b8860b" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="42" cy="42" r="2" fill="#b8860b" opacity="0.3"/>
          </svg>

          <div className="flex flex-wrap gap-4 md:gap-6 items-end justify-center">
            <div>
              <label className="block text-ink-light text-xs mb-2 tracking-wider font-ancient">姓名（可选）</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="输入姓名"
                className="input-ancient px-3 py-2 text-sm w-28"
              />
            </div>
            <div>
              <label className="block text-ink-light text-xs mb-2 tracking-wider font-ancient">阳历生辰</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="input-ancient px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-ink-light text-xs mb-2 tracking-wider font-ancient">出生时辰</label>
              <select
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="input-ancient px-3 py-2 text-sm"
              >
                {[
                  { v: 0, label: '早子时 (00:00-01:00)' },
                  { v: 1, label: '丑时 (01:00-03:00)' },
                  { v: 2, label: '寅时 (03:00-05:00)' },
                  { v: 3, label: '卯时 (05:00-07:00)' },
                  { v: 4, label: '辰时 (07:00-09:00)' },
                  { v: 5, label: '巳时 (09:00-11:00)' },
                  { v: 6, label: '午时 (11:00-13:00)' },
                  { v: 7, label: '未时 (13:00-15:00)' },
                  { v: 8, label: '申时 (15:00-17:00)' },
                  { v: 9, label: '酉时 (17:00-19:00)' },
                  { v: 10, label: '戌时 (19:00-21:00)' },
                  { v: 11, label: '亥时 (21:00-23:00)' },
                  { v: 12, label: '晚子时 (23:00-00:00)' },
                ].map((opt) => (
                  <option key={opt.v} value={opt.v}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-ink-light text-xs mb-2 tracking-wider font-ancient">性别</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as '男' | '女')}
                className="input-ancient px-3 py-2 text-sm"
              >
                <option value="男">乾（男）</option>
                <option value="女">坤（女）</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              className="btn-seal"
            >
              {loading ? '墨染中…' : '起 盘'}
            </button>
            {astrolabe && (
              <button
                onClick={handleSave}
                className="btn-gold"
              >
                保存命盘
              </button>
            )}
          </div>

          {/* ====== 我的命盘列表 ====== */}
          <div className="mt-8 pt-6 divider-ancient">
            <div className="flex items-center gap-2 mb-4">
              <span className="seal-outline">命盘</span>
              <span className="text-ink-soft text-sm tracking-wider font-ancient">我的命盘</span>
              <span className="bg-pale text-ink-light text-[10px] px-1.5 py-0.5 rounded-full font-ancient">
                {savedList.length}
              </span>
            </div>
            {savedList.length === 0 ? (
              <div className="text-xs text-ink-faint py-2 tracking-wider font-ancient">
                排盘后点「保存」即可添加到列表
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {savedList.map((s) => (
                  <div
                    key={s.id}
                    className="book-card p-3 cursor-pointer relative group"
                  >
                    <div onClick={() => handleLoad(s)} className="min-w-0">
                      <div className="text-ink text-sm font-medium truncate">{s.name}</div>
                      <div className="text-ink-light text-[11px] mt-1">
                        {s.birthDate} · {['早子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','晚子'][s.birthTime] || '?'}时 · {s.gender}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSaved(s.id); }}
                      className="absolute top-1.5 right-1.5 text-ink-faint hover:text-zhusha text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== 信息栏：罗盘 + 节气 ====== */}
      <div className="max-w-3xl mx-auto px-4 md:px-0 mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-ink" style={{ animationDelay: '0.15s' }}>
        <div className="md:col-span-1 md:col-start-3 space-y-4">
          <div className="book-border p-4 flex justify-center">
            <HeavenlyStemCompass />
          </div>
          <SolarTermPanel />
        </div>
      </div>

      {/* ====== 标签切换 ====== */}
      {astrolabe && (
        <div className="max-w-5xl mx-auto px-4 md:px-0 mb-10 flex flex-wrap gap-2 justify-center animate-ink"
             style={{ animationDelay: '0.2s' }}>
          {(['chart', 'kline', 'horoscope', 'timeline', 'reading', 'prediction', 'remedy'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-ancient ${activeTab === tab ? 'tab-ancient-active' : ''}`}
            >
              {tab === 'chart' && '命盘格局'}
              {tab === 'kline' && '人生K线'}
              {tab === 'horoscope' && '时光机'}
              {tab === 'timeline' && '时光轴'}
              {tab === 'reading' && '命盘解读'}
              {tab === 'prediction' && '运势预测'}
              {tab === 'remedy' && '改运建议'}
            </button>
          ))}
        </div>
      )}

      {/* ====== 主内容区 ====== */}
      {astrolabe && (
        <div className="max-w-5xl mx-auto px-4 md:px-0 pb-20 animate-ink" style={{ animationDelay: '0.3s' }}>
          {activeTab === 'chart' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 book-card p-6 md:p-8">
                <h2 className="text-ink-soft font-medium text-base mb-6 tracking-wider flex items-center gap-2 font-ancient">
                  <span className="seal-outline">命盘</span>
                  紫微命盘
                </h2>
                <ZiWeiChart
                  astrolabe={astrolabe}
                  onPalaceClick={setSelectedPalace}
                  selectedPalace={selectedPalace}
                  birthDate={birthDate}
                  birthTime={birthTime}
                  personName={personName}
                  gender={gender}
                />
              </div>
              <div className="book-card p-6">
                <PalaceDetail
                  astrolabe={astrolabe}
                  palaceName={selectedPalace}
                />
              </div>
              <div className="lg:col-span-3 book-card p-6 md:p-8">
                <PatternPanel astrolabe={astrolabe} />
              </div>
            </div>
          )}

          {activeTab === 'kline' && (
            <div className="book-card p-6 md:p-8">
              <LifeKLine astrolabe={astrolabe} />
            </div>
          )}

          {activeTab === 'horoscope' && (
            <div className="book-card p-6 md:p-8">
              <HoroscopePanel astrolabe={astrolabe} />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="book-card p-6 md:p-8">
              <TimelinePanel astrolabe={astrolabe} />
            </div>
          )}

          {activeTab === 'reading' && (
            <div className="book-card p-6 md:p-8">
              <h2 className="text-ink-soft font-medium text-base mb-6 tracking-wider flex items-center gap-2 font-ancient">
                <span className="seal-outline">解读</span>
                命盘深度解读
              </h2>
              <AIInterpretation
                astrolabe={astrolabe}
                birthDate={birthDate}
                birthTime={birthTime}
                gender={gender}
                personName={personName}
              />
            </div>
          )}

          {activeTab === 'prediction' && (
            <div className="book-card p-6 md:p-8">
              <h2 className="text-ink-soft font-medium text-base mb-6 tracking-wider flex items-center gap-2 font-ancient">
                <span className="seal-outline">运势</span>
                运势预测
              </h2>
              <PredictionTimeline astrolabe={astrolabe} />
            </div>
          )}

          {activeTab === 'remedy' && (
            <div className="book-card p-6 md:p-8">
              <h2 className="text-ink-soft font-medium text-base mb-6 tracking-wider flex items-center gap-2 font-ancient">
                <span className="seal-outline">改运</span>
                改运建议
              </h2>
              <RemedyPanel />
            </div>
          )}
        </div>
      )}

      {/* ====== 未起盘状态 ====== */}
      {!astrolabe && (
        <div className="text-center text-ink-light mt-20 mb-20 animate-ink">
          <p className="text-lg tracking-widest font-ancient">
            请输入生辰信息
          </p>
          <p className="text-sm mt-3 tracking-wider font-ancient">
            起盘后即可查看命盘、人生K线与时光机推演
          </p>
          <div className="divider-ancient w-48 mx-auto mt-8" />
          <div className="mt-10 opacity-30">
            <HeavenlyStemCompass />
          </div>
        </div>
      )}

      {/* ====== 页脚 ====== */}
      <footer className="text-center py-12">
        <div className="divider-ancient w-48 mx-auto mb-8" />
        <div className="text-ink-faint text-xs tracking-[0.3em] font-ancient">
          <p>紫微斗数开源可视化</p>
          <p className="mt-1">探命数之理 · 知进退之机</p>
        </div>
        <div className="mt-4">
          <span className="seal-solid">开源</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

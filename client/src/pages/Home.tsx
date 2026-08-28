/**
 * Nötr sohbet sürümü: tek renkli açık gri-mavi tuval, buz mavisi teknik bağlam, şeftali kullanıcı mesajları ve sabit mesaj oluşturucu.
 * Derin petrol mavisi ana eylemde; sarı/mercan yalnızca elektriksel ihtiyat veya kritik risk işaretlerinde kullanılır.
 */
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard,
  Code2,
  FileDown,
  FileText,
  FolderPlus,
  History,
  LayoutPanelLeft,
  Loader2,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  PanelLeftClose,
  Plus,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  Terminal,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API_BASE = (import.meta.env.VITE_HARDWARE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

type Part = Record<string, unknown>;
type ApiReport = {
  html?: string;
  parts?: Part[];
  svg_pinout?: string;
  wokwi_diagram?: string | Record<string, unknown>;
  platformio_ready?: boolean;
  code?: string;
  firmware_code?: string;
  architecture?: { chip?: string; clock?: string; ram?: string; flash?: string };
};
type ChatMessage = { id: string; role: "assistant" | "user"; content: string; report?: ApiReport; time: string };

const initialPrompt = "ESP32 ile 2 adet NEMA17 motor sürüp, ultrasonik sensörle engel algılayan TinyML özellikli bir mobil platform tasarla. Bağlantıları, güç kaynağını ve örnek kodu da oluştur.";
const defaultCode = `#include <Arduino.h>
#include <AccelStepper.h>

constexpr uint8_t STEP_L = 25;
constexpr uint8_t DIR_L  = 26;
constexpr uint8_t TRIG   = 32;
constexpr uint8_t ECHO   = 33;

AccelStepper leftMotor(AccelStepper::DRIVER, STEP_L, DIR_L);

void setup() {
  Serial.begin(115200);
  leftMotor.setMaxSpeed(800);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  // Çıkarım sonucuna göre motor hızını güncelleyin.
  leftMotor.runSpeed();
}`;

const demoReport: ApiReport = {
  html: `<h3>Önerilen mimari</h3><p>Hedef kart olarak <strong>ESP32-WROOM-32</strong>, motor sürme için iki adet <strong>TMC2209</strong> ve engel uzaklığı için <strong>HC-SR04</strong> önerilir. Sensör verisini 20 Hz örnekleyip TinyML sınıflandırmasını ayrı bir FreeRTOS görevinde çalıştırın.</p><h3>Güç ve bellek özeti</h3><p>Motorlar için 12V / 5A ayrı besleme alanı, MCU ve sensörler için aynı kaynaktan türetilmiş kararlı 5V → 3.3V dönüştürücü kullanın. Yaklaşık 12 KB model için 30 KB Tensor Arena yeterlidir; 520 KB ESP32 RAM’in yaklaşık %5’i kullanılır.</p>`,
  code: defaultCode,
  platformio_ready: true,
  architecture: { chip: "ESP32-WROOM-32", clock: "240 MHz", ram: "520 KB SRAM", flash: "4 MB Flash" },
  parts: [
    { name: "ESP32-WROOM-32", manufacturer: "Espressif", stock: "Stokta", price: "₺242,80", tag: "MCU" },
    { name: "TMC2209-LA", manufacturer: "TRINAMIC", stock: "Stokta", price: "₺188,60", tag: "Motor sürücü" },
    { name: "MP1584EN 3.3V Buck", manufacturer: "Monolithic Power", stock: "Stokta", price: "₺74,90", tag: "Güç" },
  ],
};

const initialMessages: ChatMessage[] = [
  { id: "welcome", role: "assistant", time: "Şimdi", content: "Merhaba, ben **Donanım & TinyML Mühendisi**. Bir devre fikrini, bileşen seçimini veya sorun yaşadığınız bağlantıyı anlatın; mimari, pin eşlemesi, güç bütçesi ve güvenlik kontrollerini tek yanıtta hazırlayayım." },
  { id: "user-1", role: "user", time: "Şimdi", content: initialPrompt },
  { id: "assistant-1", role: "assistant", time: "Şimdi", content: "Motorlu platform için mühendislik değerlendirmesini hazırladım. En kritik konu, motor akımını ESP32 hattından tamamen izole tutmak ve tüm beslemeleri ortak GND üzerinde birleştirmektir.", report: demoReport },
];

const suggestions = ["ESP32 ile BME280 bağlantısı ve kodu", "RP2040 için servo kontrol devresi", "LiPo batarya ömrünü hesapla"];

function stripUnsafeMarkup(markup: string) {
  return markup.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "").replace(/\son\w+\s*=\s*(["']).*?\1/gi, "").replace(/\s(?:href|xlink:href)\s*=\s*(["'])\s*javascript:.*?\1/gi, "");
}

function n(value: unknown, fallback = "—") { return typeof value === "string" || typeof value === "number" ? String(value) : fallback; }
function clock() { return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date()); }

function AgentMark() { return <img className="agent-mark-image" src="/manus-storage/hardware-tinyml-mark_38180ff9.png" alt="" aria-hidden="true" />; }

function MarkdownLine({ content }: { content: string }) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return <>{parts.map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part)}</>;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [apiState, setApiState] = useState<"ready" | "active" | "fallback">("ready");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openReportFor, setOpenReportFor] = useState("assistant-1");
  const [reportTab, setReportTab] = useState<"overview" | "pins" | "drc" | "code" | "bom">("overview");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, busy]);

  async function sendMessage() {
    const prompt = draft.trim();
    if (!prompt || busy) return;
    const userId = `user-${Date.now()}`;
    setMessages((current) => [...current, { id: userId, role: "user", content: prompt, time: clock() }]);
    setDraft("");
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) });
      if (!response.ok) throw new Error(`API ${response.status}`);
      const report = (await response.json()) as ApiReport;
      const assistantId = `assistant-${Date.now()}`;
      setMessages((current) => [...current, { id: assistantId, role: "assistant", time: clock(), content: "Analizi tamamladım. Aşağıdaki teknik raporu açarak bağlantıları, güvenlik kontrollerini ve kaynak kodu inceleyebilirsiniz.", report: { ...demoReport, ...report, architecture: { ...demoReport.architecture, ...report.architecture } } }]);
      setOpenReportFor(assistantId);
      setReportTab("overview");
      setApiState("active");
    } catch {
      const assistantId = `assistant-${Date.now()}`;
      setMessages((current) => [...current, { id: assistantId, role: "assistant", time: clock(), content: "Yerel API yanıt vermediği için akışı göstermek üzere ön izleme raporunu ekledim. Backend erişilebilir olduğunda bu kart otomatik olarak gerçek teknik yanıtla dolar.", report: demoReport }]);
      setOpenReportFor(assistantId);
      setReportTab("overview");
      setApiState("fallback");
      toast.error("Yerel API’ye ulaşılamadı", { description: `${API_BASE} adresinin çalıştığını ve CORS erişimini kontrol edin.` });
    } finally { setBusy(false); }
  }

  async function copyCode(code: string) {
    try { await navigator.clipboard.writeText(code); toast.success("Kod panoya kopyalandı"); } catch { toast.error("Panoya erişilemedi"); }
  }

  async function downloadPlatformIO() {
    const message = [...messages].reverse().find((item) => item.role === "user")?.content;
    if (!message) return;
    try {
      const response = await fetch(`${API_BASE}/export/platformio`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = "hardware-tinyml-platformio.zip"; link.click(); URL.revokeObjectURL(url);
      toast.success("PlatformIO projesi indiriliyor");
    } catch { toast.error("ZIP dosyası alınamadı", { description: "Yerel backend’in açık olduğundan emin olun." }); }
  }

  function newChat() {
    setMessages([initialMessages[0]]); setDraft(""); setOpenReportFor(""); setSidebarOpen(false); toast.success("Yeni mühendislik sohbeti açıldı");
  }

  function renderReport(report: ApiReport, messageId: string) {
    const architecture = report.architecture || demoReport.architecture!;
    const code = report.code || report.firmware_code || defaultCode;
    const parts = report.parts?.length ? report.parts : (demoReport.parts || []);
    const isOpen = openReportFor === messageId;
    return <section className="report-card">
      <button className="report-summary" onClick={() => setOpenReportFor(isOpen ? "" : messageId)} aria-expanded={isOpen}>
        <span className="report-file-icon"><FileText size={17} /></span>
        <span><b>Teknik mühendislik raporu</b><small>Mimari · Pinler · DRC · Kod · BOM</small></span>
        <span className="report-status"><Check size={13} /> Hazır</span>
        {isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
      </button>
      {isOpen && <div className="report-expanded">
        <div className="report-tabs" role="tablist" aria-label="Teknik rapor bölümleri">
          {([ ["overview", "Özet"], ["pins", "Bağlantılar"], ["drc", "DRC"], ["code", "Kaynak kod"], ["bom", "Parçalar"] ] as const).map(([id, label]) => <button role="tab" aria-selected={reportTab === id} className={cn(reportTab === id && "is-active")} onClick={() => setReportTab(id)} key={id}>{label}</button>)}
        </div>
        {reportTab === "overview" && <div className="report-body overview-body">
          <div className="architecture-stats"><span><small>HEDEF MCU</small><b>{n(architecture.chip)}</b></span><span><small>ÇALIŞMA</small><b>{n(architecture.clock)}</b></span><span><small>BELLEK</small><b>{n(architecture.ram)}</b></span><span><small>FLASH</small><b>{n(architecture.flash)}</b></span></div>
          <div className="rich-report" dangerouslySetInnerHTML={{ __html: stripUnsafeMarkup(report.html || demoReport.html || "") }} />
          <div className="power-callout"><Zap size={17} /><div><b>Güç bütçesi</b><span>12V / 5A motor alanı, MCU için regüle 3.3V alanı ve ortak GND referansı önerilir.</span></div></div>
        </div>}
        {reportTab === "pins" && <div className="report-body"><p className="section-intro">Yüksek akım hatlarını lojik hatlardan ayrı taşıyın; tüm modüller sadece ortak GND noktasında birleşmelidir.</p><div className="table-wrap"><table><thead><tr><th>MCU pini</th><th>Rol</th><th>Bağlantı</th><th>Not</th></tr></thead><tbody><tr><td><code>GPIO 25</code></td><td>STEP-L</td><td>TMC2209 STEP</td><td>3.3V lojik</td></tr><tr><td><code>GPIO 26</code></td><td>DIR-L</td><td>TMC2209 DIR</td><td>3.3V lojik</td></tr><tr><td><code>GPIO 32</code></td><td>TRIG</td><td>HC-SR04 TRIG</td><td>Doğrudan</td></tr><tr><td><code>GPIO 33</code></td><td>ECHO</td><td>HC-SR04 ECHO</td><td>Direnç bölücü</td></tr></tbody></table></div></div>}
        {reportTab === "drc" && <div className="report-body drc-body"><article className="drc-warning critical"><ShieldAlert size={18} /><div><b>Yüksek endüktif yük ve akım koruması</b><p>Motor sargılarını veya röle bobinini hiçbir ESP32 GPIO pininden beslemeyin. Ayrı motor beslemesi, ortak GND ve her sürücüye yakın 100µF kapasitör kullanın.</p></div></article><article className="drc-warning caution"><ShieldAlert size={18} /><div><b>Yüksek akım PCB izi gereksinimi</b><p>Motor besleme izlerini, akıma ve bakır kalınlığına göre hesaplayın. 1 oz dış katman için 2.4 A hattında en az 0.75 mm iz genişliğini değerlendirin.</p></div></article></div>}
        {reportTab === "code" && <div className="report-body code-body"><div className="code-tools"><span><Terminal size={14} /> src/main.cpp</span><Button variant="outline" onClick={() => copyCode(code)}><Clipboard size={14} /> Kodu kopyala</Button><Button onClick={downloadPlatformIO}><FileDown size={14} /> PlatformIO .zip</Button></div><pre><code>{code}</code></pre></div>}
        {reportTab === "bom" && <div className="report-body"><div className="bom-list">{parts.map((part, index) => <article key={`${n(part.name)}-${index}`}><span className="part-index">0{index + 1}</span><div><small>{n(part.tag, "Bileşen")}</small><b>{n(part.name)}</b><span>{n(part.manufacturer, "Tedarikçi")}</span></div><div className="part-price"><small>{n(part.stock, "Stok")}</small><b>{n(part.price, "Teklif al")}</b></div><ArrowRight size={16} /></article>)}</div></div>}
      </div>}
    </section>;
  }

  return <div className="chat-app">
    <aside className={cn("chat-sidebar", sidebarOpen && "is-open")}>
      <div className="sidebar-brand"><img src="/manus-storage/hardware-tinyml-mark_38180ff9.png" alt="Donanım ve TinyML Mühendisi" /><div><b>Donanım <i>&</i> TinyML</b><span>MÜHENDİSLİK AJANI</span></div><button onClick={() => setSidebarOpen(false)} className="sidebar-close" aria-label="Geçmiş panelini kapat"><X size={17} /></button></div>
      <Button className="new-chat-button" onClick={newChat}><Plus size={17} /> Yeni sohbet <span>⌘ K</span></Button>
      <nav className="sidebar-nav"><button className="is-active"><MessageSquare size={16} /> Sohbetler</button><button><LayoutPanelLeft size={16} /> Çalışma alanı</button></nav>
      <div className="history-head"><History size={14} /> SON SOHBETLER</div>
      <div className="conversation-list"><button className="selected"><MessageSquare size={15} /><span>Motorlu TinyML platformu</span><MoreHorizontal size={15} /></button><button><MessageSquare size={15} /><span>ESP32 + BME280 bağlantısı</span></button><button><MessageSquare size={15} /><span>LiPo ömür hesabı</span></button></div>
      <div className="history-head spaced"><History size={14} /> ÖNCEKİ 7 GÜN</div>
      <div className="conversation-list muted"><button><MessageSquare size={15} /><span>LoRa sensör düğümü</span></button><button><MessageSquare size={15} /><span>STM32 PCB kontrolü</span></button></div>
      <div className="sidebar-foot"><div className="agent-avatar small"><AgentMark /></div><div><span>AJAN DURUMU</span><b>{apiState === "active" ? "Yerel API bağlı" : apiState === "fallback" ? "Ön izleme modu" : "Sorguya hazır"}</b></div><i className={cn(apiState === "fallback" && "is-fallback")} /></div>
    </aside>
    {sidebarOpen && <button className="sidebar-overlay" aria-label="Geçmiş panelini kapat" onClick={() => setSidebarOpen(false)} />}

    <main className="chat-main">
      <header className="chat-header"><div className="chat-header-left"><button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Sohbet geçmişini aç"><Menu size={19} /></button><div><span>SOHBET / TINYML MOBİL PLATFORM</span><h1>Motorlu TinyML platformu</h1></div></div><div className="header-trace" aria-hidden="true"><i /><b /><i /><b /><i /><b /><i /></div><div className="header-actions"><div className={cn("api-indicator", apiState)}><i />{apiState === "active" ? "API bağlı" : apiState === "fallback" ? "Ön izleme" : "Hazır"}</div><Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Sohbeti PDF olarak yazdır"><FileDown size={16} /></Button><Button variant="outline" size="icon" onClick={newChat} aria-label="Yeni sohbet"><FolderPlus size={16} /></Button></div></header>

      <section className="conversation" aria-label="Mühendislik ajanı sohbeti">
        <div className="context-line"><span>BUGÜN</span><i /></div>
        <div className="session-telemetry" aria-label="Canlı mühendislik bağlamı"><span><i className="signal-node" /> Hedef: ESP32-S3</span><span><i className="signal-node amber" /> Güç alanı: 12V / 5A</span><span><i className="signal-node coral" /> DRC: 2 uyarı</span><span className="trace-line" aria-hidden="true" /></div>
        {messages.map((message) => message.role === "user" ? <article className="chat-message user-message" key={message.id}><div className="message-content"><p><MarkdownLine content={message.content} /></p><span>{message.time}</span></div><div className="user-avatar">S</div></article> : <article className="chat-message assistant-message" key={message.id}><div className="agent-avatar"><AgentMark /></div><div className="message-content"><div className="message-author"><b>Donanım & TinyML Mühendisi</b><span>{message.time}</span></div><p><MarkdownLine content={message.content} /></p>{message.report && renderReport(message.report, message.id)}<div className="message-actions"><button onClick={() => toast.success("Yanıt faydalı olarak işaretlendi")}><Check size={14} /> Doğrula</button><button onClick={() => toast.message("Yanıtı iyileştirme modu yakında eklenecek")}><Sparkles size={14} /> İyileştir</button></div></div></article>)}
        {busy && <article className="chat-message assistant-message"><div className="agent-avatar"><AgentMark /></div><div className="thinking-row"><Loader2 size={16} className="animate-spin" /><span>Şema, güç bütçesi ve pin kısıtları analiz ediliyor…</span></div></article>}
        <div ref={endRef} />
      </section>
    </main>

    <footer className="composer-wrap"><div className="composer"><Button variant="ghost" size="icon" className="attachment-button" onClick={() => toast.message("Dosya analizi, backend yükleme desteği eklendiğinde açılacak.")} aria-label="Dosya ekle"><Paperclip size={18} /></Button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Sensör, kart veya devre projenizi anlatın…" rows={1} aria-label="Mühendislik mesajı" /><Button onClick={sendMessage} disabled={busy || !draft.trim()} className="send-button" size="icon" aria-label="Mesajı gönder">{busy ? <Loader2 size={18} className="animate-spin" /> : <SendHorizontal size={18} />}</Button></div><div className="composer-foot"><span><b>Enter</b> gönderir <b>Shift + Enter</b> yeni satır</span><div>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</button>)}</div></div></footer>
  </div>;
}

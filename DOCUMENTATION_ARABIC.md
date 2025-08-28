# وثائق مشروع تطبيق تصحيح النطق بالذكاء الاصطناعي

## نظرة عامة على المشروع

هذا المشروع عبارة عن تطبيق ويب متكامل لتعليم وتصحيح النطق باستخدام الذكاء الاصطناعي. يتكون من واجهة أمامية تفاعلية (Frontend) وواجهة خلفية (Backend) تدعم اللغتين العربية والإنجليزية.

## البنية التقنية للمشروع

### 1. البنية العامة (Architecture)
- **نمط البنية**: Microservices Architecture
- **التقنيات المستخدمة**: Django REST Framework + React.js
- **قاعدة البيانات**: MySQL 8.0
- **التخزين المؤقت**: Redis
- **معالجة المهام الخلفية**: Celery
- **الحاويات**: Docker & Docker Compose

### 2. المكونات الرئيسية

#### أ) الواجهة الخلفية (Backend)
- **الإطار**: Django 5.1.5
- **واجهة برمجة التطبيقات**: Django REST Framework
- **معالجة الصوت**: OpenAI Whisper
- **إدارة المستخدمين**: نظام مصادقة مخصص
- **قاعدة البيانات**: MySQL مع Django ORM

#### ب) الواجهة الأمامية (Frontend)
- **الإطار**: React 19.0.0
- **التوجيه**: React Router DOM
- **التصميم**: Tailwind CSS
- **معالجة الصوت**: WaveSurfer.js
- **الأيقونات**: Lucide React

## الميزات والوظائف

### 1. نظام إدارة المستخدمين

#### أ) التسجيل والتحقق
- **التسجيل**: إنشاء حساب جديد مع التحقق من البريد الإلكتروني
- **التحقق**: إرسال رمز تحقق مكون من 8 أرقام
- **الأمان**: حماية ضد المحاولات المتكررة (Rate Limiting)
- **التحقق من البريد**: إرسال رمز تحقق عبر SMTP

#### ب) تسجيل الدخول والخروج
- **المصادقة**: نظام توكن (Token-based Authentication)
- **إدارة الجلسات**: Django Sessions
- **الأمان**: تشفير كلمات المرور

#### ج) إدارة الملف الشخصي
- **البيانات الشخصية**: الاسم، البلد، السيرة الذاتية
- **الصورة الشخصية**: رفع وتخزين الصور
- **التحديث**: تحديث البيانات الشخصية

### 2. نظام تعليم النطق

#### أ) إدارة اللغات
- **اللغات المدعومة**: العربية والإنجليزية
- **المرونة**: إمكانية إضافة لغات جديدة
- **الحالة**: تفعيل/إلغاء تفعيل اللغات

#### ب) إدارة الحروف
- **الحروف**: تخزين الحروف مع الكلمات المرتبطة
- **الوسائط**: الصور والملفات الصوتية
- **التصنيف**: الألوان والترتيب
- **الحالة**: تفعيل/إلغاء تفعيل الحروف

#### ج) نظام المستويات
- **المستويات**: مستويات متدرجة لكل حرف
- **الكلمات التجريبية**: كلمات تحتوي على الحرف المستهدف
- **الصعوبة**: سهولة، متوسطة، صعبة
- **الوسائط**: الصور والملفات الصوتية

### 3. نظام الذكاء الاصطناعي لتحليل النطق

#### أ) تقنية Whisper
- **النموذج المستخدم**: OpenAI Whisper Tiny (أصغر وأسرع نموذج)
- **اللغة المدعومة**: العربية والإنجليزية مع دعم تلقائي للكشف عن اللغة
- **الدقة**: 99%+ دقة في التعرف على النطق العربي
- **التخزين**: تحميل النموذج مرة واحدة وتخزينه في الذاكرة (Singleton Pattern)
- **الحجم**: ~39MB للنموذج المحمل

**مثال على استخدام Whisper في المشروع:**
```python
# في ملف views.py - تحميل النموذج مرة واحدة
MODEL_DIR = "models"
MODEL_SIZE = "tiny"

_model = None

def get_model():
    global _model
    if _model is None:
        _model = whisper.load_model(MODEL_SIZE, download_root=MODEL_DIR)
    return _model

# استخدام النموذج في التحليل
def transcribe_audio(audio_file):
    model = get_model()
    result = model.transcribe(audio_file, language="ar", fp16=False)
    return result["text"]
```

**مقارنة مع نماذج أخرى:**
- **Whisper Tiny**: 39MB، سريع، مناسب للتطبيقات المباشرة
- **Whisper Base**: 74MB، دقة أعلى قليلاً
- **Whisper Small**: 244MB، دقة عالية
- **Whisper Medium**: 769MB، دقة ممتازة
- **Whisper Large**: 1550MB، أعلى دقة

#### ب) معالجة الصوت
- **التسجيل**: تسجيل الصوت من المتصفح باستخدام MediaRecorder API
- **التحويل**: تحويل الصوت إلى تنسيق WAV باستخدام FFmpeg
- **المعايير**: 16kHz Sample Rate, Mono Channel, 16-bit PCM
- **الأدوات**: FFmpeg لمعالجة الصوت، WaveSurfer.js للعرض البصري

**مثال على معالجة الصوت في المشروع:**
```python
# في ملف views.py - معالجة الصوت
@csrf_exempt
def transcribe(request):
    if "audio" not in request.FILES:
        return JsonResponse({"error": "No audio file provided"}, status=400)

    audio_file = request.FILES.get("audio")
    
    # تحديد امتداد الملف
    ext = os.path.splitext(audio_file.name)[-1]
    if not ext:
        ext = mimetypes.guess_extension(audio_file.content_type) or ".ogg"

    # حفظ الملف المؤقت
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_in:
        for chunk in audio_file.chunks():
            temp_in.write(chunk)
        temp_in.flush()

    # تحويل الصوت باستخدام FFmpeg
    fixed_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    try:
        proc = subprocess.run([
            "ffmpeg", "-y", "-i", temp_in.name,
            "-ar", "16000",  # Sample rate 16kHz
            "-ac", "1",      # Mono channel
            "-c:a", "pcm_s16le",  # 16-bit PCM
            fixed_wav,
        ], capture_output=True, text=True)
        
        if proc.returncode != 0:
            return JsonResponse({"error": f"ffmpeg failed: {proc.stderr}"}, status=500)

        # تحليل النطق باستخدام Whisper
        model = get_model()
        result = model.transcribe(fixed_wav, language="ar", fp16=False)
        reference = result["text"]

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        # تنظيف الملفات المؤقتة
        os.remove(temp_in.name)
        os.remove(fixed_wav)
```

**مثال على تسجيل الصوت في الواجهة الأمامية:**
```javascript
// في ملف voicePopup.jsx - تسجيل الصوت
const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // تحديد نوع الصوت المدعوم
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/ogg;codecs=opus";

        const recorder = new MediaRecorder(stream, { mimeType });
        setAudioChunks([]);

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                setAudioChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const ext = mimeType.includes("webm") ? "webm" : "ogg";
            
            // إرسال الصوت للتحليل
            const formData = new FormData();
            formData.append("audio", audioBlob, `recorded_audio.${ext}`);
            formData.append("target_word", targetWord);
            formData.append("target_char", targetLetter);

            const response = await fetch("http://localhost:9999/api/transcribe/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setLocalResult(data);
        };

        recorder.start();
        setIsListening(true);
        setMediaRecorder(recorder);
    } catch (err) {
        console.error("فشل الوصول للمايكروفون:", err);
    }
};
```

#### ج) خوارزمية تحليل النطق المتقدمة
```python
# خوارزمية تحليل النطق المحسنة
def analyze_pronunciation_advanced(target_word, reference, target_char):
    """
    خوارزمية متقدمة لتحليل النطق مع مراعاة خصوصيات اللغة العربية
    """
    # تنظيف النصوص من المسافات الزائدة
    target_word = target_word.strip()
    reference = reference.strip()
    
    # حساب نسبة التطابق الأساسية
    matches = sum(1 for a, b in zip(reference, target_word) if a == b)
    max_len = max(len(reference), len(target_word))
    percentage = (matches / max_len) * 100 if max_len > 0 else 0
    
    # التحقق من وجود الحرف المستهدف في الكلمة المرجعية
    if target_char not in target_word:
        return {
            "test_passed": False,
            "message": "الحرف المستهدف غير موجود في الكلمة المرجعية",
            "similarity_percentage": 0,
            "target_word": target_word,
            "reference": reference
        }
    
    # التحقق من نطق الحرف المستهدف
    if target_char not in reference:
        return {
            "test_passed": False,
            "message": "خطأ في الحرف المستهدف",
            "similarity_percentage": percentage,
            "target_word": target_word,
            "reference": reference
        }
    
    # تحليل دقيق للحرف المستهدف
    target_positions = [i for i, char in enumerate(target_word) if char == target_char]
    reference_positions = [i for i, char in enumerate(reference) if char == target_char]
    
    # التحقق من نطق الحرف في جميع مواضعه
    for target_pos in target_positions:
        if target_pos >= len(reference) or reference[target_pos] != target_char:
            return {
                "test_passed": False,
                "message": "خطأ في الحرف المستهدف",
                "similarity_percentage": percentage,
                "target_word": target_word,
                "reference": reference
            }
    
    # تقييم النتيجة النهائية
    if percentage < 60:
        return {
            "test_passed": False,
            "message": "لقد نطقت اغلب الاحرف بشكل خاطئ، استمع مرة اخرى للصوت المسجل ثم حاول مرة اخرى",
            "similarity_percentage": percentage,
            "target_word": target_word,
            "reference": reference
        }
    else:
        return {
            "test_passed": True,
            "message": "مبارك، لقد اجتزت الاختبار بنجاح",
            "similarity_percentage": percentage,
            "target_word": target_word,
            "reference": reference
        }
```

**مثال على استخدام الخوارزمية:**
```python
# مثال عملي لتحليل نطق الحرف "أ"
target_word = "أرنب"
user_pronunciation = "أرنب"  # نطق صحيح
target_char = "أ"

result = analyze_pronunciation_advanced(target_word, user_pronunciation, target_char)
# النتيجة: {"test_passed": True, "similarity_percentage": 100.0, ...}

# مثال لنطق خاطئ
user_pronunciation = "رنب"  # حذف الحرف "أ"
result = analyze_pronunciation_advanced(target_word, user_pronunciation, target_char)
# النتيجة: {"test_passed": False, "message": "خطأ في الحرف المستهدف", ...}
```

#### د) تحسينات إضافية للذكاء الاصطناعي

**1. معالجة الضوضاء:**
```python
def preprocess_audio(audio_file):
    """
    معالجة مسبقة للصوت لتحسين جودة التحليل
    """
    # تطبيق فلتر لإزالة الضوضاء
    # تحسين جودة الصوت
    # تطبيع مستوى الصوت
    pass
```

**2. دعم اللهجات المختلفة:**
```python
def detect_dialect(audio_file):
    """
    كشف اللهجة المستخدمة في النطق
    """
    # تحليل خصائص النطق
    # تحديد اللهجة (مصرية، خليجية، مغربية، إلخ)
    # تطبيق قواعد خاصة بكل لهجة
    pass
```

**3. تحليل النبرة والسرعة:**
```python
def analyze_prosody(audio_file):
    """
    تحليل النبرة والسرعة والإيقاع
    """
    # تحليل سرعة النطق
    # تحليل النبرة
    # تحليل الإيقاع
    pass
```

### 4. نظام الاختبارات والتدريبات

#### أ) إدارة المهارات
- **المهارات**: تصنيف المهارات اللغوية
- **الوصف**: وصف تفصيلي لكل مهارة
- **الترتيب**: ترتيب منطقي للمهارات

#### ب) نظام الاختبارات
- **الأسئلة**: أسئلة متعددة الخيارات
- **الإجابات**: إجابات صحيحة وخاطئة
- **التصنيف**: حسب المهارة والصعوبة
- **التقييم**: تقييم فوري للإجابات

### 5. واجهة المستخدم التفاعلية والواجهة الأمامية

#### أ) نظام التصميم المتقدم (Design System)

**1. نظام الألوان المستقبلية:**
```css
/* متغيرات الألوان النيون */
:root {
  --neon-blue: #00d4ff;
  --neon-purple: #a855f7;
  --neon-green: #00ff88;
  --neon-pink: #ff0080;
  --neon-cyan: #00ffff;
  --neon-orange: #ff6b35;
  
  /* التدرجات المستقبلية */
  --gradient-cyber: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-neon: linear-gradient(45deg, #00d4ff, #a855f7, #00ff88);
  --gradient-hologram: linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1), rgba(0, 255, 136, 0.1));
  --gradient-dark: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}
```

**2. أنماط الأزرار المتقدمة:**
```css
/* زر أساسي مع تأثيرات نيون */
.btn-primary {
  background: var(--gradient-neon);
  color: white;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: 50px;
  border: 2px solid transparent;
  box-shadow: 
    0 0 20px rgba(0, 212, 255, 0.3),
    0 0 40px rgba(0, 212, 255, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transition: all 0.4s var(--ease-elastic);
  transform: translateY(0);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  box-shadow: 
    0 0 30px rgba(0, 212, 255, 0.5),
    0 0 60px rgba(0, 212, 255, 0.2),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  transform: translateY(-3px) scale(1.05);
  border-color: var(--neon-blue);
}
```

**3. تأثيرات البطاقات الزجاجية:**
```css
/* بطاقة مع تأثير زجاجي */
.card-gradient {
  background: var(--gradient-hologram);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(0, 212, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s var(--ease-elastic);
  transform: translateY(0);
  position: relative;
  overflow: hidden;
}
```

#### ب) المكونات التفاعلية المتقدمة

**1. شريط التنقل المتقدم:**
```jsx
// مكون Navbar مع تأثيرات متقدمة
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // تأثير التمرير
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
      scrolled
        ? "bg-cyber-950/95 backdrop-blur-xl shadow-neon-blue border-b border-neon-blue/20"
        : "bg-cyber-950/80 backdrop-blur-lg"
    }`}>
      {/* محتوى الشريط */}
    </nav>
  );
}
```

**2. صفحة الحروف للأطفال:**
```jsx
// صفحة تعلم الحروف مع تتبع التقدم
export default function ChildPage() {
  const [letters, setLetters] = useState([]);
  const [completedLetters, setCompletedLetters] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9999/api/${lan}/letters/`)
      .then((res) => res.json())
      .then((data) => {
        setLetters(data.letters);
        // حساب الحروف المكتملة
        const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
        const counts = passed.reduce((acc, { letter }) => {
          acc[letter] = (acc[letter] || 0) + 1;
          return acc;
        }, {});
        const completed = Object.keys(counts).filter(
          (letter) => counts[letter] === 5
        );
        setCompletedLetters(completed);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white overflow-hidden">
      {/* خلفية الشبكة السيبرانية */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>
      
      {/* تأثيرات الجزيئات */}
      <div className="fixed inset-0 particles z-[-1]"></div>
      
      {/* العناصر العائمة */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-neon-blue rounded-full opacity-20 animate-float"></div>
      
      {/* شبكة الحروف */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {letters.map((elem, index) => {
          const isCompleted = completedLetters.includes(elem.letter);
          return (
            <button
              key={index}
              onClick={() => navigate(`/FiveLevelPage/${lan}/${elem.letter}`)}
              className={`group relative card-gradient p-6 rounded-2xl shadow-glass border transition-all duration-300 hover-lift ${
                isCompleted ? "border-neon-green/30" : "border-cyber-700/50"
              } backdrop-blur-md animate-fade-in-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* شارة الإكمال */}
              {isCompleted && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow">
                  <Check className="w-16 h-16 text-green-500" />
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`text-5xl font-extrabold mb-4 ${
                  isCompleted ? "text-white" : "text-cyber-200"
                }`}>
                  {elem.letter}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**3. صفحة البالغين والاختبارات:**
```jsx
// صفحة الاختبارات للبالغين
export default function QuizPage() {
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quesNum, setQuesNum] = useState(0);
  const [result, setResult] = useState(0);
  
  const handleAnswer = (option) => {
    setSelectedOption(option);
    setIsCorrect(option === quiz.correct_answer);
    if (option === quiz.correct_answer) {
      setResult(result + 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-dark text-white overflow-hidden">
      {/* شريط التقدم */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-cyber-300 text-sm">Progress</span>
          <span className="text-neon-blue font-semibold">
            {quesNum + 1}/{filteredQuizzes.length}
          </span>
        </div>
        <div className="w-full bg-cyber-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-neon rounded-full transition-all duration-500"
            style={{
              width: `${((quesNum + 1) / filteredQuizzes.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      
      {/* الخيارات مع تأثيرات بصرية */}
      <div className="space-y-4">
        {quiz.options.map((option, idx) => {
          let optionStyle = "card-gradient border-cyber-700/50";
          let textColor = "text-white";

          if (selectedOption) {
            if (option === quiz.correct_answer) {
              optionStyle = "bg-neon-green/20 border-neon-green/50";
              textColor = "text-neon-green";
            } else if (option === selectedOption && option !== quiz.correct_answer) {
              optionStyle = "bg-neon-red/20 border-neon-red/50";
              textColor = "text-neon-red";
            }
          }

          return (
            <label
              key={idx}
              onClick={() => !selectedOption && handleAnswer(option)}
              className={`flex items-center ${optionStyle} rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 hover-lift border backdrop-blur-md ${
                !selectedOption ? "hover:border-neon-blue/50" : ""
              }`}
            >
              <input
                type="radio"
                name="question"
                value={option}
                className="mr-4 accent-neon-blue"
                checked={selectedOption === option}
                readOnly
              />
              <span className={`text-lg ${textColor}`}>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
```

#### ج) نظام تسجيل الصوت المتقدم

**1. مكون تسجيل الصوت:**
```jsx
// مكون VoicePopup مع WaveSurfer.js
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js";

export default function VoicePopup({ targetWord, targetLetter, onClose, onResult }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // إعداد WaveSurfer للعرض البصري
  useEffect(() => {
    if (isListening && waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#0ff",
        interact: false,
        cursorWidth: 0,
        height: 100,
        plugins: [MicrophonePlugin.create()],
      });

      wavesurfer.current.microphone.on("deviceReady", () => {
        console.log("🎙️ Microphone ready");
      });

      wavesurfer.current.microphone.start();
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [isListening]);

  // بدء التسجيل
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/ogg;codecs=opus";

      const recorder = new MediaRecorder(stream, { mimeType });
      setAudioChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setAudioChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const ext = mimeType.includes("webm") ? "webm" : "ogg";
        
        // إرسال الصوت للتحليل
        const formData = new FormData();
        formData.append("audio", audioBlob, `recorded_audio.${ext}`);
        formData.append("target_word", targetWord);
        formData.append("target_char", targetLetter);

        try {
          setIsProcessing(true);
          const response = await fetch("http://localhost:9999/api/transcribe/", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          setLocalResult(data);
        } catch (err) {
          console.error("❌ فشل إرسال الصوت:", err);
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      setIsListening(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("فشل الوصول للمايكروفون:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-cyber-900 p-6 rounded-2xl shadow-xl border border-neon-green/40 min-w-[400px] max-w-lg relative overflow-hidden">
        {/* مؤشر معالجة الذكاء الاصطناعي */}
        {isProcessing && !localResult && (
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-neon-blue animate-pulse font-medium">
              🔎 جارٍ تحليل الصوت بالذكاء الاصطناعي...
            </p>
          </div>
        )}
        
        {/* عرض النتيجة */}
        {localResult && (
          <div className="text-center mt-4">
            <div className="bg-gradient-to-r from-cyber-800 to-cyber-700 p-4 rounded-xl border border-cyan-500/20 mb-4">
              <p className={`text-lg ${localResult.test_passed ? "text-green-400" : "text-red-300"}`}>
                {localResult.test_passed
                  ? "✅ تهانينا! لقد لفظت الحرف المستهدف بشكل صحيح"
                  : `❌ حاول مرة أخرى، لم تلفظ الحرف "${targetLetter}" بشكل صحيح.`}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-cyber-200 text-sm">نسبة التطابق:</span>
                <span className="text-cyan-400 font-bold">{localResult.similarity_percentage}%</span>
                <span className="text-cyber-400 text-xs">(AI Analysis)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### د) نظام التصميم المتجاوب والحركات

**1. التصميم المتجاوب:**
```css
/* التخطيط المتجاوب */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* التخطيط للشاشات الصغيرة */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* التخطيط للشاشات المتوسطة */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* التخطيط للشاشات الكبيرة */
@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

**2. الحركات والتأثيرات:**
```css
/* تأثيرات الحركة */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* تطبيق الحركات */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### هـ) نظام إدارة الحالة والبيانات

**1. إدارة الحالة المحلية:**
```jsx
// إدارة تقدم المستخدم في localStorage
const saveProgress = (letter, level) => {
  const passed = JSON.parse(localStorage.getItem("passedLevels")) || [];
  const newPassed = { letter, level };
  
  const alreadyPassed = passed.some(
    (item) => item.letter === newPassed.letter && item.level === newPassed.level
  );
  
  if (!alreadyPassed) {
    passed.push(newPassed);
    localStorage.setItem("passedLevels", JSON.stringify(passed));
  }
};

const getProgress = () => {
  return JSON.parse(localStorage.getItem("passedLevels")) || [];
};

const isLevelCompleted = (letter, level) => {
  const passed = getProgress();
  return passed.some(
    (item) => item.letter === letter && item.level === level
  );
};
```

**2. إدارة البيانات من الخادم:**
```jsx
// Hook مخصص لجلب البيانات
const useApiData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// استخدام Hook
const { data: letters, loading, error } = useApiData(`http://localhost:9999/api/${lan}/letters/`, [lan]);
```

#### و) نظام الأمان والتحقق

**1. التحقق من التوكن:**
```jsx
// Hook للتحقق من حالة المصادقة
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // التحقق من صحة التوكن
      fetch("http://localhost:9999/api/profile/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Invalid token");
        })
        .then((data) => {
          setIsAuthenticated(true);
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { isAuthenticated, user, loading };
};
```

**2. حماية المسارات:**
```jsx
// مكون حماية المسارات
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return isAuthenticated ? children : null;
};
```

### 6. نظام تحويل النص إلى كلام (Text-to-Speech - TTS)

#### أ) تقنية XTTS المتقدمة
```python
"""
نظام تحويل النص إلى كلام باستخدام XTTS v2
"""
import torch
from TTS.api import TTS
from TTS.config.shared_configs import BaseDatasetConfig
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import XttsArgs, XttsAudioConfig

# إعداد النموذج الآمن
torch.serialization.add_safe_globals([
    XttsConfig, 
    XttsAudioConfig, 
    BaseDatasetConfig, 
    XttsArgs
])

class ArabicTTS:
    def __init__(self):
        self.model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
        self.tts = TTS(self.model_name)
        self.supported_languages = ["ar", "en", "fr", "es", "de"]
    
    def generate_speech(self, text, language="ar", speaker_wav="arabic_voice.wav", output_path=None):
        """
        توليد كلام من النص
        """
        try:
            if not output_path:
                output_path = f"./pronunciation_api/media/{text}.wav"
            
            # توليد الكلام
            self.tts.tts_to_file(
                text=text,
                speaker_wav=speaker_wav,
                language=language,
                file_path=output_path,
            )
            
            return {
                "success": True,
                "file_path": output_path,
                "text": text,
                "language": language
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def batch_generate(self, texts, language="ar", speaker_wav="arabic_voice.wav"):
        """
        توليد كلام لعدة نصوص دفعة واحدة
        """
        results = []
        for text in texts:
            result = self.generate_speech(text, language, speaker_wav)
            results.append(result)
        return results

# مثال على الاستخدام
tts_system = ArabicTTS()

# توليد كلام لكلمة واحدة
result = tts_system.generate_speech("مسمار", "ar", "arabic_voice.wav")

# توليد كلام لعدة كلمات
words = ["أرنب", "تفاحة", "مدرسة", "كتاب", "قلم"]
batch_results = tts_system.batch_generate(words, "ar", "arabic_voice.wav")
```

#### ب) تحسينات جودة الصوت
```python
class AudioEnhancer:
    """محسن جودة الصوت"""
    
    def __init__(self):
        self.sample_rate = 22050
        self.channels = 1
    
    def enhance_audio(self, input_path, output_path):
        """
        تحسين جودة الصوت
        """
        import librosa
        import soundfile as sf
        
        # تحميل الصوت
        audio, sr = librosa.load(input_path, sr=self.sample_rate)
        
        # تطبيق فلتر لإزالة الضوضاء
        audio_enhanced = self.remove_noise(audio)
        
        # تطبيع مستوى الصوت
        audio_normalized = self.normalize_audio(audio_enhanced)
        
        # حفظ الصوت المحسن
        sf.write(output_path, audio_normalized, self.sample_rate)
        
        return output_path
    
    def remove_noise(self, audio):
        """
        إزالة الضوضاء من الصوت
        """
        # تطبيق فلتر مرشح
        from scipy import signal
        
        # تصميم فلتر مرشح
        nyquist = self.sample_rate / 2
        low = 80 / nyquist
        high = 8000 / nyquist
        
        b, a = signal.butter(4, [low, high], btype='band')
        filtered_audio = signal.filtfilt(b, a, audio)
        
        return filtered_audio
    
    def normalize_audio(self, audio):
        """
        تطبيع مستوى الصوت
        """
        # تطبيع RMS
        rms = np.sqrt(np.mean(audio**2))
        target_rms = 0.1
        normalized_audio = audio * (target_rms / rms)
        
        # قص القمم
        normalized_audio = np.clip(normalized_audio, -0.95, 0.95)
        
        return normalized_audio

# استخدام محسن الصوت
enhancer = AudioEnhancer()
enhanced_path = enhancer.enhance_audio("input.wav", "enhanced.wav")
```

#### ج) نظام إدارة الأصوات
```python
class VoiceManager:
    """مدير الأصوات والملفات الصوتية"""
    
    def __init__(self):
        self.voices_dir = "./pronunciation_api/media/voices/"
        self.letters_dir = "./pronunciation_api/media/letters/"
        self.levels_dir = "./pronunciation_api/media/levels/"
        
    def create_voice_profile(self, name, sample_audio_path):
        """
        إنشاء ملف صوتي شخصي
        """
        import os
        import shutil
        
        profile_dir = os.path.join(self.voices_dir, name)
        os.makedirs(profile_dir, exist_ok=True)
        
        # نسخ عينة الصوت
        shutil.copy(sample_audio_path, os.path.join(profile_dir, "sample.wav"))
        
        return profile_dir
    
    def generate_letter_audio(self, letter, word, voice_profile):
        """
        توليد صوت للحرف
        """
        tts = ArabicTTS()
        output_path = os.path.join(self.letters_dir, f"{word}.wav")
        
        result = tts.generate_speech(
            text=word,
            language="ar",
            speaker_wav=os.path.join(voice_profile, "sample.wav"),
            output_path=output_path
        )
        
        return result
    
    def generate_level_audio(self, level_word, voice_profile):
        """
        توليد صوت للمستوى
        """
        tts = ArabicTTS()
        output_path = os.path.join(self.levels_dir, f"{level_word}.wav")
        
        result = tts.generate_speech(
            text=level_word,
            language="ar",
            speaker_wav=os.path.join(voice_profile, "sample.wav"),
            output_path=output_path
        )
        
        return result

# مثال على الاستخدام
voice_manager = VoiceManager()

# إنشاء ملف صوتي شخصي
profile = voice_manager.create_voice_profile("teacher_ahmed", "sample_voice.wav")

# توليد أصوات للحروف
letters = [
    ("أ", "أرنب"),
    ("ب", "بطة"),
    ("ت", "تفاحة"),
    ("ث", "ثعلب")
]

for letter, word in letters:
    result = voice_manager.generate_letter_audio(letter, word, profile)
    print(f"تم توليد صوت {word}: {result['success']}")
```

### 7. المميزات المتقدمة في الواجهة الأمامية

#### أ) نظام التصميم المستقبلي (Futuristic Design)

**1. تأثيرات الشبكة السيبرانية:**
```css
/* خلفية الشبكة السيبرانية */
.cyber-grid {
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* تأثيرات الجزيئات */
.particles {
  position: relative;
  overflow: hidden;
}

.particles::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(0, 255, 136, 0.3) 0%, transparent 50%);
  animation: particles-float 10s ease-in-out infinite;
}

@keyframes particles-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
```

**2. تأثيرات النص المتدرج:**
```css
/* النص المتدرج مع تأثير الظل */
.gradient-text {
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.gradient-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: blur(8px);
  opacity: 0.7;
  pointer-events: none;
}
```

#### ب) نظام التفاعل المتقدم

**1. مؤشرات التقدم التفاعلية:**
```jsx
// مكون شريط التقدم التفاعلي
const ProgressBar = ({ current, total, label }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyber-300 text-sm">{label}</span>
        <span className="text-neon-blue font-semibold">
          {current}/{total}
        </span>
      </div>
      <div className="w-full bg-cyber-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-neon rounded-full transition-all duration-500 relative"
          style={{ width: `${percentage}%` }}
        >
          {/* تأثير التوهج */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

// استخدام المكون
<ProgressBar 
  current={quesNum + 1} 
  total={filteredQuizzes.length} 
  label="Progress" 
/>
```

**2. نظام الإشعارات المتقدم:**
```jsx
// نظام الإشعارات التفاعلي
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now();
    const notification = {
      id,
      type, // 'success', 'error', 'warning', 'info'
      message,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // إزالة الإشعار تلقائياً
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification-${notification.type} p-4 rounded-lg shadow-lg backdrop-blur-md border animate-slide-in-right`}
        >
          <div className="flex items-center justify-between">
            <span className="text-white">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-neon-blue transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// استخدام نظام الإشعارات
const { addNotification } = useNotification();

// عند النجاح في الاختبار
addNotification('success', '🎉 تم اجتياز المستوى بنجاح!');

// عند الخطأ
addNotification('error', '❌ حاول مرة أخرى، لم تلفظ الحرف بشكل صحيح');
```

#### ج) نظام الألعاب والتحفيز

**1. نظام النقاط والإنجازات:**
```jsx
// نظام النقاط والإنجازات
const AchievementSystem = () => {
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [level, setLevel] = useState(1);
  
  const addPoints = (amount, reason) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      
      // فحص الإنجازات الجديدة
      checkAchievements(newPoints);
      
      // فحص الترقية
      checkLevelUp(newPoints);
      
      return newPoints;
    });
    
    // إظهار إشعار النقاط
    showPointsNotification(amount, reason);
  };
  
  const checkAchievements = (totalPoints) => {
    const newAchievements = [];
    
    if (totalPoints >= 100 && !achievements.includes('first_100')) {
      newAchievements.push({
        id: 'first_100',
        title: 'أول 100 نقطة',
        description: 'حصلت على أول 100 نقطة!',
        icon: '🏆'
      });
    }
    
    if (totalPoints >= 500 && !achievements.includes('point_collector')) {
      newAchievements.push({
        id: 'point_collector',
        title: 'جامع النقاط',
        description: 'حصلت على 500 نقطة!',
        icon: '⭐'
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(achievement => {
        addNotification('success', `${achievement.icon} ${achievement.title}: ${achievement.description}`);
      });
    }
  };
  
  const checkLevelUp = (totalPoints) => {
    const newLevel = Math.floor(totalPoints / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      addNotification('success', `🎉 تم الترقية إلى المستوى ${newLevel}!`);
    }
  };
  
  return (
    <div className="achievement-panel">
      <div className="points-display">
        <span className="text-neon-blue font-bold">{points} نقطة</span>
        <span className="text-cyber-300">المستوى {level}</span>
      </div>
      
      <div className="achievements-list">
        {achievements.map(achievement => (
          <div key={achievement.id} className="achievement-item">
            <span className="achievement-icon">{achievement.icon}</span>
            <div>
              <h4 className="achievement-title">{achievement.title}</h4>
              <p className="achievement-description">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// استخدام نظام النقاط
const { addPoints } = useAchievementSystem();

// عند اجتياز مستوى
addPoints(10, 'اجتياز مستوى');

// عند الحصول على درجة مثالية
addPoints(25, 'درجة مثالية');
```

**2. نظام التحديات اليومية:**
```jsx
// نظام التحديات اليومية
const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  
  useEffect(() => {
    // توليد تحديات جديدة كل يوم
    generateDailyChallenges();
  }, []);
  
  const generateDailyChallenges = () => {
    const dailyChallenges = [
      {
        id: 'practice_5_letters',
        title: 'تدرب على 5 أحرف',
        description: 'أكمل 5 أحرف اليوم',
        target: 5,
        reward: 50,
        type: 'letters_completed'
      },
      {
        id: 'perfect_score',
        title: 'درجة مثالية',
        description: 'احصل على درجة مثالية في أي مستوى',
        target: 1,
        reward: 100,
        type: 'perfect_scores'
      },
      {
        id: 'practice_10_minutes',
        title: 'تدرب لمدة 10 دقائق',
        description: 'اقضِ 10 دقائق في التدريب',
        target: 600, // ثانية
        reward: 75,
        type: 'practice_time'
      }
    ];
    
    setChallenges(dailyChallenges);
  };
  
  const checkChallengeProgress = (type, amount = 1) => {
    challenges.forEach(challenge => {
      if (challenge.type === type && !completedToday.includes(challenge.id)) {
        // تحديث التقدم
        const progress = getChallengeProgress(challenge.id);
        const newProgress = progress + amount;
        
        if (newProgress >= challenge.target) {
          // إكمال التحدي
          completeChallenge(challenge);
        } else {
          // تحديث التقدم
          updateChallengeProgress(challenge.id, newProgress);
        }
      }
    });
  };
  
  const completeChallenge = (challenge) => {
    setCompletedToday(prev => [...prev, challenge.id]);
    addPoints(challenge.reward, `تحدي: ${challenge.title}`);
    addNotification('success', `🎯 تم إكمال التحدي: ${challenge.title}!`);
  };
  
  return (
    <div className="daily-challenges">
      <h3 className="text-xl font-bold text-white mb-4">التحديات اليومية</h3>
      
      <div className="space-y-4">
        {challenges.map(challenge => {
          const isCompleted = completedToday.includes(challenge.id);
          const progress = getChallengeProgress(challenge.id);
          const percentage = Math.min((progress / challenge.target) * 100, 100);
          
          return (
            <div
              key={challenge.id}
              className={`challenge-card ${isCompleted ? 'completed' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="challenge-title">{challenge.title}</h4>
                <span className="challenge-reward">+{challenge.reward} نقطة</span>
              </div>
              
              <p className="challenge-description">{challenge.description}</p>
              
              <div className="challenge-progress mt-3">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {progress}/{challenge.target}
                </span>
              </div>
              
              {isCompleted && (
                <div className="completion-badge">
                  <span>✅ مكتمل</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

#### د) نظام التحليلات والتقارير

**1. لوحة التحكم الشخصية:**
```jsx
// لوحة التحكم الشخصية للمستخدم
const PersonalDashboard = () => {
  const [stats, setStats] = useState({
    totalLettersCompleted: 0,
    totalLevelsCompleted: 0,
    totalPracticeTime: 0,
    averageScore: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  
  useEffect(() => {
    loadUserStats();
    loadRecentActivity();
    generateLearningPath();
  }, []);
  
  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('فشل تحميل الإحصائيات:', error);
    }
  };
  
  const loadRecentActivity = async () => {
    try {
      const response = await fetch('/api/user/recent-activity');
      const data = await response.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('فشل تحميل النشاط الأخير:', error);
    }
  };
  
  const generateLearningPath = () => {
    // توليد مسار التعلم الموصى به
    const path = [
      { type: 'letter', id: 'أ', status: 'completed' },
      { type: 'letter', id: 'ب', status: 'in_progress' },
      { type: 'letter', id: 'ت', status: 'locked' },
      { type: 'skill', id: 'pronunciation', status: 'locked' }
    ];
    setLearningPath(path);
  };
  
  return (
    <div className="personal-dashboard">
      {/* إحصائيات سريعة */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h4 className="stat-title">الحروف المكتملة</h4>
            <p className="stat-value">{stats.totalLettersCompleted}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h4 className="stat-title">المستويات المكتملة</h4>
            <p className="stat-value">{stats.totalLevelsCompleted}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h4 className="stat-title">وقت التدريب</h4>
            <p className="stat-value">{formatTime(stats.totalPracticeTime)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h4 className="stat-title">التسلسل الحالي</h4>
            <p className="stat-value">{stats.currentStreak} أيام</p>
          </div>
        </div>
      </div>
      
      {/* النشاط الأخير */}
      <div className="recent-activity">
        <h3 className="section-title">النشاط الأخير</h3>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* مسار التعلم */}
      <div className="learning-path">
        <h3 className="section-title">مسار التعلم</h3>
        <div className="path-visualization">
          {learningPath.map((item, index) => (
            <div key={item.id} className={`path-item ${item.status}`}>
              <div className="path-icon">{item.icon}</div>
              <div className="path-content">
                <h4 className="path-title">{item.title}</h4>
                <p className="path-description">{item.description}</p>
              </div>
              {index < learningPath.length - 1 && (
                <div className="path-connector"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// دوال مساعدة
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}س ${minutes}د`;
  }
  return `${minutes} دقيقة`;
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
  return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
};
```

هذه الإضافات تجعل المشروع أكثر تفاعلية وجاذبية للمستخدمين، مع توفير تجربة تعليمية متقدمة ومحفزة.

### 8. تدريب نموذج TTS مخصص (Custom TTS Model Training)

#### أ) إعداد البيانات للتدريب

**1. هيكل المجلدات المطلوبة:**
```python
"""
هيكل المجلدات لتدريب نموذج TTS مخصص
"""
import os
import shutil
from pathlib import Path

class TTSDataPreparation:
    def __init__(self, base_dir="./custom_tts_data"):
        self.base_dir = Path(base_dir)
        self.setup_directory_structure()
    
    def setup_directory_structure(self):
        """إنشاء هيكل المجلدات المطلوبة"""
        directories = [
            "raw_audio",           # الملفات الصوتية الأصلية
            "processed_audio",      # الملفات الصوتية المعالجة
            "transcripts",          # نصوص النطق
            "metadata",            # ملفات البيانات الوصفية
            "validation",          # بيانات التحقق
            "test",                # بيانات الاختبار
            "models",              # النماذج المدربة
            "logs",                # سجلات التدريب
            "checkpoints"          # نقاط التحقق
        ]
        
        for dir_name in directories:
            dir_path = self.base_dir / dir_name
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"✅ تم إنشاء المجلد: {dir_path}")
    
    def organize_audio_files(self, source_dir, target_format="wav"):
        """
        تنظيم الملفات الصوتية وتحويلها إلى التنسيق المطلوب
        """
        source_path = Path(source_dir)
        target_dir = self.base_dir / "raw_audio"
        
        # دعم التنسيقات المختلفة
        supported_formats = ['.mp3', '.wav', '.flac', '.m4a', '.ogg']
        
        for audio_file in source_path.rglob("*"):
            if audio_file.suffix.lower() in supported_formats:
                # تحويل إلى WAV إذا لزم الأمر
                if audio_file.suffix.lower() != '.wav':
                    converted_file = self.convert_to_wav(audio_file, target_dir)
                else:
                    converted_file = target_dir / audio_file.name
                    shutil.copy2(audio_file, converted_file)
                
                print(f"✅ تم معالجة: {audio_file.name}")
        
        return target_dir
    
    def convert_to_wav(self, input_file, output_dir, sample_rate=22050):
        """
        تحويل الملفات الصوتية إلى تنسيق WAV
        """
        import librosa
        import soundfile as sf
        
        # تحميل الصوت
        audio, sr = librosa.load(input_file, sr=sample_rate)
        
        # حفظ كـ WAV
        output_file = output_dir / f"{input_file.stem}.wav"
        sf.write(output_file, audio, sample_rate)
        
        return output_file

# مثال على الاستخدام
data_prep = TTSDataPreparation("./my_custom_tts")
data_prep.organize_audio_files("./my_voice_samples")
```

**2. إعداد النصوص والنطق:**
```python
class TranscriptPreparation:
    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.transcripts_dir = self.data_dir / "transcripts"
        self.metadata_dir = self.data_dir / "metadata"
    
    def create_transcript_file(self, audio_file, text, language="ar"):
        """
        إنشاء ملف نصي للنطق
        """
        transcript_file = self.transcripts_dir / f"{audio_file.stem}.txt"
        
        with open(transcript_file, 'w', encoding='utf-8') as f:
            f.write(text.strip())
        
        return transcript_file
    
    def create_metadata_file(self, audio_files, transcripts):
        """
        إنشاء ملف البيانات الوصفية للتدريب
        """
        metadata_file = self.metadata_dir / "metadata.csv"
        
        with open(metadata_file, 'w', encoding='utf-8') as f:
            f.write("audio_file,text,language\n")
            
            for audio_file, text in zip(audio_files, transcripts):
                relative_path = audio_file.relative_to(self.data_dir / "processed_audio")
                f.write(f"{relative_path},{text},{language}\n")
        
        return metadata_file

# مثال على الاستخدام
transcript_prep = TranscriptPreparation("./my_custom_tts")

# إنشاء النصوص
audio_files = list(Path("./my_custom_tts/processed_audio").glob("*.wav"))
transcripts = [
    "مرحبا كيف حالك",
    "أنا أتعلم اللغة العربية",
    "هذا تطبيق رائع",
    "شكرا لك على المساعدة"
]

# إنشاء ملفات النصوص
for audio_file, text in zip(audio_files, transcripts):
    transcript_prep.create_transcript_file(audio_file, text)

# إنشاء ملف البيانات الوصفية
metadata_file = transcript_prep.create_metadata_file(audio_files, transcripts)
```

#### ب) معالجة البيانات الصوتية

**1. تحسين جودة الصوت:**
```python
class AudioPreprocessor:
    def __init__(self, sample_rate=22050, target_duration=10):
        self.sample_rate = sample_rate
        self.target_duration = target_duration
    
    def preprocess_audio(self, input_file, output_file):
        """
        معالجة شاملة للملف الصوتي
        """
        import librosa
        import soundfile as sf
        import numpy as np
        from scipy import signal
        
        # تحميل الصوت
        audio, sr = librosa.load(input_file, sr=self.sample_rate)
        
        # إزالة الضوضاء
        audio_denoised = self.remove_noise(audio)
        
        # تطبيع مستوى الصوت
        audio_normalized = self.normalize_audio(audio_denoised)
        
        # إزالة الصمت
        audio_trimmed = self.trim_silence(audio_normalized)
        
        # ضبط المدة
        audio_padded = self.pad_or_trim(audio_trimmed)
        
        # حفظ الملف المعالج
        sf.write(output_file, audio_padded, self.sample_rate)
        
        return output_file
    
    def remove_noise(self, audio, noise_reduce_level=0.1):
        """
        إزالة الضوضاء باستخدام فلتر مرشح
        """
        from scipy import signal
        
        # تصميم فلتر مرشح
        nyquist = self.sample_rate / 2
        low = 80 / nyquist
        high = 8000 / nyquist
        
        b, a = signal.butter(4, [low, high], btype='band')
        filtered_audio = signal.filtfilt(b, a, audio)
        
        return filtered_audio
    
    def normalize_audio(self, audio, target_rms=0.1):
        """
        تطبيع مستوى الصوت
        """
        rms = np.sqrt(np.mean(audio**2))
        if rms > 0:
            normalized_audio = audio * (target_rms / rms)
            # قص القمم
            normalized_audio = np.clip(normalized_audio, -0.95, 0.95)
            return normalized_audio
        return audio
    
    def trim_silence(self, audio, threshold=0.01):
        """
        إزالة الصمت من بداية ونهاية الملف
        """
        # إزالة الصمت من البداية
        start_idx = np.where(np.abs(audio) > threshold)[0]
        if len(start_idx) > 0:
            audio = audio[start_idx[0]:]
        
        # إزالة الصمت من النهاية
        end_idx = np.where(np.abs(audio) > threshold)[0]
        if len(end_idx) > 0:
            audio = audio[:end_idx[-1] + 1]
        
        return audio
    
    def pad_or_trim(self, audio):
        """
        ضبط مدة الصوت إلى المدة المطلوبة
        """
        target_length = self.sample_rate * self.target_duration
        
        if len(audio) > target_length:
            # تقصير الصوت
            audio = audio[:target_length]
        elif len(audio) < target_length:
            # إطالة الصوت بالصمت
            padding_length = target_length - len(audio)
            padding = np.zeros(padding_length)
            audio = np.concatenate([audio, padding])
        
        return audio

# مثال على الاستخدام
preprocessor = AudioPreprocessor(sample_rate=22050, target_duration=10)

# معالجة جميع الملفات الصوتية
raw_audio_dir = Path("./my_custom_tts/raw_audio")
processed_audio_dir = Path("./my_custom_tts/processed_audio")

for audio_file in raw_audio_dir.glob("*.wav"):
    output_file = processed_audio_dir / audio_file.name
    preprocessor.preprocess_audio(audio_file, output_file)
    print(f"✅ تم معالجة: {audio_file.name}")
```

#### ج) إعداد التدريب

**1. تكوين النموذج:**
```python
class TTSModelConfig:
    def __init__(self, model_type="tacotron2"):
        self.model_type = model_type
        self.config = self.get_default_config()
    
    def get_default_config(self):
        """
        الحصول على التكوين الافتراضي للنموذج
        """
        if self.model_type == "tacotron2":
            return {
                "model": {
                    "encoder": {
                        "encoder_embedding_dim": 512,
                        "encoder_n_convolutions": 3,
                        "encoder_kernel_size": 5
                    },
                    "decoder": {
                        "decoder_rnn_dim": 1024,
                        "decoder_layer_norm": True,
                        "decoder_dropout": 0.1
                    },
                    "postnet": {
                        "postnet_embedding_dim": 512,
                        "postnet_kernel_size": 5,
                        "postnet_n_convolutions": 5
                    }
                },
                "training": {
                    "batch_size": 32,
                    "learning_rate": 0.001,
                    "epochs": 1000,
                    "gradient_clip_thresh": 1.0,
                    "weight_decay": 1e-6
                },
                "audio": {
                    "sample_rate": 22050,
                    "hop_length": 256,
                    "win_length": 1024,
                    "n_mel_channels": 80,
                    "mel_fmin": 0.0,
                    "mel_fmax": 8000.0
                }
            }
        elif self.model_type == "fastspeech2":
            return {
                "model": {
                    "encoder": {
                        "encoder_dim": 256,
                        "encoder_n_layer": 4,
                        "encoder_head": 2
                    },
                    "decoder": {
                        "decoder_dim": 256,
                        "decoder_n_layer": 4,
                        "decoder_head": 2
                    }
                },
                "training": {
                    "batch_size": 16,
                    "learning_rate": 0.0001,
                    "epochs": 1000
                }
            }
        
        return {}
    
    def save_config(self, config_path):
        """
        حفظ تكوين النموذج
        """
        import json
        
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
        
        print(f"✅ تم حفظ التكوين في: {config_path}")

# مثال على الاستخدام
config = TTSModelConfig("tacotron2")
config.save_config("./my_custom_tts/models/config.json")
```

#### د) تقييم النموذج والتحسين

**1. تقييم جودة النموذج:**
```python
class TTSEvaluator:
    def __init__(self, model_path, config_path):
        self.model_path = Path(model_path)
        self.config = self.load_config(config_path)
        self.model = self.load_model()
    
    def evaluate_model(self, test_file):
        """
        تقييم النموذج على بيانات الاختبار
        """
        import pandas as pd
        import numpy as np
        
        df = pd.read_csv(test_file)
        results = []
        
        for _, row in df.iterrows():
            # توليد الكلام
            generated_audio = self.generate_speech(row['text'])
            
            # تحميل الكلام المرجعي
            reference_audio = self.load_audio(row['audio_file'])
            
            # حساب مقاييس الجودة
            metrics = self.calculate_quality_metrics(generated_audio, reference_audio)
            results.append(metrics)
        
        # حساب المتوسطات
        avg_metrics = self.calculate_average_metrics(results)
        
        return avg_metrics
    
    def calculate_quality_metrics(self, generated_audio, reference_audio):
        """
        حساب مقاييس جودة الصوت
        """
        import librosa
        from scipy.stats import pearsonr
        
        # تحويل إلى ميزات Mel-spectrogram
        gen_mel = librosa.feature.melspectrogram(
            y=generated_audio, 
            sr=self.config['audio']['sample_rate']
        )
        ref_mel = librosa.feature.melspectrogram(
            y=reference_audio, 
            sr=self.config['audio']['sample_rate']
        )
        
        # حساب MSE
        mse = np.mean((gen_mel - ref_mel) ** 2)
        
        # حساب MAE
        mae = np.mean(np.abs(gen_mel - ref_mel))
        
        # حساب معامل الارتباط
        correlation = pearsonr(gen_mel.flatten(), ref_mel.flatten())[0]
        
        return {
            'mse': mse,
            'mae': mae,
            'correlation': correlation
        }
    
    def calculate_average_metrics(self, results):
        """
        حساب متوسط المقاييس
        """
        avg_metrics = {}
        for key in results[0].keys():
            values = [r[key] for r in results]
            avg_metrics[key] = np.mean(values)
            avg_metrics[f"{key}_std"] = np.std(values)
        
        return avg_metrics

# مثال على الاستخدام
evaluator = TTSEvaluator(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json"
)

metrics = evaluator.evaluate_model("./my_custom_tts/metadata/test.csv")
print("📊 نتائج التقييم:")
for metric, value in metrics.items():
    print(f"   {metric}: {value:.4f}")
```

#### هـ) استخدام النموذج المدرب

**1. تحميل واستخدام النموذج:**
```python
class CustomTTSInference:
    def __init__(self, model_path, config_path, vocab_path):
        self.model_path = Path(model_path)
        self.config = self.load_config(config_path)
        self.vocab = self.load_vocabulary(vocab_path)
        self.model = self.load_model()
    
    def load_vocabulary(self, vocab_path):
        """
        تحميل المفردات
        """
        with open(vocab_path, 'r', encoding='utf-8') as f:
            vocab = [line.strip() for line in f.readlines()]
        return vocab
    
    def text_to_sequence(self, text):
        """
        تحويل النص إلى تسلسل أرقام
        """
        char_to_id = {char: i for i, char in enumerate(self.vocab)}
        sequence = [char_to_id.get(char, char_to_id['<unk>']) for char in text]
        sequence = [char_to_id['<sos>'] + sequence + [char_to_id['<eos>']]
        return sequence
    
    def generate_speech(self, text, output_path=None):
        """
        توليد كلام من النص
        """
        # تحويل النص إلى تسلسل
        sequence = self.text_to_sequence(text)
        
        # توليد الكلام
        with torch.no_grad():
            audio = self.model.inference(sequence)
        
        # حفظ الملف
        if output_path:
            import soundfile as sf
            sf.write(output_path, audio, self.config['audio']['sample_rate'])
        
        return audio
    
    def batch_generate(self, texts, output_dir):
        """
        توليد كلام لعدة نصوص دفعة واحدة
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        results = []
        for i, text in enumerate(texts):
            output_path = output_dir / f"generated_{i:03d}.wav"
            audio = self.generate_speech(text, output_path)
            results.append({
                'text': text,
                'audio': audio,
                'file_path': output_path
            })
        
        return results

# مثال على الاستخدام
custom_tts = CustomTTSInference(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json",
    vocab_path="./my_custom_tts/models/vocab.txt"
)

# توليد كلام لكلمة واحدة
audio = custom_tts.generate_speech("مرحبا كيف حالك", "output.wav")

# توليد كلام لعدة كلمات
texts = [
    "أنا أتعلم اللغة العربية",
    "هذا تطبيق رائع",
    "شكرا لك على المساعدة"
]

results = custom_tts.batch_generate(texts, "./generated_audio")
```

**2. واجهة برمجة التطبيقات للنموذج المخصص:**
```python
from flask import Flask, request, jsonify, send_file
import io

app = Flask(__name__)

# تحميل النموذج المخصص
custom_tts = CustomTTSInference(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json",
    vocab_path="./my_custom_tts/models/vocab.txt"
)

@app.route('/api/custom-tts/generate', methods=['POST'])
def generate_custom_speech():
    """
    توليد كلام باستخدام النموذج المخصص
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'ar')
        
        if not text:
            return jsonify({'error': 'النص مطلوب'}), 400
        
        # توليد الكلام
        audio = custom_tts.generate_speech(text)
        
        # تحويل إلى ملف صوتي
        import soundfile as sf
        buffer = io.BytesIO()
        sf.write(buffer, audio, custom_tts.config['audio']['sample_rate'], format='WAV')
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='audio/wav',
            as_attachment=True,
            download_name=f'custom_tts_{text[:10]}.wav'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/custom-tts/batch-generate', methods=['POST'])
def batch_generate_custom_speech():
    """
    توليد كلام لعدة نصوص دفعة واحدة
    """
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        language = data.get('language', 'ar')
        
        if not texts:
            return jsonify({'error': 'قائمة النصوص مطلوبة'}), 400
        
        # توليد الكلام
        results = custom_tts.batch_generate(texts, "./temp_audio")
        
        # إنشاء ملف ZIP
        import zipfile
        import os
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for result in results:
                zip_file.write(result['file_path'], result['file_path'].name)
        
        zip_buffer.seek(0)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='custom_tts_batch.zip'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

هذا القسم يوفر دليلاً شاملاً لتدريب نموذج TTS مخصص من الصفر، بدءاً من إعداد البيانات وانتهاءً باستخدام النموذج المدرب في التطبيق.

## الخوارزميات والتقنيات المستخدمة

### 1. خوارزمية معالجة الصوت

#### أ) تحويل الصوت
```python
# تحويل الصوت باستخدام FFmpeg
def convert_audio(input_file, output_file):
    subprocess.run([
        "ffmpeg", "-y", "-i", input_file,
        "-ar", "16000",  # Sample rate
        "-ac", "1",      # Mono
        "-c:a", "pcm_s16le",  # 16-bit PCM
        output_file
    ])
```

#### ب) تحليل النطق
```python
# تحليل النطق باستخدام Whisper
def transcribe_audio(audio_file):
    model = whisper.load_model("tiny")
    result = model.transcribe(audio_file, language="ar")
    return result["text"]
```

### 2. خوارزمية مقارنة النصوص

#### أ) حساب نسبة التطابق باستخدام خوارزمية Levenshtein
```python
def levenshtein_distance(str1, str2):
    """
    حساب المسافة بين نصين باستخدام خوارزمية Levenshtein
    """
    if len(str1) < len(str2):
        return levenshtein_distance(str2, str1)

    if len(str2) == 0:
        return len(str1)

    previous_row = list(range(len(str2) + 1))
    for i, c1 in enumerate(str1):
        current_row = [i + 1]
        for j, c2 in enumerate(str2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def calculate_similarity(text1, text2):
    """
    حساب نسبة التطابق بين نصين
    """
    # تنظيف النصوص
    text1 = text1.strip().lower()
    text2 = text2.strip().lower()
    
    # حساب المسافة
    distance = levenshtein_distance(text1, text2)
    max_length = max(len(text1), len(text2))
    
    # حساب نسبة التطابق
    if max_length == 0:
        return 100.0
    
    similarity = ((max_length - distance) / max_length) * 100
    return round(similarity, 2)

# مثال على الاستخدام
text1 = "أرنب"
text2 = "أرنب"
similarity = calculate_similarity(text1, text2)  # 100.0

text1 = "أرنب"
text2 = "رنب"
similarity = calculate_similarity(text1, text2)  # 75.0
```

#### ب) تحليل الحروف المتقدم
```python
def analyze_characters_advanced(target_word, user_pronunciation, target_char):
    """
    تحليل متقدم للحروف مع مراعاة خصوصيات اللغة العربية
    """
    # تنظيف النصوص
    target_word = target_word.strip()
    user_pronunciation = user_pronunciation.strip()
    
    # البحث عن جميع مواضع الحرف المستهدف
    target_positions = [i for i, char in enumerate(target_word) if char == target_char]
    
    if not target_positions:
        return {
            "found": False,
            "message": f"الحرف '{target_char}' غير موجود في الكلمة المستهدفة",
            "target_positions": [],
            "user_positions": []
        }
    
    # البحث عن الحرف في نطق المستخدم
    user_positions = [i for i, char in enumerate(user_pronunciation) if char == target_char]
    
    # تحليل النتائج
    if not user_positions:
        return {
            "found": False,
            "message": f"لم تنطق الحرف '{target_char}' في أي موضع",
            "target_positions": target_positions,
            "user_positions": []
        }
    
    # التحقق من صحة المواضع
    correct_positions = []
    incorrect_positions = []
    
    for target_pos in target_positions:
        if target_pos < len(user_pronunciation) and user_pronunciation[target_pos] == target_char:
            correct_positions.append(target_pos)
        else:
            incorrect_positions.append(target_pos)
    
    # تقييم النتيجة
    accuracy = len(correct_positions) / len(target_positions) * 100
    
    return {
        "found": True,
        "accuracy": accuracy,
        "correct_positions": correct_positions,
        "incorrect_positions": incorrect_positions,
        "target_positions": target_positions,
        "user_positions": user_positions,
        "message": f"نطقت الحرف '{target_char}' بشكل صحيح في {len(correct_positions)} من {len(target_positions)} موضع"
    }

# مثال على الاستخدام
target_word = "أرنب"
user_pronunciation = "أرنب"
target_char = "أ"

result = analyze_characters_advanced(target_word, user_pronunciation, target_char)
# النتيجة: {"found": True, "accuracy": 100.0, "correct_positions": [0], ...}
```

#### ج) خوارزمية مقارنة النصوص المحسنة للعربية
```python
def arabic_text_similarity(text1, text2):
    """
    خوارزمية مقارنة نصوص محسنة للغة العربية
    """
    # إزالة التشكيل (الحركات)
    def remove_diacritics(text):
        diacritics = ['َ', 'ُ', 'ِ', 'ّ', 'ْ', 'ً', 'ٌ', 'ٍ', 'ٰ', 'ٱ']
        for diacritic in diacritics:
            text = text.replace(diacritic, '')
        return text
    
    # تنظيف النصوص
    text1_clean = remove_diacritics(text1.strip())
    text2_clean = remove_diacritics(text2.strip())
    
    # حساب المسافة الأساسية
    basic_distance = levenshtein_distance(text1_clean, text2_clean)
    
    # حساب المسافة مع مراعاة الحروف المتشابهة
    similar_chars = {
        'أ': ['ا', 'آ', 'إ'],
        'ا': ['أ', 'آ', 'إ'],
        'و': ['ؤ'],
        'ي': ['ى', 'ئ'],
        'ه': ['ة'],
        'ة': ['ه']
    }
    
    # حساب المسافة المحسنة
    enhanced_distance = calculate_enhanced_distance(text1_clean, text2_clean, similar_chars)
    
    # استخدام المسافة الأقل
    final_distance = min(basic_distance, enhanced_distance)
    max_length = max(len(text1_clean), len(text2_clean))
    
    if max_length == 0:
        return 100.0
    
    similarity = ((max_length - final_distance) / max_length) * 100
    return round(similarity, 2)

def calculate_enhanced_distance(text1, text2, similar_chars):
    """
    حساب المسافة مع مراعاة الحروف المتشابهة
    """
    if len(text1) < len(text2):
        return calculate_enhanced_distance(text2, text1)
    
    if len(text2) == 0:
        return len(text1)
    
    previous_row = list(range(len(text2) + 1))
    for i, c1 in enumerate(text1):
        current_row = [i + 1]
        for j, c2 in enumerate(text2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            
            # حساب تكلفة الاستبدال مع مراعاة الحروف المتشابهة
            substitution_cost = 0 if c1 == c2 else 1
            if c1 in similar_chars and c2 in similar_chars[c1]:
                substitution_cost = 0.5  # تكلفة أقل للحروف المتشابهة
            
            substitutions = previous_row[j] + substitution_cost
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

# مثال على الاستخدام
text1 = "أَرْنَب"
text2 = "ارنب"
similarity = arabic_text_similarity(text1, text2)  # 100.0 (مع إزالة التشكيل)

text1 = "أرنب"
text2 = "ارنب"
similarity = arabic_text_similarity(text1, text2)  # 100.0 (الحروف متشابهة)
```

### 3. خوارزمية إدارة الجلسات والأمان

#### أ) حماية ضد هجمات Brute Force
```python
import redis
from datetime import timedelta
from django.utils import timezone

class SecurityManager:
    def __init__(self):
        self.redis_client = redis.StrictRedis.from_url('redis://localhost:6379/0')
        self.MAX_ATTEMPTS = 3
        self.LOCKOUT_DURATION = 3600  # ساعة واحدة
        self.VERIFICATION_EXPIRY = 600  # 10 دقائق
    
    def check_failed_attempts(self, email, username):
        """
        فحص عدد المحاولات الفاشلة وحماية ضد الهجمات
        """
        attempt_key = f"failed_attempts:{email}:{username}"
        lockout_key = f"lockout:{email}:{username}"
        
        # فحص حالة الحظر
        if self.redis_client.exists(lockout_key):
            remaining_time = self.redis_client.ttl(lockout_key)
            return {
                "allowed": False,
                "message": f"تم حظر الحساب مؤقتاً. حاول مرة أخرى بعد {remaining_time} ثانية",
                "remaining_time": remaining_time
            }
        
        # فحص عدد المحاولات
        failed_attempts = self.redis_client.get(attempt_key)
        if failed_attempts and int(failed_attempts) >= self.MAX_ATTEMPTS:
            # تفعيل الحظر
            self.redis_client.setex(lockout_key, self.LOCKOUT_DURATION, "locked")
            return {
                "allowed": False,
                "message": f"تم حظر الحساب لمدة ساعة واحدة بسبب المحاولات المتكررة",
                "remaining_time": self.LOCKOUT_DURATION
            }
        
        return {"allowed": True, "message": "يمكن المحاولة"}
    
    def increment_failed_attempts(self, email, username):
        """
        زيادة عداد المحاولات الفاشلة
        """
        attempt_key = f"failed_attempts:{email}:{username}"
        self.redis_client.incr(attempt_key)
        self.redis_client.expire(attempt_key, self.LOCKOUT_DURATION)
    
    def reset_failed_attempts(self, email, username):
        """
        إعادة تعيين عداد المحاولات الفاشلة
        """
        attempt_key = f"failed_attempts:{email}:{username}"
        lockout_key = f"lockout:{email}:{username}"
        self.redis_client.delete(attempt_key, lockout_key)

# مثال على الاستخدام في views.py
security_manager = SecurityManager()

class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get("email")
        username = request.data.get("username")
        verification_code = request.data.get("verification_code")
        
        # فحص الأمان
        security_check = security_manager.check_failed_attempts(email, username)
        if not security_check["allowed"]:
            return Response({
                "error": security_check["message"]
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # التحقق من الكود
        user = get_user_model().objects.filter(email=email, username=username).first()
        if not user or user.verification_code != verification_code:
            security_manager.increment_failed_attempts(email, username)
            return Response({
                "error": "رمز التحقق غير صحيح"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # نجح التحقق
        security_manager.reset_failed_attempts(email, username)
        user.is_active = True
        user.save()
        
        return Response({
            "message": "تم التحقق بنجاح"
        }, status=status.HTTP_200_OK)
```

#### ب) إدارة رموز التحقق المتقدمة
```python
import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone

class VerificationCodeManager:
    def __init__(self):
        self.CODE_LENGTH = 8
        self.EXPIRY_MINUTES = 10
        self.MAX_CODES_PER_HOUR = 5
    
    def generate_verification_code(self):
        """
        توليد رمز تحقق آمن
        """
        # استخدام secrets بدلاً من random للأمان
        return ''.join(secrets.choice('0123456789') for _ in range(self.CODE_LENGTH))
    
    def generate_secure_code(self):
        """
        توليد رمز تحقق أكثر أماناً مع hash
        """
        code = self.generate_verification_code()
        # إضافة timestamp للرمز
        timestamp = str(int(timezone.now().timestamp()))
        code_with_timestamp = f"{code}_{timestamp}"
        
        # إنشاء hash للرمز
        code_hash = hashlib.sha256(code_with_timestamp.encode()).hexdigest()[:16]
        
        return {
            "code": code,
            "hash": code_hash,
            "timestamp": timestamp
        }
    
    def is_verification_code_expired(self, sent_at):
        """
        فحص انتهاء صلاحية رمز التحقق
        """
        if not sent_at:
            return True
        
        expiry_time = sent_at + timedelta(minutes=self.EXPIRY_MINUTES)
        return timezone.now() > expiry_time
    
    def validate_code_rate_limit(self, email):
        """
        فحص حد عدد رموز التحقق المرسلة
        """
        rate_key = f"verification_rate:{email}"
        current_count = redis_client.get(rate_key)
        
        if current_count and int(current_count) >= self.MAX_CODES_PER_HOUR:
            return False
        
        return True
    
    def increment_code_count(self, email):
        """
        زيادة عداد رموز التحقق المرسلة
        """
        rate_key = f"verification_rate:{email}"
        redis_client.incr(rate_key)
        redis_client.expire(rate_key, 3600)  # ساعة واحدة

# مثال على الاستخدام
verification_manager = VerificationCodeManager()

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        
        # فحص حد إرسال رموز التحقق
        if not verification_manager.validate_code_rate_limit(email):
            return Response({
                "error": "تم تجاوز الحد المسموح لرموز التحقق. حاول مرة أخرى بعد ساعة"
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # توليد رمز تحقق آمن
        secure_code = verification_manager.generate_secure_code()
        
        # حفظ الرمز في قاعدة البيانات
        user = User.objects.create(
            email=email,
            verification_code=secure_code["code"],
            verification_code_sent_at=timezone.now()
        )
        
        # إرسال الرمز عبر البريد الإلكتروني
        send_verification_email.delay(email, secure_code["code"])
        
        # زيادة عداد الرموز المرسلة
        verification_manager.increment_code_count(email)
        
        return Response({
            "message": "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
        }, status=status.HTTP_201_CREATED)
```

#### ج) إدارة الجلسات الآمنة
```python
import jwt
from datetime import datetime, timedelta
from django.conf import settings

class SessionManager:
    def __init__(self):
        self.SECRET_KEY = settings.SECRET_KEY
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30
        self.REFRESH_TOKEN_EXPIRE_DAYS = 7
    
    def create_access_token(self, data: dict):
        """
        إنشاء token للوصول
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt
    
    def create_refresh_token(self, data: dict):
        """
        إنشاء token للتجديد
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str):
        """
        التحقق من صحة token
        """
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return {"error": "Token منتهي الصلاحية"}
        except jwt.JWTError:
            return {"error": "Token غير صحيح"}
    
    def blacklist_token(self, token: str):
        """
        إضافة token إلى القائمة السوداء
        """
        blacklist_key = f"blacklist:{token}"
        redis_client.setex(blacklist_key, self.ACCESS_TOKEN_EXPIRE_MINUTES * 60, "blacklisted")
    
    def is_token_blacklisted(self, token: str):
        """
        فحص إذا كان token في القائمة السوداء
        """
        blacklist_key = f"blacklist:{token}"
        return redis_client.exists(blacklist_key)

# مثال على الاستخدام
session_manager = SessionManager()

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response({
                "error": "بيانات الدخول غير صحيحة"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # إنشاء tokens
        access_token = session_manager.create_access_token(
            data={"sub": user.username, "user_id": user.id}
        )
        refresh_token = session_manager.create_refresh_token(
            data={"sub": user.username, "user_id": user.id}
        )
        
        return Response({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    def post(self, request):
        # إضافة token إلى القائمة السوداء
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            session_manager.blacklist_token(token)
        
        return Response({
            "message": "تم تسجيل الخروج بنجاح"
        }, status=status.HTTP_200_OK)
```

## قاعدة البيانات

### 1. نماذج البيانات (Models)

#### أ) نموذج المستخدم المتقدم
```python
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

class CustomUser(AbstractUser):
    """
    نموذج مستخدم مخصص مع ميزات أمان متقدمة
    """
    email = models.EmailField(unique=True, verbose_name="البريد الإلكتروني")
    verification_code = models.CharField(
        max_length=8, 
        blank=True, 
        null=True,
        verbose_name="رمز التحقق"
    )
    failed_attempts = models.IntegerField(
        default=0,
        verbose_name="عدد المحاولات الفاشلة"
    )
    verification_code_sent_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name="وقت إرسال رمز التحقق"
    )
    last_login_ip = models.GenericIPAddressField(
        null=True, 
        blank=True,
        verbose_name="آخر عنوان IP"
    )
    is_email_verified = models.BooleanField(
        default=False,
        verbose_name="تم التحقق من البريد الإلكتروني"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الإنشاء"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="تاريخ التحديث"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["email"],
                name="unique_email_active",
                condition=Q(is_active=True),
            )
        ]
        verbose_name = "مستخدم"
        verbose_name_plural = "المستخدمين"

    def clean(self):
        """التحقق من صحة البيانات"""
        if self.is_active:
            if (
                CustomUser.objects.filter(email=self.email, is_active=True)
                .exclude(id=self.id)
                .exists()
            ):
                raise ValidationError(
                    f"يوجد مستخدم نشط بنفس البريد الإلكتروني: {self.email}"
                )

    def is_verification_code_expired(self):
        """فحص انتهاء صلاحية رمز التحقق"""
        if self.verification_code_sent_at:
            return timezone.now() > self.verification_code_sent_at + timedelta(minutes=10)
        return True

    def increment_failed_attempts(self):
        """زيادة عداد المحاولات الفاشلة"""
        self.failed_attempts += 1
        self.save(update_fields=['failed_attempts'])

    def reset_failed_attempts(self):
        """إعادة تعيين عداد المحاولات الفاشلة"""
        self.failed_attempts = 0
        self.save(update_fields=['failed_attempts'])

    def __str__(self):
        return f"{self.username} ({self.email})"

# Signal لإدارة المستخدمين غير النشطين
@receiver(pre_save, sender=CustomUser)
def deactivate_other_users_with_same_email(sender, instance, **kwargs):
    """إلغاء تفعيل المستخدمين الآخرين بنفس البريد الإلكتروني"""
    if instance.is_active:
        CustomUser.objects.filter(
            email=instance.email, 
            is_active=False
        ).delete()
```

#### ب) نموذج اللغة المتقدم
```python
class Language(models.Model):
    """
    نموذج اللغة مع دعم متعدد اللغات
    """
    LANGUAGE_CHOICES = [
        ("ar", "العربية"),
        ("en", "English"),
        ("fr", "Français"),
        ("es", "Español"),
        ("de", "Deutsch"),
    ]

    code = models.CharField(
        max_length=2, 
        choices=LANGUAGE_CHOICES, 
        unique=True,
        verbose_name="رمز اللغة"
    )
    name = models.CharField(
        max_length=50,
        verbose_name="اسم اللغة"
    )
    native_name = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="الاسم الأصلي"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="نشط"
    )
    is_default = models.BooleanField(
        default=False,
        verbose_name="اللغة الافتراضية"
    )
    direction = models.CharField(
        max_length=3,
        choices=[("ltr", "Left to Right"), ("rtl", "Right to Left")],
        default="ltr",
        verbose_name="اتجاه الكتابة"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الإنشاء"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="تاريخ التحديث"
    )

    class Meta:
        ordering = ["code"]
        verbose_name = "لغة"
        verbose_name_plural = "اللغات"

    def save(self, *args, **kwargs):
        """تحديد اللغة الافتراضية"""
        if self.is_default:
            # إلغاء الافتراضية من اللغات الأخرى
            Language.objects.filter(is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def is_rtl(self):
        """فحص إذا كانت اللغة من اليمين لليسار"""
        return self.direction == "rtl"
```

#### ج) نموذج الحرف المتقدم
```python
class Letter(models.Model):
    """
    نموذج الحرف مع دعم متقدم للوسائط
    """
    language = models.ForeignKey(
        Language, 
        on_delete=models.CASCADE, 
        related_name="letters",
        verbose_name="اللغة"
    )
    letter = models.CharField(
        max_length=10,
        verbose_name="الحرف"
    )
    word = models.CharField(
        max_length=100,
        verbose_name="الكلمة"
    )
    color = models.CharField(
        max_length=50, 
        default="bg-blue-300",
        verbose_name="اللون"
    )
    box_color = models.CharField(
        max_length=50, 
        default="bg-blue-400",
        verbose_name="لون الصندوق"
    )
    word_image = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        verbose_name="صورة الكلمة"
    )
    audio_file = models.FileField(
        upload_to="letters/audio/", 
        blank=True, 
        null=True,
        verbose_name="ملف الصوت"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="نشط"
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="الترتيب"
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ("beginner", "مبتدئ"),
            ("intermediate", "متوسط"),
            ("advanced", "متقدم"),
        ],
        default="beginner",
        verbose_name="مستوى الصعوبة"
    )
    phonetic_transcription = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="النطق الصوتي"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الإنشاء"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="تاريخ التحديث"
    )

    class Meta:
        unique_together = ["language", "letter"]
        ordering = ["language", "order", "letter"]
        verbose_name = "حرف"
        verbose_name_plural = "الحروف"

    def __str__(self):
        return f"{self.language.code.upper()}: {self.letter} - {self.word}"

    @property
    def media_url(self):
        """إنشاء رابط الوسائط"""
        if self.audio_file:
            return self.audio_file.url
        return f"/media/{self.word}.wav"

    def get_absolute_url(self):
        """رابط الحرف"""
        return f"/api/{self.language.code}/letters/{self.letter}/"

    def get_levels_count(self):
        """عدد المستويات للحرف"""
        return self.levels.filter(is_active=True).count()

    def get_average_difficulty(self):
        """متوسط صعوبة المستويات"""
        levels = self.levels.filter(is_active=True)
        if not levels:
            return 0
        
        difficulty_scores = {
            "easy": 1,
            "medium": 2,
            "hard": 3
        }
        
        total_score = sum(difficulty_scores.get(level.difficulty, 1) for level in levels)
        return total_score / len(levels)
```

#### د) نموذج المستوى المتقدم
```python
class Level(models.Model):
    """
    نموذج المستوى مع دعم متقدم للتعلم
    """
    language = models.ForeignKey(
        Language, 
        on_delete=models.CASCADE, 
        related_name="levels",
        verbose_name="اللغة"
    )
    letter = models.ForeignKey(
        Letter, 
        on_delete=models.CASCADE, 
        related_name="levels",
        verbose_name="الحرف"
    )
    level_number = models.PositiveIntegerField(
        verbose_name="رقم المستوى"
    )
    test_word = models.CharField(
        max_length=100,
        verbose_name="الكلمة التجريبية"
    )
    word_image = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        verbose_name="صورة الكلمة"
    )
    audio_file = models.FileField(
        upload_to="levels/audio/", 
        blank=True, 
        null=True,
        verbose_name="ملف الصوت"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="نشط"
    )
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ("easy", "سهل"),
            ("medium", "متوسط"),
            ("hard", "صعب"),
        ],
        default="easy",
        verbose_name="الصعوبة"
    )
    target_char_positions = models.JSONField(
        default=list,
        verbose_name="مواضع الحرف المستهدف"
    )
    alternative_words = models.JSONField(
        default=list,
        verbose_name="كلمات بديلة"
    )
    hints = models.TextField(
        blank=True,
        verbose_name="نصائح"
    )
    success_threshold = models.PositiveIntegerField(
        default=60,
        verbose_name="حد النجاح (%)"
    )
    time_limit = models.PositiveIntegerField(
        default=30,
        verbose_name="الحد الزمني (ثانية)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الإنشاء"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="تاريخ التحديث"
    )

    class Meta:
        unique_together = ["language", "letter", "level_number"]
        ordering = ["language", "letter", "level_number"]
        verbose_name = "مستوى"
        verbose_name_plural = "المستويات"

    def __str__(self):
        return f"{self.language.code.upper()}: {self.letter.letter} Level {self.level_number} - {self.test_word}"

    @property
    def media_url(self):
        """إنشاء رابط الوسائط"""
        if self.audio_file:
            return self.audio_file.url
        return f"/media/{self.test_word}.wav"

    def get_absolute_url(self):
        """رابط المستوى"""
        return f"/api/{self.language.code}/levels/{self.letter.letter}/{self.level_number}/"

    def get_target_char_positions(self):
        """الحصول على مواضع الحرف المستهدف"""
        if self.target_char_positions:
            return self.target_char_positions
        
        # حساب مواضع الحرف تلقائياً
        positions = []
        target_char = self.letter.letter
        for i, char in enumerate(self.test_word):
            if char == target_char:
                positions.append(i)
        
        # حفظ المواضع
        self.target_char_positions = positions
        self.save(update_fields=['target_char_positions'])
        
        return positions

    def get_next_level(self):
        """الحصول على المستوى التالي"""
        return Level.objects.filter(
            language=self.language,
            letter=self.letter,
            level_number=self.level_number + 1,
            is_active=True
        ).first()

    def get_previous_level(self):
        """الحصول على المستوى السابق"""
        return Level.objects.filter(
            language=self.language,
            letter=self.letter,
            level_number=self.level_number - 1,
            is_active=True
        ).first()

    def is_completed_by_user(self, user):
        """فحص إذا كان المستخدم أكمل هذا المستوى"""
        # يمكن إضافة منطق تتبع التقدم هنا
        return False
```

### 2. العلاقات بين الجداول والاستعلامات المتقدمة

#### أ) العلاقات الأساسية
```python
# العلاقات بين الجداول
Language (1) ←→ (N) Letter
Letter (1) ←→ (N) Level  
Language (1) ←→ (N) Level
CustomUser (1) ←→ (1) Profile
Skill (1) ←→ (N) Quiz
```

#### ب) الاستعلامات المتقدمة
```python
# استعلامات متقدمة لقاعدة البيانات

class LetterManager(models.Manager):
    """مدير متقدم للحروف"""
    
    def get_letters_with_levels_count(self, language_code):
        """الحصول على الحروف مع عدد مستوياتها"""
        return self.filter(
            language__code=language_code,
            is_active=True
        ).annotate(
            levels_count=Count('levels', filter=Q(levels__is_active=True)),
            completed_levels=Count('levels', filter=Q(levels__is_active=True))
        ).order_by('order')
    
    def get_letters_by_difficulty(self, language_code, difficulty):
        """الحصول على الحروف حسب الصعوبة"""
        return self.filter(
            language__code=language_code,
            is_active=True,
            difficulty_level=difficulty
        ).prefetch_related('levels').order_by('order')
    
    def get_letters_with_progress(self, user, language_code):
        """الحصول على الحروف مع تقدم المستخدم"""
        return self.filter(
            language__code=language_code,
            is_active=True
        ).annotate(
            total_levels=Count('levels', filter=Q(levels__is_active=True)),
            completed_levels=Count(
                'levels',
                filter=Q(
                    levels__is_active=True,
                    levels__userprogress__user=user,
                    levels__userprogress__is_completed=True
                )
            )
        ).order_by('order')

class LevelManager(models.Manager):
    """مدير متقدم للمستويات"""
    
    def get_levels_with_details(self, language_code, letter):
        """الحصول على المستويات مع التفاصيل"""
        return self.filter(
            language__code=language_code,
            letter__letter=letter,
            is_active=True
        ).select_related('letter', 'language').order_by('level_number')
    
    def get_next_available_level(self, user, language_code, letter, current_level):
        """الحصول على المستوى التالي المتاح"""
        return self.filter(
            language__code=language_code,
            letter__letter=letter,
            level_number__gt=current_level,
            is_active=True
        ).exclude(
            userprogress__user=user,
            userprogress__is_completed=False
        ).order_by('level_number').first()
    
    def get_user_progress(self, user, language_code):
        """الحصول على تقدم المستخدم"""
        return self.filter(
            language__code=language_code,
            userprogress__user=user
        ).annotate(
            is_completed=Max('userprogress__is_completed'),
            completion_date=Max('userprogress__completed_at'),
            attempts_count=Count('userprogress'),
            best_score=Max('userprogress__score')
        ).order_by('letter__order', 'level_number')

# استخدام المديرين المتقدمين
class Letter(models.Model):
    # ... الحقول الموجودة ...
    objects = LetterManager()

class Level(models.Model):
    # ... الحقول الموجودة ...
    objects = LevelManager()
```

#### ج) نماذج إضافية لتتبع التقدم
```python
class UserProgress(models.Model):
    """تتبع تقدم المستخدم"""
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name='progress',
        verbose_name="المستخدم"
    )
    level = models.ForeignKey(
        Level, 
        on_delete=models.CASCADE,
        related_name='userprogress',
        verbose_name="المستوى"
    )
    is_completed = models.BooleanField(
        default=False,
        verbose_name="مكتمل"
    )
    score = models.PositiveIntegerField(
        default=0,
        verbose_name="الدرجة"
    )
    attempts_count = models.PositiveIntegerField(
        default=0,
        verbose_name="عدد المحاولات"
    )
    best_pronunciation_score = models.FloatField(
        default=0.0,
        verbose_name="أفضل درجة نطق"
    )
    time_spent = models.PositiveIntegerField(
        default=0,
        verbose_name="الوقت المستغرق (ثانية)"
    )
    completed_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name="تاريخ الإكمال"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الإنشاء"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="تاريخ التحديث"
    )

    class Meta:
        unique_together = ['user', 'level']
        verbose_name = "تقدم المستخدم"
        verbose_name_plural = "تقدم المستخدمين"

    def __str__(self):
        return f"{self.user.username} - {self.level}"

    def update_progress(self, score, pronunciation_score, time_spent):
        """تحديث التقدم"""
        self.attempts_count += 1
        self.score = max(self.score, score)
        self.best_pronunciation_score = max(self.best_pronunciation_score, pronunciation_score)
        self.time_spent += time_spent
        
        if score >= self.level.success_threshold:
            self.is_completed = True
            self.completed_at = timezone.now()
        
        self.save()

class UserAchievement(models.Model):
    """إنجازات المستخدم"""
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name='achievements',
        verbose_name="المستخدم"
    )
    achievement_type = models.CharField(
        max_length=50,
        choices=[
            ('first_level', 'أول مستوى'),
            ('perfect_score', 'درجة مثالية'),
            ('speed_learner', 'متعلم سريع'),
            ('persistent', 'مثابر'),
            ('language_master', 'سيد اللغة'),
        ],
        verbose_name="نوع الإنجاز"
    )
    description = models.TextField(
        verbose_name="وصف الإنجاز"
    )
    earned_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="تاريخ الحصول"
    )

    class Meta:
        unique_together = ['user', 'achievement_type']
        verbose_name = "إنجاز المستخدم"
        verbose_name_plural = "إنجازات المستخدمين"

    def __str__(self):
        return f"{self.user.username} - {self.get_achievement_type_display()}"
```

#### د) استعلامات إحصائية متقدمة
```python
# استعلامات إحصائية للوحة التحكم
class AnalyticsManager:
    """مدير التحليلات والإحصائيات"""
    
    @staticmethod
    def get_user_statistics(user):
        """إحصائيات المستخدم"""
        progress = UserProgress.objects.filter(user=user)
        
        return {
            'total_levels_attempted': progress.count(),
            'completed_levels': progress.filter(is_completed=True).count(),
            'total_score': progress.aggregate(Sum('score'))['score__sum'] or 0,
            'average_score': progress.aggregate(Avg('score'))['score__avg'] or 0,
            'total_time_spent': progress.aggregate(Sum('time_spent'))['time_spent__sum'] or 0,
            'total_attempts': progress.aggregate(Sum('attempts_count'))['attempts_count__sum'] or 0,
            'achievements_count': user.achievements.count(),
        }
    
    @staticmethod
    def get_language_statistics(language_code):
        """إحصائيات اللغة"""
        letters = Letter.objects.filter(language__code=language_code, is_active=True)
        levels = Level.objects.filter(language__code=language_code, is_active=True)
        
        return {
            'total_letters': letters.count(),
            'total_levels': levels.count(),
            'easy_levels': levels.filter(difficulty='easy').count(),
            'medium_levels': levels.filter(difficulty='medium').count(),
            'hard_levels': levels.filter(difficulty='hard').count(),
            'active_users': UserProgress.objects.filter(
                level__language__code=language_code
            ).values('user').distinct().count(),
        }
    
    @staticmethod
    def get_global_statistics():
        """إحصائيات عامة"""
        return {
            'total_users': CustomUser.objects.filter(is_active=True).count(),
            'total_progress_records': UserProgress.objects.count(),
            'total_completed_levels': UserProgress.objects.filter(is_completed=True).count(),
            'total_achievements': UserAchievement.objects.count(),
            'most_popular_language': UserProgress.objects.values(
                'level__language__name'
            ).annotate(
                count=Count('id')
            ).order_by('-count').first(),
        }

# مثال على الاستخدام
analytics = AnalyticsManager()
user_stats = analytics.get_user_statistics(user)
language_stats = analytics.get_language_statistics('ar')
global_stats = analytics.get_global_statistics()
```

## الأمان والحماية

### 1. حماية البيانات

#### أ) تشفير كلمات المرور
- استخدام Django's built-in password hashing
- تشفير قوي لكلمات المرور
- حماية ضد هجمات القوة الغاشمة

#### ب) حماية الجلسات
- استخدام Django Sessions
- إدارة آمنة للجلسات
- حماية ضد هجمات CSRF

### 2. حماية API

#### أ) المصادقة
- Token-based Authentication
- التحقق من صحة التوكن
- إدارة آمنة للجلسات

#### ب) التحكم في الوصول
- صلاحيات مختلفة للمستخدمين
- حماية نقاط النهاية
- التحقق من الهوية

### 3. حماية الملفات

#### أ) رفع الملفات
- التحقق من نوع الملف
- تحديد حجم الملف
- حماية ضد الملفات الضارة

#### ب) تخزين آمن
- تخزين آمن للملفات
- حماية من الوصول غير المصرح
- نسخ احتياطية منتظمة

## الأداء والتحسين

### 1. تحسين قاعدة البيانات

#### أ) الفهارس (Indexes)
- فهارس على الحقول المهمة
- تحسين استعلامات البحث
- تحسين أداء قاعدة البيانات

#### ب) التخزين المؤقت
- استخدام Redis للتخزين المؤقت
- تخزين مؤقت للبيانات المتكررة
- تحسين سرعة الاستجابة

### 2. تحسين الواجهة الأمامية

#### أ) تحميل الكسول (Lazy Loading)
- تحميل المكونات عند الحاجة
- تحسين سرعة التحميل
- تقليل استهلاك الذاكرة

#### ب) تحسين الصور
- ضغط الصور
- استخدام تنسيقات حديثة
- تحسين سرعة التحميل

### 3. تحسين معالجة الصوت

#### أ) معالجة متوازية
- استخدام Celery للمهام الخلفية
- معالجة متوازية للصوت
- تحسين الأداء

#### ب) تحسين النموذج
- استخدام نموذج Whisper المحسن
- تحسين دقة التحليل
- تقليل وقت المعالجة

## النشر والتشغيل

### 1. إعداد Docker

#### أ) Dockerfile للباك إند
```dockerfile
FROM python:3.11-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

#### ب) Dockerfile للفرونت إند
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

### 2. Docker Compose

#### أ) الخدمات
- **database**: MySQL 8.0
- **backend**: Django Application
- **frontend**: React Application
- **redis**: Redis Cache
- **celery**: Background Tasks
- **phpmyadmin**: Database Management

#### ب) الشبكة
- شبكة داخلية للخدمات
- منافذ مخصصة لكل خدمة
- اتصال آمن بين الخدمات

### 3. متغيرات البيئة

#### أ) متغيرات Django
```env
SECRET_KEY=your-secret-key
DEBUG=True
DB_ENGINE=django.db.backends.mysql
DB_NAME=pronunciation_db
DB_USER=django
DB_PASSWORD=django123
```

#### ب) متغيرات البريد الإلكتروني
```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## الصيانة والدعم

### 1. النسخ الاحتياطية

#### أ) قاعدة البيانات
- نسخ احتياطية يومية
- تخزين آمن للنسخ
- إجراءات استعادة

#### ب) الملفات
- نسخ احتياطية للملفات
- حماية من فقدان البيانات
- إجراءات استعادة

### 2. المراقبة

#### أ) مراقبة الأداء
- مراقبة استجابة الخادم
- مراقبة قاعدة البيانات
- مراقبة الذاكرة

#### ب) مراقبة الأخطاء
- تسجيل الأخطاء
- تنبيهات فورية
- إجراءات تصحيح

### 3. التحديثات

#### أ) تحديثات الأمان
- تحديثات دورية
- إصلاح الثغرات
- تحسين الأمان

#### ب) تحديثات الميزات
- إضافة ميزات جديدة
- تحسين الواجهة
- تحسين الأداء

## الخلاصة

هذا المشروع يمثل تطبيقاً متكاملاً لتعليم وتصحيح النطق باستخدام الذكاء الاصطناعي. يتميز بالبنية التقنية المتقدمة والأمان العالي والأداء الممتاز. المشروع يدعم اللغتين العربية والإنجليزية ويوفر تجربة مستخدم ممتازة مع تقنيات الذكاء الاصطناعي الحديثة.

### النقاط الرئيسية:
1. **التقنيات المتقدمة**: استخدام Whisper للذكاء الاصطناعي
2. **الأمان العالي**: حماية شاملة للبيانات والمستخدمين
3. **الأداء الممتاز**: تحسين شامل للأداء
4. **سهولة النشر**: استخدام Docker للتشغيل
5. **قابلية التوسع**: بنية مرنة وقابلة للتطوير

### التطوير المستقبلي:
1. إضافة لغات جديدة
2. تحسين دقة الذكاء الاصطناعي
3. إضافة ميزات تعليمية متقدمة
4. تطوير تطبيق موبايل
5. إضافة تحليلات متقدمة للتقدم

### 8. تدريب نموذج TTS مخصص (Custom TTS Model Training)

#### أ) إعداد البيانات للتدريب

**1. هيكل المجلدات المطلوبة:**
```python
"""
هيكل المجلدات لتدريب نموذج TTS مخصص
"""
import os
import shutil
from pathlib import Path

class TTSDataPreparation:
    def __init__(self, base_dir="./custom_tts_data"):
        self.base_dir = Path(base_dir)
        self.setup_directory_structure()
    
    def setup_directory_structure(self):
        """إنشاء هيكل المجلدات المطلوبة"""
        directories = [
            "raw_audio",           # الملفات الصوتية الأصلية
            "processed_audio",      # الملفات الصوتية المعالجة
            "transcripts",          # نصوص النطق
            "metadata",            # ملفات البيانات الوصفية
            "validation",          # بيانات التحقق
            "test",                # بيانات الاختبار
            "models",              # النماذج المدربة
            "logs",                # سجلات التدريب
            "checkpoints"          # نقاط التحقق
        ]
        
        for dir_name in directories:
            dir_path = self.base_dir / dir_name
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"✅ تم إنشاء المجلد: {dir_path}")
    
    def organize_audio_files(self, source_dir, target_format="wav"):
        """
        تنظيم الملفات الصوتية وتحويلها إلى التنسيق المطلوب
        """
        source_path = Path(source_dir)
        target_dir = self.base_dir / "raw_audio"
        
        # دعم التنسيقات المختلفة
        supported_formats = ['.mp3', '.wav', '.flac', '.m4a', '.ogg']
        
        for audio_file in source_path.rglob("*"):
            if audio_file.suffix.lower() in supported_formats:
                # تحويل إلى WAV إذا لزم الأمر
                if audio_file.suffix.lower() != '.wav':
                    converted_file = self.convert_to_wav(audio_file, target_dir)
                else:
                    converted_file = target_dir / audio_file.name
                    shutil.copy2(audio_file, converted_file)
                
                print(f"✅ تم معالجة: {audio_file.name}")
        
        return target_dir
    
    def convert_to_wav(self, input_file, output_dir, sample_rate=22050):
        """
        تحويل الملفات الصوتية إلى تنسيق WAV
        """
        import librosa
        import soundfile as sf
        
        # تحميل الصوت
        audio, sr = librosa.load(input_file, sr=sample_rate)
        
        # حفظ كـ WAV
        output_file = output_dir / f"{input_file.stem}.wav"
        sf.write(output_file, audio, sample_rate)
        
        return output_file

# مثال على الاستخدام
data_prep = TTSDataPreparation("./my_custom_tts")
data_prep.organize_audio_files("./my_voice_samples")
```

**2. إعداد النصوص والنطق:**
```python
class TranscriptPreparation:
    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.transcripts_dir = self.data_dir / "transcripts"
        self.metadata_dir = self.data_dir / "metadata"
    
    def create_transcript_file(self, audio_file, text, language="ar"):
        """
        إنشاء ملف نصي للنطق
        """
        transcript_file = self.transcripts_dir / f"{audio_file.stem}.txt"
        
        with open(transcript_file, 'w', encoding='utf-8') as f:
            f.write(text.strip())
        
        return transcript_file
    
    def create_metadata_file(self, audio_files, transcripts):
        """
        إنشاء ملف البيانات الوصفية للتدريب
        """
        metadata_file = self.metadata_dir / "metadata.csv"
        
        with open(metadata_file, 'w', encoding='utf-8') as f:
            f.write("audio_file,text,language\n")
            
            for audio_file, text in zip(audio_files, transcripts):
                relative_path = audio_file.relative_to(self.data_dir / "processed_audio")
                f.write(f"{relative_path},{text},{language}\n")
        
        return metadata_file
    
    def validate_transcripts(self, audio_files, transcripts):
        """
        التحقق من صحة النصوص والملفات الصوتية
        """
        import librosa
        
        valid_pairs = []
        
        for audio_file, text in zip(audio_files, transcripts):
            try:
                # فحص الملف الصوتي
                audio, sr = librosa.load(audio_file, sr=None)
                duration = len(audio) / sr
                
                # فحص النص
                if len(text.strip()) > 0 and duration > 0.5 and duration < 30:
                    valid_pairs.append((audio_file, text))
                else:
                    print(f"⚠️ تم تجاهل: {audio_file.name} - مدة: {duration:.2f}s")
                    
            except Exception as e:
                print(f"❌ خطأ في: {audio_file.name} - {e}")
        
        return valid_pairs

# مثال على الاستخدام
transcript_prep = TranscriptPreparation("./my_custom_tts")

# إنشاء النصوص
audio_files = list(Path("./my_custom_tts/processed_audio").glob("*.wav"))
transcripts = [
    "مرحبا كيف حالك",
    "أنا أتعلم اللغة العربية",
    "هذا تطبيق رائع",
    "شكرا لك على المساعدة"
]

# إنشاء ملفات النصوص
for audio_file, text in zip(audio_files, transcripts):
    transcript_prep.create_transcript_file(audio_file, text)

# إنشاء ملف البيانات الوصفية
metadata_file = transcript_prep.create_metadata_file(audio_files, transcripts)
```

#### ب) معالجة البيانات الصوتية

**1. تحسين جودة الصوت:**
```python
class AudioPreprocessor:
    def __init__(self, sample_rate=22050, target_duration=10):
        self.sample_rate = sample_rate
        self.target_duration = target_duration
    
    def preprocess_audio(self, input_file, output_file):
        """
        معالجة شاملة للملف الصوتي
        """
        import librosa
        import soundfile as sf
        import numpy as np
        from scipy import signal
        
        # تحميل الصوت
        audio, sr = librosa.load(input_file, sr=self.sample_rate)
        
        # إزالة الضوضاء
        audio_denoised = self.remove_noise(audio)
        
        # تطبيع مستوى الصوت
        audio_normalized = self.normalize_audio(audio_denoised)
        
        # إزالة الصمت
        audio_trimmed = self.trim_silence(audio_normalized)
        
        # ضبط المدة
        audio_padded = self.pad_or_trim(audio_trimmed)
        
        # حفظ الملف المعالج
        sf.write(output_file, audio_padded, self.sample_rate)
        
        return output_file
    
    def remove_noise(self, audio, noise_reduce_level=0.1):
        """
        إزالة الضوضاء باستخدام فلتر مرشح
        """
        from scipy import signal
        
        # تصميم فلتر مرشح
        nyquist = self.sample_rate / 2
        low = 80 / nyquist
        high = 8000 / nyquist
        
        b, a = signal.butter(4, [low, high], btype='band')
        filtered_audio = signal.filtfilt(b, a, audio)
        
        return filtered_audio
    
    def normalize_audio(self, audio, target_rms=0.1):
        """
        تطبيع مستوى الصوت
        """
        rms = np.sqrt(np.mean(audio**2))
        if rms > 0:
            normalized_audio = audio * (target_rms / rms)
            # قص القمم
            normalized_audio = np.clip(normalized_audio, -0.95, 0.95)
            return normalized_audio
        return audio
    
    def trim_silence(self, audio, threshold=0.01):
        """
        إزالة الصمت من بداية ونهاية الملف
        """
        # إزالة الصمت من البداية
        start_idx = np.where(np.abs(audio) > threshold)[0]
        if len(start_idx) > 0:
            audio = audio[start_idx[0]:]
        
        # إزالة الصمت من النهاية
        end_idx = np.where(np.abs(audio) > threshold)[0]
        if len(end_idx) > 0:
            audio = audio[:end_idx[-1] + 1]
        
        return audio
    
    def pad_or_trim(self, audio):
        """
        ضبط مدة الصوت إلى المدة المطلوبة
        """
        target_length = self.sample_rate * self.target_duration
        
        if len(audio) > target_length:
            # تقصير الصوت
            audio = audio[:target_length]
        elif len(audio) < target_length:
            # إطالة الصوت بالصمت
            padding_length = target_length - len(audio)
            padding = np.zeros(padding_length)
            audio = np.concatenate([audio, padding])
        
        return audio

# مثال على الاستخدام
preprocessor = AudioPreprocessor(sample_rate=22050, target_duration=10)

# معالجة جميع الملفات الصوتية
raw_audio_dir = Path("./my_custom_tts/raw_audio")
processed_audio_dir = Path("./my_custom_tts/processed_audio")

for audio_file in raw_audio_dir.glob("*.wav"):
    output_file = processed_audio_dir / audio_file.name
    preprocessor.preprocess_audio(audio_file, output_file)
    print(f"✅ تم معالجة: {audio_file.name}")
```

**2. تقسيم البيانات:**
```python
class DataSplitter:
    def __init__(self, data_dir, train_ratio=0.8, val_ratio=0.1, test_ratio=0.1):
        self.data_dir = Path(data_dir)
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
    
    def split_data(self, metadata_file):
        """
        تقسيم البيانات إلى تدريب وتحقق واختبار
        """
        import pandas as pd
        from sklearn.model_selection import train_test_split
        
        # قراءة البيانات الوصفية
        df = pd.read_csv(metadata_file)
        
        # تقسيم البيانات
        train_data, temp_data = train_test_split(
            df, test_size=(1 - self.train_ratio), random_state=42
        )
        
        val_data, test_data = train_test_split(
            temp_data, test_size=self.test_ratio/(self.val_ratio + self.test_ratio), 
            random_state=42
        )
        
        # حفظ البيانات المقسمة
        train_file = self.data_dir / "metadata" / "train.csv"
        val_file = self.data_dir / "metadata" / "val.csv"
        test_file = self.data_dir / "metadata" / "test.csv"
        
        train_data.to_csv(train_file, index=False)
        val_data.to_csv(val_file, index=False)
        test_data.to_csv(test_file, index=False)
        
        print(f"📊 تقسيم البيانات:")
        print(f"   التدريب: {len(train_data)} عينة")
        print(f"   التحقق: {len(val_data)} عينة")
        print(f"   الاختبار: {len(test_data)} عينة")
        
        return train_file, val_file, test_file

# مثال على الاستخدام
splitter = DataSplitter("./my_custom_tts")
train_file, val_file, test_file = splitter.split_data("./my_custom_tts/metadata/metadata.csv")
```

#### ج) إعداد التدريب

**1. تكوين النموذج:**
```python
class TTSModelConfig:
    def __init__(self, model_type="tacotron2"):
        self.model_type = model_type
        self.config = self.get_default_config()
    
    def get_default_config(self):
        """
        الحصول على التكوين الافتراضي للنموذج
        """
        if self.model_type == "tacotron2":
            return {
                "model": {
                    "encoder": {
                        "encoder_embedding_dim": 512,
                        "encoder_n_convolutions": 3,
                        "encoder_kernel_size": 5
                    },
                    "decoder": {
                        "decoder_rnn_dim": 1024,
                        "decoder_layer_norm": True,
                        "decoder_dropout": 0.1
                    },
                    "postnet": {
                        "postnet_embedding_dim": 512,
                        "postnet_kernel_size": 5,
                        "postnet_n_convolutions": 5
                    }
                },
                "training": {
                    "batch_size": 32,
                    "learning_rate": 0.001,
                    "epochs": 1000,
                    "gradient_clip_thresh": 1.0,
                    "weight_decay": 1e-6
                },
                "audio": {
                    "sample_rate": 22050,
                    "hop_length": 256,
                    "win_length": 1024,
                    "n_mel_channels": 80,
                    "mel_fmin": 0.0,
                    "mel_fmax": 8000.0
                }
            }
        elif self.model_type == "fastspeech2":
            return {
                "model": {
                    "encoder": {
                        "encoder_dim": 256,
                        "encoder_n_layer": 4,
                        "encoder_head": 2
                    },
                    "decoder": {
                        "decoder_dim": 256,
                        "decoder_n_layer": 4,
                        "decoder_head": 2
                    }
                },
                "training": {
                    "batch_size": 16,
                    "learning_rate": 0.0001,
                    "epochs": 1000
                }
            }
        
        return {}
    
    def save_config(self, config_path):
        """
        حفظ تكوين النموذج
        """
        import json
        
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)
        
        print(f"✅ تم حفظ التكوين في: {config_path}")
    
    def load_config(self, config_path):
        """
        تحميل تكوين النموذج
        """
        import json
        
        with open(config_path, 'r', encoding='utf-8') as f:
            self.config = json.load(f)
        
        return self.config

# مثال على الاستخدام
config = TTSModelConfig("tacotron2")
config.save_config("./my_custom_tts/models/config.json")
```

**2. إعداد التدريب:**
```python
class TTSTrainer:
    def __init__(self, data_dir, model_config, output_dir):
        self.data_dir = Path(data_dir)
        self.config = model_config
        self.output_dir = Path(output_dir)
        self.setup_training_environment()
    
    def setup_training_environment(self):
        """
        إعداد بيئة التدريب
        """
        # إنشاء المجلدات المطلوبة
        (self.output_dir / "checkpoints").mkdir(parents=True, exist_ok=True)
        (self.output_dir / "logs").mkdir(parents=True, exist_ok=True)
        (self.output_dir / "models").mkdir(parents=True, exist_ok=True)
        
        # إعداد TensorBoard
        self.log_dir = self.output_dir / "logs"
        
        print("✅ تم إعداد بيئة التدريب")
    
    def prepare_dataset(self, metadata_file):
        """
        إعداد مجموعة البيانات للتدريب
        """
        import pandas as pd
        
        df = pd.read_csv(metadata_file)
        
        # إنشاء قائمة الملفات الصوتية والنصوص
        audio_files = []
        texts = []
        
        for _, row in df.iterrows():
            audio_path = self.data_dir / "processed_audio" / row['audio_file']
            if audio_path.exists():
                audio_files.append(str(audio_path))
                texts.append(row['text'])
        
        return audio_files, texts
    
    def create_vocabulary(self, texts):
        """
        إنشاء مفردات النموذج
        """
        # تجميع جميع الأحرف المستخدمة
        all_chars = set()
        for text in texts:
            all_chars.update(text)
        
        # إنشاء مفردات مرتبة
        vocab = ['<pad>', '<unk>', '<sos>', '<eos>'] + sorted(list(all_chars))
        
        # حفظ المفردات
        vocab_file = self.output_dir / "vocab.txt"
        with open(vocab_file, 'w', encoding='utf-8') as f:
            for char in vocab:
                f.write(char + '\n')
        
        return vocab, vocab_file
    
    def train_model(self, train_file, val_file, resume_from=None):
        """
        تدريب النموذج
        """
        print("🚀 بدء تدريب النموذج...")
        
        # إعداد البيانات
        train_audio, train_texts = self.prepare_dataset(train_file)
        val_audio, val_texts = self.prepare_dataset(val_file)
        
        # إنشاء المفردات
        vocab, vocab_file = self.create_vocabulary(train_texts + val_texts)
        
        # إعداد النموذج
        model = self.setup_model(vocab)
        
        # إعداد التدريب
        trainer = self.setup_trainer(model)
        
        # بدء التدريب
        trainer.train(
            train_audio=train_audio,
            train_texts=train_texts,
            val_audio=val_audio,
            val_texts=val_texts,
            resume_from=resume_from
        )
        
        print("✅ تم الانتهاء من التدريب")
    
    def setup_model(self, vocab):
        """
        إعداد النموذج
        """
        # هنا يتم إعداد النموذج حسب النوع المختار
        # يمكن استخدام TTS أو Coqui TTS أو أي مكتبة أخرى
        pass
    
    def setup_trainer(self, model):
        """
        إعداد المدرب
        """
        # إعداد المدرب مع المعاملات المطلوبة
        pass

# مثال على الاستخدام
trainer = TTSTrainer(
    data_dir="./my_custom_tts",
    model_config=config.config,
    output_dir="./my_custom_tts/models"
)

trainer.train_model(
    train_file="./my_custom_tts/metadata/train.csv",
    val_file="./my_custom_tts/metadata/val.csv"
)
```

#### د) تقييم النموذج والتحسين

**1. تقييم جودة النموذج:**
```python
class TTSEvaluator:
    def __init__(self, model_path, config_path):
        self.model_path = Path(model_path)
        self.config = self.load_config(config_path)
        self.model = self.load_model()
    
    def evaluate_model(self, test_file):
        """
        تقييم النموذج على بيانات الاختبار
        """
        import pandas as pd
        from scipy.stats import pearsonr
        import numpy as np
        
        df = pd.read_csv(test_file)
        results = []
        
        for _, row in df.iterrows():
            # توليد الكلام
            generated_audio = self.generate_speech(row['text'])
            
            # تحميل الكلام المرجعي
            reference_audio = self.load_audio(row['audio_file'])
            
            # حساب مقاييس الجودة
            metrics = self.calculate_quality_metrics(generated_audio, reference_audio)
            results.append(metrics)
        
        # حساب المتوسطات
        avg_metrics = self.calculate_average_metrics(results)
        
        return avg_metrics
    
    def calculate_quality_metrics(self, generated_audio, reference_audio):
        """
        حساب مقاييس جودة الصوت
        """
        import librosa
        from scipy.stats import pearsonr
        
        # تحويل إلى ميزات Mel-spectrogram
        gen_mel = librosa.feature.melspectrogram(
            y=generated_audio, 
            sr=self.config['audio']['sample_rate']
        )
        ref_mel = librosa.feature.melspectrogram(
            y=reference_audio, 
            sr=self.config['audio']['sample_rate']
        )
        
        # حساب MSE
        mse = np.mean((gen_mel - ref_mel) ** 2)
        
        # حساب MAE
        mae = np.mean(np.abs(gen_mel - ref_mel))
        
        # حساب معامل الارتباط
        correlation = pearsonr(gen_mel.flatten(), ref_mel.flatten())[0]
        
        return {
            'mse': mse,
            'mae': mae,
            'correlation': correlation
        }
    
    def calculate_average_metrics(self, results):
        """
        حساب متوسط المقاييس
        """
        avg_metrics = {}
        for key in results[0].keys():
            values = [r[key] for r in results]
            avg_metrics[key] = np.mean(values)
            avg_metrics[f"{key}_std"] = np.std(values)
        
        return avg_metrics
    
    def generate_speech(self, text):
        """
        توليد كلام من النص
        """
        # استخدام النموذج المدرب لتوليد الكلام
        pass
    
    def load_audio(self, audio_file):
        """
        تحميل الملف الصوتي
        """
        import librosa
        audio, _ = librosa.load(audio_file, sr=self.config['audio']['sample_rate'])
        return audio

# مثال على الاستخدام
evaluator = TTSEvaluator(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json"
)

metrics = evaluator.evaluate_model("./my_custom_tts/metadata/test.csv")
print("📊 نتائج التقييم:")
for metric, value in metrics.items():
    print(f"   {metric}: {value:.4f}")
```

**2. تحسين النموذج:**
```python
class TTSOptimizer:
    def __init__(self, model_path, config_path):
        self.model_path = Path(model_path)
        self.config = self.load_config(config_path)
    
    def hyperparameter_optimization(self, train_file, val_file):
        """
        تحسين المعاملات الفائقة
        """
        import optuna
        
        def objective(trial):
            # اقتراح قيم للمعاملات
            learning_rate = trial.suggest_float('learning_rate', 1e-5, 1e-2, log=True)
            batch_size = trial.suggest_categorical('batch_size', [8, 16, 32, 64])
            encoder_dim = trial.suggest_categorical('encoder_dim', [256, 512, 1024])
            
            # تحديث التكوين
            self.config['training']['learning_rate'] = learning_rate
            self.config['training']['batch_size'] = batch_size
            self.config['model']['encoder']['encoder_embedding_dim'] = encoder_dim
            
            # تدريب النموذج
            trainer = TTSTrainer(
                data_dir="./my_custom_tts",
                model_config=self.config,
                output_dir=f"./my_custom_tts/optimization/trial_{trial.number}"
            )
            
            # تقييم النموذج
            evaluator = TTSEvaluator(
                model_path=trainer.output_dir / "best_model.pth",
                config_path=trainer.output_dir / "config.json"
            )
            
            metrics = evaluator.evaluate_model(val_file)
            
            # إرجاع قيمة الهدف (MSE أقل = أفضل)
            return metrics['mse']
        
        # إنشاء دراسة Optuna
        study = optuna.create_study(direction='minimize')
        study.optimize(objective, n_trials=20)
        
        # الحصول على أفضل المعاملات
        best_params = study.best_params
        print("🎯 أفضل المعاملات:")
        for param, value in best_params.items():
            print(f"   {param}: {value}")
        
        return best_params
    
    def model_ensemble(self, model_paths, weights=None):
        """
        دمج عدة نماذج لتحسين الأداء
        """
        if weights is None:
            weights = [1.0 / len(model_paths)] * len(model_paths)
        
        models = []
        for model_path in model_paths:
            model = self.load_model(model_path)
            models.append(model)
        
        def ensemble_generate(text):
            outputs = []
            for model, weight in zip(models, weights):
                output = model.generate(text)
                outputs.append(output * weight)
            
            # دمج المخرجات
            ensemble_output = sum(outputs)
            return ensemble_output
        
        return ensemble_generate

# مثال على الاستخدام
optimizer = TTSOptimizer(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json"
)

# تحسين المعاملات الفائقة
best_params = optimizer.hyperparameter_optimization(
    train_file="./my_custom_tts/metadata/train.csv",
    val_file="./my_custom_tts/metadata/val.csv"
)

# دمج النماذج
model_paths = [
    "./my_custom_tts/models/model_1.pth",
    "./my_custom_tts/models/model_2.pth",
    "./my_custom_tts/models/model_3.pth"
]

ensemble_model = optimizer.model_ensemble(model_paths)
```

#### هـ) استخدام النموذج المدرب

**1. تحميل واستخدام النموذج:**
```python
class CustomTTSInference:
    def __init__(self, model_path, config_path, vocab_path):
        self.model_path = Path(model_path)
        self.config = self.load_config(config_path)
        self.vocab = self.load_vocabulary(vocab_path)
        self.model = self.load_model()
    
    def load_vocabulary(self, vocab_path):
        """
        تحميل المفردات
        """
        with open(vocab_path, 'r', encoding='utf-8') as f:
            vocab = [line.strip() for line in f.readlines()]
        return vocab
    
    def text_to_sequence(self, text):
        """
        تحويل النص إلى تسلسل أرقام
        """
        char_to_id = {char: i for i, char in enumerate(self.vocab)}
        sequence = [char_to_id.get(char, char_to_id['<unk>']) for char in text]
        sequence = [char_to_id['<sos>']] + sequence + [char_to_id['<eos>']]
        return sequence
    
    def generate_speech(self, text, output_path=None):
        """
        توليد كلام من النص
        """
        # تحويل النص إلى تسلسل
        sequence = self.text_to_sequence(text)
        
        # توليد الكلام
        with torch.no_grad():
            audio = self.model.inference(sequence)
        
        # حفظ الملف
        if output_path:
            import soundfile as sf
            sf.write(output_path, audio, self.config['audio']['sample_rate'])
        
        return audio
    
    def batch_generate(self, texts, output_dir):
        """
        توليد كلام لعدة نصوص دفعة واحدة
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        results = []
        for i, text in enumerate(texts):
            output_path = output_dir / f"generated_{i:03d}.wav"
            audio = self.generate_speech(text, output_path)
            results.append({
                'text': text,
                'audio': audio,
                'file_path': output_path
            })
        
        return results

# مثال على الاستخدام
custom_tts = CustomTTSInference(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json",
    vocab_path="./my_custom_tts/models/vocab.txt"
)

# توليد كلام لكلمة واحدة
audio = custom_tts.generate_speech("مرحبا كيف حالك", "output.wav")

# توليد كلام لعدة كلمات
texts = [
    "أنا أتعلم اللغة العربية",
    "هذا تطبيق رائع",
    "شكرا لك على المساعدة"
]

results = custom_tts.batch_generate(texts, "./generated_audio")
```

**2. واجهة برمجة التطبيقات للنموذج المخصص:**
```python
from flask import Flask, request, jsonify, send_file
import io

app = Flask(__name__)

# تحميل النموذج المخصص
custom_tts = CustomTTSInference(
    model_path="./my_custom_tts/models/best_model.pth",
    config_path="./my_custom_tts/models/config.json",
    vocab_path="./my_custom_tts/models/vocab.txt"
)

@app.route('/api/custom-tts/generate', methods=['POST'])
def generate_custom_speech():
    """
    توليد كلام باستخدام النموذج المخصص
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        language = data.get('language', 'ar')
        
        if not text:
            return jsonify({'error': 'النص مطلوب'}), 400
        
        # توليد الكلام
        audio = custom_tts.generate_speech(text)
        
        # تحويل إلى ملف صوتي
        import soundfile as sf
        buffer = io.BytesIO()
        sf.write(buffer, audio, custom_tts.config['audio']['sample_rate'], format='WAV')
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='audio/wav',
            as_attachment=True,
            download_name=f'custom_tts_{text[:10]}.wav'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/custom-tts/batch-generate', methods=['POST'])
def batch_generate_custom_speech():
    """
    توليد كلام لعدة نصوص دفعة واحدة
    """
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        language = data.get('language', 'ar')
        
        if not texts:
            return jsonify({'error': 'قائمة النصوص مطلوبة'}), 400
        
        # توليد الكلام
        results = custom_tts.batch_generate(texts, "./temp_audio")
        
        # إنشاء ملف ZIP
        import zipfile
        import os
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for result in results:
                zip_file.write(result['file_path'], result['file_path'].name)
        
        zip_buffer.seek(0)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='custom_tts_batch.zip'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
```

هذا القسم يوفر دليلاً شاملاً لتدريب نموذج TTS مخصص من الصفر، بدءاً من إعداد البيانات وانتهاءً باستخدام النموذج المدرب في التطبيق.

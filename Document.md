# Chi tiết UI breakdown cho app gym:

# 📱 AI FITNESS APP — USER FLOW (MATCH WITH DESIGN MAP)

> Design reference: screen 01 → 04 → 05 → 06 → 07
> 
> 
> **Style:** Guided workout + AI coach (Alan)
> 
> **Tone:** Friendly, motivational, minimal
> 

---

## 🟢 SCREEN 01 — INTRO / COACH GREETING (First Screen)

**UI (theo ảnh):**

- Text:
    
    > “Hey, I am Alan,
    your trainer, now
    let’s get to work!”
    > 
- Avatar huấn luyện viên (Alan)
- CTA button:
    - **Start**

**Purpose**

- Tạo cảm giác **có người đồng hành**
- Không phải tutorial, chỉ là *warm welcome*

**Action**

- Tap **Start** → Screen 04

---

## 🟢 SCREEN 04 — HOME / TAP TO START

**UI**

- Text trên:
    - `tap to start`
- Icon trung tâm (flame / workout icon)
- Subtitle:
    - `Default setup for workout`
- Workout structure:
    - Sets / Reps / Break (03 / 13 / 12…)

**Purpose**

- Chuẩn bị tinh thần
- Không cần chỉnh gì → dùng default

**Action**

- Tap icon hoặc text **tap to start**
- → bắt đầu workout

---

## 🟡 SCREEN 05 — ACTIVE WORKOUT (DETECTING / COUNTING)

**UI**

- Circular progress ring
- Rep counter:
    - **10 / 15**
- Text động:
    - “skibid 5 more!” (motivation copy)
- Workout name:
    - `Full Body Warm Up`
- Timer:
    - `02:22`
- Progress bar bên dưới

**Purpose**

- Đây là **Detecting Screen** phiên bản guided
- AI đang:
    - đếm rep
    - theo dõi tiến độ

**Interaction**

- Auto count
- Không cần user thao tác

---

## 🟡 SCREEN 06 — ACTIVE WORKOUT (MOTIVATION STATE)

**UI**

- Avatar Alan nằm trong vòng tròn
- Motivational text:
    - `don’t you give up`
- Progress ring vẫn tiếp tục
- Timer + progress giữ nguyên

**Purpose**

- Tạo cảm giác **coach đang nhìn + cổ vũ**
- Không phải screen mới → là **state khác của Screen 05**

👉 Screen 05 & 06 = **CÙNG 1 SCREEN, KHÁC STATE**

---

## 🟢 SCREEN 07 — WORKOUT COMPLETED

**UI**

- Title:
    - `Great job!`
- Badge / icon thành tích
- Stats:
    - Total Reps: **20**
    - Calories Burnt: **233**
- CTA buttons:
    - **Next Exercise**
    - **Your History**

**Purpose**

- Reward dopamine
- Cho user 2 hướng rõ ràng:
    - tiếp tục
    - xem lại

**Action**

- Next Exercise → quay lại Active Workout
- Your History → Progress screen

---

## 🟣 PROGRESS / HISTORY SCREEN

**UI**

- Header:
    - `Progress`
- Stats (5/12, 7/30…)
- Categories:
    - Abs Workout
    - Arms Workout
    - Legs Workout
- Exercise cards:
    - Abs Workout
    - Lower Back Exercise…

**Purpose**

- Passive value
- Không bắt user xem mỗi ngày

---

# 🔁 USER FLOW TỔNG KẾT (MATCH DESIGN)

```
Intro (Alan)
 → Tap to Start
   → ActiveWorkout(Detecting / Counting)
     → MotivationState(Alan encouragement)
       → Workout Completed
         → Next Exercise
         → OR History / Progress

```

---

## 🧠 QUY TẮC UX (RẤT QUAN TRỌNG – THEO MAP)

- ❌ Không có Cancel trên main flow
- ❌ Không có Pause rõ ràng (có thể gesture sau)
- ✅ Trải nghiệm **guided**, không phải free-form
- ✅ Alan là “linh hồn” app

---

# 📱 NEW SCREEN — SETUP (OPTIONAL, QUICK)

## 📍 Vị trí trong flow

```
Intro (Alan)
 → Setup (optional)
   → Tap to Start
     → Active Workout

```

👉 User:

- Lần đầu → vào Setup
- Lần sau → có thể skip (giữ default)

---

## 🟢 SCREEN — SETUP

### 1️⃣ CHOOSE YOUR PERSONAL TRAINER (VOICE)

**UI (đúng theo ảnh bạn gửi):**

- Title:
    
    > Choose your Personal Trainer
    > 
- 2 avatar:
    - **ALAN** (male)
    - **LINA** (female)
- Avatar được chọn:
    - viền tím
    - tên highlight

**Logic**

- Chỉ ảnh hưởng:
    - giọng nói
    - câu động viên
- ❌ Không ảnh hưởng thuật toán đếm

👉 Cảm giác: *“chọn người đồng hành”*, không phải setting kỹ thuật.

---

### 2️⃣ REP INTERVAL (THỜI GIAN GIỮ MỖI REP)

**Copy chỉnh lại cho rõ hơn (UX-friendly):**

> Choose rep pace
> 
> 
> Control how long you hold each rep
> 

**Options (buttons):**

- 1s – Fast
- 2s – Normal (default)
- 3s – Slow
- 4s – Hold

👉 **Rất quan trọng:**

Đừng ghi đơn thuần “2s / 3s / 4s”

→ phải gắn **ý nghĩa hành vi** (Fast / Hold / Slow)
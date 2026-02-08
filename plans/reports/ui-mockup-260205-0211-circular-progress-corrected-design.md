# UI Mockup: Circular Progress Bar - Corrected Design

**Date:** 2026-02-05
**Based on:** User screenshots analysis
**Purpose:** Confirm design before React Native implementation

---

## 🎨 Visual Mockup (Text-based)

```
        ○  ← Marker dot (12h position)
       ╱ ╲
      ╱   ╲
     ║     ║  ← Gray background ring
    ╱ 15/15 ╲  ← Purple text
   ○  ─────  ● ← Moving dot (white, larger)
   │         │
   │         ○  ← Marker dot (3h)
   │         │
    ╲       ╱
     ╲     ╱
      ╲   ╱
        ○  ← Marker dot (6h)

○ ← Marker dot (9h)
```

---

## 📍 Element Specifications

### 1. Background Ring (Gray)
- **Color:** Light gray (#CFCFE2 or similar)
- **Radius:** 42 (viewBox units)
- **Stroke Width:** 15
- **Fill:** Transparent
- **Position:** Full circle, always visible

### 2. Progress Ring (Purple)
- **Color:** Purple (#7C4DFF)
- **Radius:** 42 (same as background)
- **Stroke Width:** 15
- **Fill:** Transparent
- **Stroke Dasharray:** 264 (circumference)
- **Stroke Dashoffset:** Animated based on progress%
- **Stroke Linecap:** Round
- **Transform:** rotate(-90) to start from top

### 3. Marker Dots (4x White, Static)
**Position:** INSIDE the ring (inner edge)

**Calculation:**
```
dotRadius = radius - strokeWidth/2 - 2
          = 42 - 15/2 - 2
          = 32.5
```

**Positions (clock positions):**
- **12h (top):** angle = -90°, x = 50, y ≈ 0.5
- **3h (right):** angle = 0°, x ≈ 99.5, y = 50
- **6h (bottom):** angle = 90°, x = 50, y ≈ 99.5
- **9h (left):** angle = 180°, x ≈ 0.5, y = 50

**Specs:**
- **Radius:** 3.5 (viewBox units) → visible but not huge
- **Fill:** White (#FFFFFF)
- **Stroke:** Purple (#7C4DFF)
- **Stroke Width:** 0.5
- **Purpose:** Static orientation markers, always visible

### 4. Moving Progress Dot (1x White, Dynamic)
**Position:** CENTER of stroke path (follows progress)

**Calculation:**
```
dotRadius = radius + strokeWidth/2
          = 42 + 15/2
          = 49.5
```

**Position Formula:**
```javascript
angle = -90 + (progress% * 360 / 100)
x = 50 + dotRadius * cos(angle * π/180)
y = 50 + dotRadius * sin(angle * π/180)
```

**Specs:**
- **Radius:** 4.5 (viewBox units) → larger than markers
- **Fill:** White (#FFFFFF)
- **Stroke:** Purple (#7C4DFF)
- **Stroke Width:** 0.8 (thicker than markers)
- **Visibility:** Only when timer > 0
- **Animation:** Smooth linear, synced with progress ring

### 5. Center Text
- **Content:** `${current}/${total}` (e.g., "10/15", "15/15")
- **Color:** Purple (#7C4DFF)
- **Font Size:** 34
- **Font Weight:** Bold
- **Position:** Absolute center (50, 50)

---

## 🔍 Key Design Decisions

### Why Marker Dots at Inner Edge?
- **No overlap** with progress ring stroke
- **Always visible** regardless of progress%
- **Clear visual separation** from moving dot

### Why Moving Dot at Center Stroke?
- **Smooth movement** along progress path
- **Visual prominence** (larger size)
- **No obstruction** of ring or markers

### Why Different Sizes?
- **Visual hierarchy:** Moving dot (4.5) > Marker dots (3.5)
- **User attention:** Eyes naturally follow larger moving element
- **UX clarity:** Static vs dynamic elements clearly differentiated

---

## ❓ Questions to Confirm

1. **Marker dots:** Có đúng là 4 chấm nằm BÊN TRONG vòng tròn không?
2. **Moving dot:** Có phải chạy ở GIỮA stroke path không?
3. **Ảnh #2:** Mày nói "xóa cái vòng tròn đó" - cái nào cần xóa?
4. **Colors:** Purple (#7C4DFF) và Gray (#CFCFE2) có đúng không?

---

## ✅ Once Confirmed, Will Implement:

```javascript
// Pseudo-code structure
<Svg viewBox="0 0 100 100">
  {/* Gray background ring */}
  <Circle cx={50} cy={50} r={42} stroke="#CFCFE2" strokeWidth={15} />

  {/* Purple progress ring (animated) */}
  <AnimatedCircle
    cx={50} cy={50} r={42}
    stroke="#7C4DFF"
    strokeDasharray={264}
    strokeDashoffset={animatedOffset}
    transform="rotate(-90 50 50)"
  />

  {/* 4 static marker dots (inner edge) */}
  {markerDots.map(dot => (
    <Circle cx={dot.x} cy={dot.y} r={3.5} fill="white" stroke="#7C4DFF" strokeWidth={0.5} />
  ))}

  {/* Moving progress dot (center stroke) */}
  <Circle cx={movingDot.x} cy={movingDot.y} r={4.5} fill="white" stroke="#7C4DFF" strokeWidth={0.8} />
</Svg>

{/* Center text */}
<Text style={{fontSize: 34, color: '#7C4DFF'}}>
  {current}/{total}
</Text>
```

---

**Xác nhận design này đúng chưa trước khi tao code React Native?**

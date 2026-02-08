# Code Analysis: CircularProgressBar Component - 4 Marker Dots Implementation

**File:** `src/components/CircularProgressBar.js`
**Tech Stack:** React Native + Expo + react-native-svg
**Analysis Date:** 2026-02-05

---

## 🎯 Core Concept

Component này vẽ circular progress ring với **2 loại chấm trắng**:
1. **4 chấm tĩnh** ở vị trí 12h, 3h, 6h, 9h (marker dots)
2. **1 chấm di động** chạy theo tiến độ (progress dot)

---

## 📐 Dimensions & Math

```javascript
const radius = 42;                              // Bán kính vòng tròn
const circumference = radius * Math.PI * 2;     // Chu vi = 264
const strokeWidth = 15;                         // Độ dày của ring
```

**ViewBox Coordinate System:**
- SVG viewBox: `0 0 100 100`
- Tâm vòng tròn: `(50, 50)`
- All calculations use viewBox units (0-100)

---

## 🔵 1. Static Marker Dots (4 Chấm Tĩnh)

### Location: Lines 38-52

```javascript
const markerDots = [
    { angle: -90, label: '12h' },  // Top
    { angle: 0, label: '3h' },     // Right
    { angle: 90, label: '6h' },    // Bottom
    { angle: 180, label: '9h' }    // Left
].map(({ angle, label }) => {
    const radians = (angle * Math.PI) / 180;
    const dotRadius = radius - strokeWidth / 2 - 2; // Inner edge of ring
    return {
        x: 50 + dotRadius * Math.cos(radians),
        y: 50 + dotRadius * Math.sin(radians),
        label
    };
});
```

### Math Breakdown:

**Vị trí inner edge:**
```
dotRadius = 42 - 15/2 - 2 = 32.5
```

**Calculate X, Y cho mỗi góc:**
- **12h** (top): angle = -90° → x=50, y≈0.5
- **3h** (right): angle = 0° → x≈99.5, y=50
- **6h** (bottom): angle = 90° → x=50, y≈99.5
- **9h** (left): angle = 180° → x≈0.5, y=50

**Render trong SVG (lines 154-162):**
```javascript
{markerDots.map((dot, index) => (
    <Circle
        key={`marker-${index}`}
        cx={dot.x}
        cy={dot.y}
        r="1.2"        // Size nhỏ
        fill="white"   // Màu trắng
    />
))}
```

---

## 🔴 2. Moving Progress Dot (Chấm Di Động)

### State Management (Line 26):
```javascript
const [movingDotPosition, setMovingDotPosition] = useState({ x: 50, y: 0.5 });
```

### Calculate Function (Lines 29-36):

```javascript
const calculateDotPosition = (progressPercent) => {
    const angle = -90 + (progressPercent * 360 / 100); // Start from top (-90deg)
    const radians = (angle * Math.PI) / 180;
    const dotRadius = radius + strokeWidth / 2; // Position on the CENTER of stroke
    const x = 50 + dotRadius * Math.cos(radians);
    const y = 50 + dotRadius * Math.sin(radians);
    return { x, y };
};
```

### Key Difference:

**Moving dot radius:**
```
dotRadius = 42 + 15/2 = 49.5 (CENTER of stroke)
```

**vs Marker dots radius:**
```
dotRadius = 42 - 15/2 - 2 = 32.5 (INNER edge)
```

**Why?**
- Moving dot chạy ở **giữa** stroke → trông smooth
- Marker dots ở **mép trong** → không bị progress bar che

### Update Position (Lines 95-96):
```javascript
// Inside animatedValue.addListener
setMovingDotPosition(calculateDotPosition(maxPerc));
```

### Render (Lines 165-172):
```javascript
{timer > 0 && (
    <Circle
        cx={movingDotPosition.x}
        cy={movingDotPosition.y}
        r="2.5"        // Lớn hơn marker dots (2.5 vs 1.2)
        fill="white"
    />
)}
```

**Conditional render:** Chỉ hiện khi `timer > 0`

---

## 🎨 3. Progress Ring Animation

### Background Ring (Lines 131-138):
```javascript
<Circle
    cx="50"
    cy="50"
    r={radius}
    stroke={theme.colors.border}  // #CFCFE2 (xám nhạt)
    strokeWidth={strokeWidth}
    fill="transparent"
/>
```

### Animated Progress Ring (Lines 139-151):
```javascript
<AnimatedCircle
    ref={circleRef}
    cx="50"
    cy="50"
    r={radius}
    stroke={theme.colors.primary}    // #7C4DFF (purple)
    strokeWidth={strokeWidth}
    fill="transparent"
    strokeDasharray={circumference}  // 264
    strokeDashoffset={circumference} // Start: 264 (empty)
    strokeLinecap="round"
    transform="rotate(-90 50 50)"    // Start from top
/>
```

### Animation Logic (Lines 87-93):
```javascript
animatedValue.addListener(v => {
    if (circleRef?.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
        circleRef.current.setNativeProps({
            strokeDashoffset,
        });

        // Update moving dot sync
        setMovingDotPosition(calculateDotPosition(maxPerc));
    }
});
```

**How it works:**
- Start: `strokeDashoffset = 264` (0% progress)
- 50% progress: `strokeDashoffset = 132`
- 100% progress: `strokeDashoffset = 0`

---

## 🔢 4. Center Text (Rep Count)

### Render (Lines 174-182):
```javascript
{!showTrainerImage && timer > 0 && (
    <AnimatedText
        ref={textRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue=""
        style={[styles.repCounts, StyleSheet.absoluteFillObject]}
    />
)}
```

### Update (Lines 99-103):
```javascript
if (textRef?.current) {
    textRef.current.setNativeProps({
        text: `${reps - remainingReps}/${reps}`  // e.g., "10/15"
    })
}
```

**Style:**
```javascript
repCounts: {
    fontSize: 34,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    color: theme.colors.primary,  // #7C4DFF
    zIndex: -1,
    userSelect: 'none',
}
```

---

## ⚙️ 5. Animation Setup

### Animated Value (Line 19):
```javascript
const animatedValue = useRef(new Animated.Value(0)).current;
```

### Animation Function (Lines 53-61):
```javascript
const animation = (toValue) => {
    return Animated.timing(animatedValue, {
        toValue,
        duration,           // From props (totalWorkoutTimeInSec * 1000)
        delay: 0,
        easing: Easing.linear,
        useNativeDriver: true,
    }).start();
}
```

### Trigger (Lines 84-110):
```javascript
useEffect(() => {
    animation(percentage);  // percentage = 100

    animatedValue.addListener(v => {
        // Update ring, dot, text...
    });

    return () => {
        animatedValue.removeAllListeners();
    };
}, [max, percentage, reps, remainingReps]);
```

---

## 📊 Component Architecture

```
CircularProgressBar
├── Svg Container (240x240, viewBox 0 0 100 100)
│   ├── Background Circle (gray ring)
│   ├── AnimatedCircle (purple progress ring)
│   ├── 4 x Static Marker Dots (white, r=1.2)
│   └── Moving Progress Dot (white, r=2.5)
└── AnimatedText (rep count, absoluteFill)
```

---

## 🎯 Key Takeaways

### 1. Dual Circle System
- **Background**: Static gray ring
- **Foreground**: Animated purple ring với `strokeDashoffset`

### 2. Dot Positioning Math
- **Marker dots**: `radius - strokeWidth/2 - 2` (inner edge)
- **Moving dot**: `radius + strokeWidth/2` (center of stroke)

### 3. Sync Animation
- Animated value listener updates **3 things** cùng lúc:
  1. Progress ring offset
  2. Moving dot position
  3. Rep count text

### 4. Performance Optimization
- `useNativeDriver: true` → 60fps smooth
- `setNativeProps` → Avoid re-renders
- Single animation driver → Everything synced

---

## 🔄 Animation Flow

```
Timer starts
    ↓
Animated.timing runs (0 → 100)
    ↓
animatedValue.addListener triggers every frame
    ↓
├── Update strokeDashoffset (ring fills)
├── Calculate new dot position (dot moves)
└── Update text (rep count changes)
    ↓
Timer ends → All animations complete
```

---

## 💡 Why This Design Works

1. **Visual Hierarchy**: Moving dot (2.5) > Marker dots (1.2)
2. **No Overlap**: Marker dots on inner edge, moving dot on center
3. **Smooth Animation**: Linear easing + native driver
4. **Clear Progress**: Dual system (circular + marker dots)
5. **Gamification**: Passing marker dots = mini achievements

---

## 📝 Usage Example

```javascript
<CircularProgressBar
    duration={173000}          // 2:53 in ms
    sets={3}
    reps={15}
    breakTime={30}
    timer={142}                // Current remaining time
    remainingReps={5}
    remainingSets={1}
    isPaused={false}
    showTrainerImage={false}
    trainerId="1"
/>
```

---

## 🔍 Unresolved Questions

1. Pause functionality commented out (lines 63-82) - why not used?
2. `halfCircle` variable defined but never used (line 17)
3. Why use TextInput for rep count instead of Text component?
4. Should marker dots pulse when progress dot passes them?
5. Accessibility: Screen reader support for progress status?

---

**End of Analysis**

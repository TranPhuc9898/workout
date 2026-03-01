# Brainstorm: Voice Rep Counting + Motivational Audio

## Problem Statement
App cần voice đếm rep real-time giống PT thật: đọc số rep khi bắt đầu mỗi rep, chèn câu cổ vũ motivational giữa các rep (tần suất tăng dần), và play motivational trong break phase.

## Available Assets
- `Simon_s Gym App Recordings/`: 51 numbered files (`0.wav`-`50.wav`) + 113 motivational phrases (28 phrases x 3-5 takes each)
- `expo-av` already installed
- Current audio system in `AnimatedBubble.js` is broken (references non-existent .mp3 files)

## Agreed Approach

### Voice Behavior
| Phase | Audio |
|-------|-------|
| Rep starts | Play `{repNumber}.wav` immediately |
| Between reps | Random motivational phrase (frequency increases toward end of set) |
| Break phase | Random motivational every ~8-10s |

### Motivational Frequency: Progressive
- First 25% of set: ~20% chance per rep gap
- 25-50%: ~40% chance
- 50-75%: ~60% chance
- Last 25%: ~80% chance

### Priority: Rep counting > Motivational (stop motivational if rep sound needs to play)

## Technical Solution

### New Module: Audio Manager (`src/services/audio-manager.js`)
- Preload rep sounds (only numbers needed for current workout)
- Preload pool of random motivational sounds
- Play/stop queue with priority system
- Cleanup on unmount

### WorkoutScreen.js Changes
- Watch `completedRepsInSet` changes → trigger rep sound
- Schedule motivational between reps with progressive probability
- Break phase: interval-based motivational playback

### Key Considerations
- .wav files OK with expo-av, check total size
- Preload smartly: only needed numbers + ~5 motivational at a time
- Convert to .mp3 if .wav too large
- Fix broken audio references in AnimatedBubble.js

## Risks
1. Performance on weak devices → smart preload/unload
2. Timer sync accuracy → sound must match UI counter
3. File size → 165 .wav files could be large

## Success Criteria
- Voice reads rep number at start of each rep
- Motivational phrases play naturally between reps (progressive frequency)
- No audio overlap/glitch
- Break phase has motivational encouragement
- Feels like real PT experience

## Next Steps
→ Create detailed implementation plan

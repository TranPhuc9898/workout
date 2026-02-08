import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import theme from '../theme';

// Tappable exercise card - expands to show GIF + instructions
const ExpandableExerciseCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      {/* Top row: index badge + name + expand arrow */}
      <View style={styles.topRow}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseMeta}>
            {(item.equipments || []).join(', ') || 'body weight'}
          </Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {/* Expanded: GIF + muscles + instructions */}
      {expanded && (
        <View style={styles.detailSection}>
          {/* Exercise GIF */}
          {item.gifUrl && (
            <Image source={{ uri: item.gifUrl }} style={styles.gif} resizeMode="contain" />
          )}

          {/* Muscle tags */}
          <View style={styles.tagRow}>
            {(item.targetMuscles || []).map((m) => (
              <View key={m} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{m}</Text>
              </View>
            ))}
            {(item.secondaryMuscles || []).map((m) => (
              <View key={m} style={[styles.muscleTag, styles.secondaryTag]}>
                <Text style={styles.secondaryTagText}>{m}</Text>
              </View>
            ))}
          </View>

          {/* Step-by-step instructions */}
          <Text style={styles.instructionsTitle}>How to perform:</Text>
          {(item.instructions || []).map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{i + 1}.</Text>
              <Text style={styles.stepText}>
                {step.replace(/^Step:\d+\s*/i, '')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  exerciseMeta: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  expandIcon: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: 8,
  },
  detailSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  gif: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  muscleTag: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  muscleTagText: {
    fontSize: 11,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  secondaryTag: {
    backgroundColor: theme.colors.backgroundTertiary,
  },
  secondaryTagText: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    width: 22,
  },
  stepText: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 19,
  },
});

export default ExpandableExerciseCard;

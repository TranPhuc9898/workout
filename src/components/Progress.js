import React, { useEffect } from "react";
import { TextInput, View, Image, StyleSheet } from "react-native";
import Animated, { createAnimatedPropAdapter, processColor, Easing, interpolateColor, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const radius = 42;
const circumference = radius * Math.PI * 2;

const ProgressCircle= ({ duration, sets, reps, breakTime, timer, remainingReps, remainingSets, isPaused}) => {

    const strokeOffset = useSharedValue(circumference);

    const fillColor = useSharedValue('transparent');

    const percentage = useDerivedValue(() => {
        const number = ((circumference - strokeOffset.value) / circumference ) * 100;
        return withTiming(number, { duration: duration, easing: Easing.linear });
    });

    const strokeColor = useDerivedValue(() => {
        return interpolateColor(
            percentage.value,
            [0, 50, 100],
            ["#7C4DFF", "#7C4DFF", "#7C4DFF"]
        );
    });

    const animatedCircleProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: withTiming(strokeOffset.value, { duration: duration, easing: Easing.linear }),
            stroke: strokeColor.value,
            fill: fillColor.value, // Add fill to animated properties to fix bug described in
            // https://github.com/software-mansion/react-native-svg/issues/1845
        };
    }
    // this code is also necessary to fix the bug mentioned above
    , [], createAnimatedPropAdapter(
        (props) => {
            if (Object.keys(props).includes('fill')) {
                props.fill = {type: 0, payload: processColor(props.fill)}
            }
            if (Object.keys(props).includes('stroke')) {
                props.stroke = {type: 0, payload: processColor(props.stroke)}
            }
        },
    ['fill', 'stroke']));

    const animatedRepsCountProps = useAnimatedProps(() => {
        return {
            text: `${reps - remainingReps}/${reps}`
        };
    });

    useEffect(() => {
        strokeOffset.value = 0;
    }, []);

    return (
        <View style={styles.trainerImage}>
            {timer === 0 && ( //for now, only show image when timer is 0
                <Image
                source={require('../../assets/trainer.png')}
                style={[StyleSheet.absoluteFill, { width: 230, height: 230, borderRadius: 120, zIndex: 0 }]}
                resizeMode="cover"
                />
            )}
            {timer !== 0 && ( //hide count when timer is 0
                <AnimatedText
                    style={styles.repCounts}
                    animatedProps={animatedRepsCountProps}
                />
            )}
            <Svg height="240" width="240" viewBox="0 0 100 100" >
                <Circle
                    cx="50"
                    cy="50"
                    r={`${radius}`}
                    stroke="#CFCFE2"
                    strokeWidth="15"
                    fill="transparent"
                />
            {isPaused === false && <AnimatedCircle
                    animatedProps={animatedCircleProps}
                    cx="50"
                    cy="50"
                    r={`${radius}`}
                    strokeDasharray={`${circumference}`}
                    strokeWidth="15"
                    strokeLinecap="round"  // Round the ends of the progress bar
                    transform="rotate(-90 50 50)"  // Rotate the circle to start from the top
            />}
        </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
    trainerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    repCounts: {
        fontSize: 34,
        fontFamily: 'Overpass-Bold',
        margin: 10,
        color:"#7C4DFF",
        zIndex: -1, // This makes the text hidden by the trainer image and has the benefit of making the text not editable/selectable
        position: 'absolute',
        userSelect: 'none',
    },
});

export default ProgressCircle;
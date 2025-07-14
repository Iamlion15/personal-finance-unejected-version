import { useRef } from 'react';
import { Animated } from 'react-native';

const useShakeAndScaleAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerAnimation = (onImmediateAction?: () => void, onComplete?: () => void) => {
    // Trigger the immediate action right away
    if (onImmediateAction) onImmediateAction();

    // Run the animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  };

  return { scaleAnim, shakeAnim, triggerAnimation };
};

export default useShakeAndScaleAnimation;
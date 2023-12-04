import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"; // Looks at the style prop of the component. It also determines which values to animate and applies updates to create an animation.

export default function EmojiSticker({ imageSize, stickerSource }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0); // Attention que l'ordre à son importance.

  const scaleImage = useSharedValue(imageSize);
  /**
   * It mutates a piece of data and allows running animations based on the current value.
   * A shared value can be accessed and modified using the .value property.
   * It will scale the initial value of scaleImage so that when a user-double taps the sticker, it scales to twice its original size.
   * To do this, we will create an object and call it doubleTap.
   */

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}

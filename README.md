# SVG Animator for React Native

[![GitHub stars](https://img.shields.io/github/stars/sturnusv/svg-attributes-inspector?style=social)](https://github.com/sturnusv/svg-attributes-inspector)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The Free, Open-Source Alternative to Lottie for SVG-Based Animations

🔗 [Live Demo](https://sturnusv.github.io/svg-attributes-inspector/)

A powerful developer tool that inspects, animates, and converts SVG files into optimized React Native animations using standard `react-native-svg` and `react-native-reanimated`.

## ✨ Features

### 🎨 Core Inspection
- **🔍 Visual SVG Inspector** – Upload SVGs and inspect element properties (paths, fills, transforms)
- **📋 Attribute Extraction** – Copy optimized path data for React Native implementations
- **🔄 Live DOM Preview** – See changes reflected in real-time

### 🎬 Animation Studio
- **Multi-Type Animations** – Create rotations, translations, scales, and opacity animations
- **9 Anchor Points** – Precisely control transform origins (top-left, center, bottom-right, etc.)
- **Real-time Preview** – See animations play back instantly in the editor

### ⚡ React Native Ready
- **One-Click Export** – Generate complete animated React Native components
- **Performance Optimized** – Uses hardware-accelerated animations via Reanimated
- **Cross-Platform** – Code works on both iOS and Android

## 🚀 Getting Started with Exported Components

1. **Export from the Tool**:
   - Click "Export" to generate an `AnimatedComponent.js` file
   - The file contains all your animations ready for React Native

2. **Install Dependencies**:
   ```bash
   # For Expo projects
   expo install react-native-svg react-native-reanimated

   # For bare React Native projects
   npm install react-native-svg react-native-reanimated
   # or
   yarn add react-native-svg react-native-reanimated

3. **Use in Your Projects**:
import AnimatedSVG from './AnimatedComponent';

function MyScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <AnimatedSVG width={200} height={200} />
    </View>
  );
}

## Customization Options

- **Adjust size** via `width` and `height` props  
- **Change colors** by modifying the `fill` attributes in the exported component  
- **Control playback** with React Native's `Animated` API  

---

## 🛠 Tech Stack

- **Frontend**: React + Vite  
- **Animation**: `react-native-reanimated` compatible output  
- **SVG Processing**: SVG.js  
- **Code Generation**: Custom Babel plugin for RN optimization  

---

## 📋 How to Use the Tool

1. Upload an SVG file (or try our sample files)
2. Click elements to inspect their properties
3. Add animations using the visual editor:
   - Choose animation type (rotate, translate, opacity)
   - Set anchor points and parameters
   - Adjust frequency/duration
4. Export to React Native component

---

## 🌌 Roadmap

- Figma plugin for direct SVG import  
- Animation timeline with keyframes  
- Expo Snack integration for instant testing  

---

## 💡 Why Choose This Over Lottie?

| Feature              | This Tool      | Lottie         |
|----------------------|----------------|----------------|
| No After Effects     | ✅ Yes         | ❌ No          |
| Code Transparency    | ✅ Full        | ❌ JSON        |
| Bundle Size          | ✅ ~10kb       | ❌ 150kb+      |
| Custom Controls      | ✅ Full        | ❌ Limited     |

---

We welcome contributions! Particularly for:

- New animation types (3D transforms, path morphing)  
- Enhanced codegen templates  
- Performance optimizations  

---

## 📄 License

MIT © Yusuf ATAKAN  

---

## 🌟 Free & Open Source

**Support the project by starring on GitHub!**

SVG Animator for React Native
The Free, Open-Source Alternative to Lottie for SVG-Based Animations

https://sturnusv.github.io/svg-attributes-inspector/

A powerful developer tool that inspects, animates, and converts SVG files into optimized React Native animations using standard react-native-svg and react-native-reanimated.

✨ Features
Core Inspection
🔍 Visual SVG Inspector – Upload SVGs and inspect element properties (paths, fills, transforms)
📋 Attribute Extraction – Copy optimized path data for React Native implementations
🔄 Live DOM Preview – See changes reflected in real-time

Animation Studio
🎬 Multi-Type Animations – Create path morphing, rotations, translations, and opacity animations
⏱️ Timeline Controls – Adjust duration, easing, and keyframes
📊 Anchor Point Editing – Precisely control transform origins

React Native Ready
⚡ Performance Optimized – Output uses hardware-accelerated animations
📱 Cross-Platform – Generates code compatible with iOS/Android
🧩 Component Templates – Export reusable Animated SVG components

🚀 Vision
Goal: Become the go-to free solution for creating lightweight, customizable SVG animations in React Native without Lottie's dependency.

Why This Exists:
While Lottie dominates React Native animations, it requires After Effects and creates opaque JSON blobs. This tool empowers developers to:

Use standard SVGs from designers

Retain full control over animation logic

Achieve better performance with direct Reanimated integration

🛠 Tech Stack
Frontend: React.js + Vite

Animation: SVG.js + requestAnimationFrame

Codegen: Babel plugin for RN optimization

Rendering: react-native-svg compatible output

📋 How to Use
Upload SVG (or try our sample files)

Inspect elements by clicking on them

Animate using the visual timeline


🌌 Future Roadmap
Next Release
✅ Animation keyframe editor
✅ Export to React Native CLI template

Planned
🛠 Figma Plugin – Import SVGs directly from design tools
📱 Expo Snack Integration – Test animations instantly
🎨 Preset Gallery – Common animations (pulse, bounce, morph)

💡 Why Not Lottie?
Feature	This Tool	Lottie
No AE Required	✅ Yes	❌ No
Code Transparency	✅ Full control	❌ Opaque JSON
Bundle Size	✅ ~10kb	❌ ~150kb
Custom Interpolation	✅ Any easing	❌ Limited
🛠 Development
bash
git clone https://github.com/your-repo/svg-animator.git
cd svg-animator
npm install
npm run dev
Contribute: We welcome PRs for:

New animation types (3D transforms?)

Enhanced codegen templates

Performance optimizations

🌟 Free & Open Source – Support the project by starring on GitHub!
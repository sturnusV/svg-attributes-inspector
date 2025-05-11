SVG Inspector & React Native Animation Helper:

https://sturnusv.github.io/svg-attributes-inspector/

A developer tool that helps inspect SVG files and extract attributes (path data, fill colors, transforms) to streamline their conversion into animated React Native components.

Features
🔍 Visual SVG Inspector – Upload an SVG file and click elements to view their properties (path d, fill, stroke, transforms, etc.).
📋 Copy Attributes – Easily extract path data for use in libraries like react-native-svg or react-native-reanimated.
🔄 Animation-Ready – Designed to assist in converting static SVGs into dynamic React Native animations.

Use Case
*Debug complex SVGs before implementing them in React Native.
*Extract path data for morphing animations (react-native-reanimated).
*Optimize SVG attributes for better performance in mobile apps.

Tech Stack
*React.js (Frontend)
*SVG DOM Parsing (Extracting paths, fills, transforms)

🚀 Goal: Make SVG-to-React-Native workflows faster and more intuitive!

Why This Exists
Working with SVGs in React Native can be tricky—especially when animations require precise path data or attribute adjustments. This tool automates the inspection process, saving hours of manual debugging.

Future Plans
*Add export to React Native code (e.g., generating <Path d="..."/> snippets).
*Support animation previews.

How to Use
*Upload the SVG file.
*Click elements to inspect their attributes.
*Copy/paste the data into your React Native project!
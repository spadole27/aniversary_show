# 6 Years of Love — Anniversary Slideshow

A beautiful, responsive anniversary celebration website with smooth animations, cinematic curtain opening, and a photo gallery slider.

## Features

- **Smooth Curtain Animation**: Opens with a realistic 3D curtain transition
- **Responsive Design**: Optimized for desktop, tablet, and mobile (tested on OnePlus Nord CE5)
- **Photo Gallery**: Main slideshow with fade/zoom/slide transitions
- **Cascade Thumbnails**: Auto-scrolling thumbnail slider below the main gallery
- **Floating Hearts**: Animated heart particles on the hero section
- **Local Image Support**: Loads images from a local `Images/` folder using `images-manifest.json` (keeps all content private and on-device)
- **Smooth Transitions**: Each image uses varied ease-in-out animations
- **Touch Support**: Swipe navigation on mobile devices
- **Scene Card**: Central "planet" circle that displays current image name

## Tech Stack

- HTML5
- CSS3 (with flexbox, grid, and animations)
- Vanilla JavaScript (no frameworks or external dependencies)

## Setup & Usage

### Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd anniversary-show
   ```

2. Place your images in the `Images/` folder (optional — you can also import via the "Import Photos" button in-browser).

3. Serve the project locally:
   ```bash
   python -m http.server 8000
   ```
   or use VS Code Live Server

4. Open your browser to `http://localhost:8000`

### Image Management

- **Automatic Loading**: Images are loaded from `images-manifest.json` (relative paths, stays on-device)
- **Manual Import**: Click "Import Photos" button to select images from your device
- **Drag & Drop**: Drop image files directly onto the main slideshow area

## File Structure

```
anniversary-show/
├── index.html           # Main HTML structure
├── styles.css           # All styling (responsive + animations)
├── script.js            # JavaScript logic (slideshow, transitions, etc.)
├── images-manifest.json # List of images to load locally
├── .gitignore           # Git ignore rules
└── Images/              # Local image folder (not synced)
```

## Mobile Support

Tested and optimized for:
- OnePlus Nord CE5
- iPhone & Android devices
- Tablets (iPad, Samsung Tab, etc.)

Features include:
- Auto-scaling images to viewport
- Touch swipe navigation
- Reduced motion support (`prefers-reduced-motion` CSS media query)
- Safe-area insets for notched devices

## Customization

### Change Timing
Edit constants in `script.js`:
- `CURTAIN_OPEN_DELAY` — delay before curtains open (ms)
- `CURTAIN_OPEN_DURATION` — curtain animation length (ms)
- `INTRO_SLIDE_INTERVAL` — time between slides (ms)

### Change Colors
Edit CSS variables in `styles.css` (`:root` section):
- `--rose` — primary pink/rose color
- `--gold` — accent gold
- `--cream` — light text color
- etc.

### Adjust Image Display
In `styles.css`, modify:
- `.slide-frame img` — change `max-height` to fit your preference
- `object-fit: contain` — switch to `cover` for cropped/filled look

## Privacy

All images are stored locally on your device. No images are uploaded or sent to any external server. The page can run offline once loaded.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Created with love for a special 6-year anniversary. Feel free to adapt for your own celebrations.

---

**Made with ❤️**

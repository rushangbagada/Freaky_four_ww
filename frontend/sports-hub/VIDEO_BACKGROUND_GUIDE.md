# Video Background Setup Guide

## How to Add a Video Background

1. **Download a Sports Video**
   - Find a suitable sports-themed video (stadium, players in action, etc.)
   - Recommended formats: MP4 (most compatible)
   - Recommended resolution: 1920x1080 or higher
   - Keep file size under 10MB for good performance

2. **Add Video to Your Project**
   ```
   sports-hub/
   ├── public/
   │   └── videos/
   │       └── sports-background.mp4  <- Place your video here
   ```

3. **Update home.jsx**
   Replace the commented video code with:
   ```jsx
   <video className="video-background" autoPlay loop muted playsInline>
     <source src="/videos/sports-background.mp4" type="video/mp4" />
     Your browser does not support the video tag.
   </video>
   ```

4. **Video Optimization Tips**
   - Use H.264 codec for better compatibility
   - Compress video to reduce file size
   - Consider using WebM format as a fallback:
   ```jsx
   <video className="video-background" autoPlay loop muted playsInline>
     <source src="/videos/sports-background.webm" type="video/webm" />
     <source src="/videos/sports-background.mp4" type="video/mp4" />
     Your browser does not support the video tag.
   </video>
   ```

## Free Sports Video Resources

1. **Pexels** - https://pexels.com/videos/sports/
2. **Unsplash** - https://unsplash.com/videos/sports/
3. **Pixabay** - https://pixabay.com/videos/search/sports/
4. **Videezy** - https://videezy.com/free-video/sports

## Current Animated Background

The current implementation uses CSS animations to create a dynamic sports field-like background with:
- Moving gradients simulating stadium lighting
- Grid patterns resembling sports fields
- Floating light effects
- Smooth transitions between different states

This provides a good fallback and works without requiring video files.

## Performance Considerations

- Video backgrounds can impact performance on mobile devices
- Consider disabling video on smaller screens:
```css
@media (max-width: 768px) {
  .video-background {
    display: none;
  }
}
```

- Use `preload="metadata"` for faster loading
- Consider lazy loading for videos below the fold

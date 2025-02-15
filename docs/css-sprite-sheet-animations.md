# CSS Sprite Sheet Animations

A summary of the technique explained in Lean Rada's article: [CSS sprite sheet animations · leanrada.com](https://leanrada.com/notes/css-sprite-sheets/)

## What are Sprite Sheets?

Sprite sheets are single image files that contain multiple smaller images arranged in a grid or sequence. On the web, they have traditionally been used to:

1. Reduce HTTP requests by bundling multiple images into one file
2. Create frame-by-frame animations from a sequence of images

## Example: Twitter's Heart Animation

The article demonstrates this technique using Twitter's heart animation button. When clicked, the heart shows a sequence of frames that create a fluid animation effect.

## How Sprite Sheet Animations Work

### Basic CSS Implementation

```css
.element {
  background-image: url('heart.png');
  /* size of one frame */
  width: 100px;
  height: 100px;
  /* size of the whole sheet */
  background-size: 2900px 100px;
  /* coordinates of the desired frame (negated) */
  background-position: -500px 0px;
}
```

This shows the sixth frame of the animation (at position 500px, 0px).

### Animation Implementation

To animate through all frames:

```css
.element {
  background-image: url('heart.png');
  width: 100px;
  height: 100px;
  background-size: 2900px 100px;
  /* animate the coordinates */
  animation: heartAnimation 2s steps(29, jump-none) infinite;
}

@keyframes heartAnimation {
  from {
    /* first frame */
    background-position: 0px 0px;
  }
  to {
    /* last frame */
    background-position: -2800px 0px;
  }
}
```

## The Critical `steps()` Function

The article emphasizes the importance of using the `steps()` function in the `animation-timing-function`. This ensures the animation jumps precisely to each frame without interpolating between them.

Without `steps()`, you would get a weird smooth movement that ruins the frame-by-frame effect.

## Making It Interactive

CSS selectors can be used to make the animation interactive:

```css
.input:checked ~ .element {
  animation: heartAnimation 2s steps(29, jump-none) forwards;
}
```

This starts the animation when a checkbox is checked.

## Advantages Over Other Methods

1. Easier to control than GIFs or APNGs
2. Can be paused, reversed, or changed in speed
3. Can be triggered by various CSS selectors/events
4. Can be made scroll-driven with modern CSS
5. Doesn't block the main thread (unlike JS animations)

## Limitations

1. Can result in large image files if not optimized
2. Only suitable for small, frame-by-frame raster animations
3. Higher pixel density support requires additional work
4. Not ideal for complex animations that SVG or videos might handle better

## Examples Shown in the Article

1. Twitter's heart button animation
2. Spinning globe and moon animations
3. Character walk cycles
4. UI element hover states

## When to Use This Technique

Use CSS sprite sheet animations when you need:
- Small, discrete animated elements
- Interactive animations triggered by user events
- Frame-by-frame control over the animation
- Better performance than JavaScript animations

## Alternatives to Consider

- For autoplaying elements: GIFs or APNGs
- For vector animations: SVG animations
- For longer/complex content: Video elements
- For 3D or particle effects: Canvas/WebGL
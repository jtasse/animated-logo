import * as p5 from "p5";
import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  private p5;
  canvas: any;

  ngOnInit() {
    this.setup();
  }

  private setup() {
    this.createSketch();
  }

  private createSketch() {
    this.p5 = new p5(this.sketch);
  }

  private sketch(p: any) {
    var canvasWidth: number = 1920 * 0.8;
    var canvasHeight: number = 1080 * 0.8;

    var rectStartX = p.random(containerWidth);
    var rectStartY = p.random(containerHeight);

    var rectWidth = 200;
    var rectHeight = 200;

    var dotWidth = 5;

    var img;

    p.preload = () => {
      img = p.loadImage("assets/JTJ.png"); // Place your image in src/assets/JT.png
    };

    p.setup = () => {
      p.setAttributes('alpha', true);      // enable WebGL transparency
      p.setAttributes('premultipliedAlpha', false); // optional for better blending

      const canvas = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);

      // Access the WebGL context and force alpha support
      const gl = p._renderer.GL; // Same as p.drawingContext
      const contextAttributes = gl.getContextAttributes();

      if (!contextAttributes.alpha) {
        console.warn("WebGL context is NOT alpha-capable. Transparency will not work.");
      }

      // Style the canvas DOM element
      canvas.elt.style.backgroundColor = 'transparent';
      canvas.elt.style.position = 'absolute'; // optional: ensures stacking
      canvas.elt.style.zIndex = '10'; // optional

      // Attach to your DOM element
      canvas.parent('scene-wrapper');

      // Clear the canvas every frame for transparency
      p.clear();
    };

    var rectEndX = rectStartX + rectWidth;
    var rectEndY = rectStartY + rectHeight;

    var rectSpeedX = 1;
    var rectSpeedY = 1;

    var frameCount = 0;
    var radian = 360 / 2;
    var degree = radian / 180;

    var containerXPos = -(canvasWidth / 4);
    var containerYPos = -(canvasHeight / 4);
    var containerWidth = canvasWidth / 2;
    var containerHeight = canvasHeight / 2;

    var containerXMax = containerXPos + containerWidth;
    var containerYMax = containerYPos + containerHeight;

    p.draw = () => {
      p.clear();
      degree = frameCount++;

      // Zoom out the scene
      p.scale(0.7); // Try 0.7 or lower if still clipping

      // Rotate the whole scene
      p.rotateX(degree / 75);
      p.rotateY(degree / 75);

      p.push();
      p.rect(containerXPos, containerYPos, containerWidth, containerHeight);
      p.pop();

      p.colorMode(p.RGB, 255); // Reset color mode for rest of drawing
      p.rect(containerXPos, containerYPos, containerWidth, containerHeight);

      // Draw the moving rectangle and its image together
      p.push();
      p.translate(rectStartX + rectWidth / 2, rectStartY + rectHeight / 2, 5); // Move further forward in z

      p.rectMode(p.CENTER);
      if (img) {
        p.noStroke();
        p.texture(img);
        p.plane(rectWidth, rectHeight);
      } else {
        p.fill(255);
        p.noStroke();
        p.plane(rectWidth, rectHeight);
      }
      p.pop();

      // Only use 'happy' colors for the fill (skip brown/earthy tones)
      // We'll use a custom palette of bright, saturated colors
      const happyColors = [
        [255, 0, 0],    // Red
        [255, 128, 0],  // Orange
        [255, 255, 0],  // Yellow
        [0, 255, 0],    // Green
        [0, 255, 255],  // Cyan
        [0, 128, 255],  // Blue
        [128, 0, 255],  // Purple
        [255, 0, 255]   // Magenta
      ];
      const transitionFrames = 180; // Slow down: 90 frames per color (1.5s at 60fps)
      const colorIndex = Math.floor((frameCount / transitionFrames) % happyColors.length);
      const nextIndex = (colorIndex + 1) % happyColors.length;
      const t = (frameCount % transitionFrames) / transitionFrames;
      // Interpolate between two happy colors for smooth transition
      const r = Math.round(happyColors[colorIndex][0] * (1 - t) + happyColors[nextIndex][0] * t);
      const g = Math.round(happyColors[colorIndex][1] * (1 - t) + happyColors[nextIndex][1] * t);
      const b = Math.round(happyColors[colorIndex][2] * (1 - t) + happyColors[nextIndex][2] * t);
      p.fill(r, g, b);

      rectStartX = rectStartX + rectSpeedX;
      rectEndX = rectEndX + rectSpeedX;

      rectStartY = rectStartY + rectSpeedY;
      rectEndY = rectEndY + rectSpeedY;

      // X max
      if (rectStartX >= containerXMax) {
        rectSpeedX = -rectSpeedX;
        rectStartX = containerXMax;
      } else if (rectEndX >= containerXMax) {
        rectSpeedX = -rectSpeedX;
        rectEndX = containerXMax;
      }

      // X min
      else if (rectStartX <= containerXPos) {
        rectSpeedX = -rectSpeedX;
        rectStartX = containerXPos;
      } else if (rectEndX <= containerXPos) {
        rectSpeedX = -rectSpeedX;
        rectEndX = containerXPos;
      }

      // Y max
      if (rectStartY >= containerYMax) {
        rectSpeedY = -rectSpeedY;
        rectStartY = containerYMax;
      } else if (rectEndY >= containerYMax) {
        rectSpeedY = -rectSpeedY;
        rectEndY = containerYMax;
      }

      // Y min
      else if (rectStartY <= containerYPos) {
        rectSpeedY = -rectSpeedY;
        rectStartY = containerYPos;
      } else if (rectEndY <= containerYPos) {
        rectSpeedY = -rectSpeedY;
        rectEndY = containerYPos;
      }
    };
  }
}

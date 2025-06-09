import * as p5 from "p5";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  private p5!: p5;
  private canvas: any;

  ngOnInit() {
    this.setup();
  }

  private setup() {
    this.createSketch();
  }

  private createSketch() {
    this.p5 = new p5(this.sketch.bind(this));
  }

  private sketch(p: any) {
    const canvasWidth: number = 1920 * 0.8; // 1536
    const canvasHeight: number = 1080 * 0.8; // 864

    // We will make a square whose side is half of the smaller canvas dimension
    const containerSize = canvasHeight / 2; // 864 / 2 = 432
    // Position it so that its center is at (0,0) in WEBGL coordinates:
    const containerXPos = -containerSize / 2; // -216
    const containerYPos = -containerSize / 2; // -216

    let frameCount = 0;
    let img: p5.Image | null = null;

    // Preload the image
    p.preload = () => {
      img = p.loadImage("assets/treats_logo_v3.png");
    };

    p.setup = () => {
      // Create a WEBGL canvas with alpha transparency
      p.setAttributes("alpha", true);
      p.setAttributes("premultipliedAlpha", false);
      const c = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);

      // Force alpha support check (optional)
      const gl = p._renderer.GL;
      const contextAttributes = gl.getContextAttributes();
      if (!contextAttributes.alpha) {
        console.warn(
          "WebGL context is NOT alpha-capable. Transparency may not work."
        );
      }

      // Style the canvas DOM element
      c.elt.style.backgroundColor = "transparent";
      c.elt.style.position = "absolute";
      c.elt.style.zIndex = "10";
      c.parent("scene-wrapper");

      // Clear once to establish the transparent background
      p.clear();
    };

    p.draw = () => {
      p.clear();
      frameCount++;

      // Zoom out so the square doesn’t clip at the edges
      p.scale(0.7);

      // Rotate the entire scene over time
      p.rotateX(frameCount / 75);
      p.rotateY(frameCount / 75);

      // ----- 1) Compute the “happy colors” interpolation -----
      const happyColors = [
        [255, 0, 0],    // Red
        [255, 128, 0],  // Orange
        [255, 255, 0],  // Yellow
        [0, 255, 0],    // Green
        [0, 255, 255],  // Cyan
        [0, 128, 255],  // Blue
        [128, 0, 255],  // Purple
        [255, 0, 255],  // Magenta
      ];
      const transitionFrames = 180;
      const idx = Math.floor((frameCount / transitionFrames) % happyColors.length);
      const nextIdx = (idx + 1) % happyColors.length;
      const t = (frameCount % transitionFrames) / transitionFrames;
      const r = Math.round(
        happyColors[idx][0] * (1 - t) + happyColors[nextIdx][0] * t
      );
      const g = Math.round(
        happyColors[idx][1] * (1 - t) + happyColors[nextIdx][1] * t
      );
      const b = Math.round(
        happyColors[idx][2] * (1 - t) + happyColors[nextIdx][2] * t
      );

      // ----- 2) Draw the rotating square with the interpolated fill color -----
      p.push();
      p.noStroke();
      p.fill(r, g, b);
      // This square is centered at (0,0) because Xpos = –size/2, Ypos = –size/2
      p.rect(containerXPos, containerYPos, containerSize, containerSize);
      p.pop();

      // ----- 3) Affix the image to the front face of that square -----
      p.push();
      // Move to the very front of the square in Z, so the image “sits” flush on the front face.
      // We add a tiny offset (+1) to ensure it doesn’t z-fight with the square’s fill.
      const frontZ = 1;
      p.translate(0, 0, frontZ + 0.5);

      if (img) {
        p.noStroke();
        p.texture(img);
        // Stretch the image to match the square’s size exactly:
        p.plane(containerSize, containerSize);
      } else {
        p.fill(255);
        p.noStroke();
        p.plane(containerSize, containerSize);
      }
      p.pop();
    };
  }
}

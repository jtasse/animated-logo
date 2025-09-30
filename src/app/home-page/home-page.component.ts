/// <reference lib="dom" />
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
  private frameCount = 0;
  private img: p5.Image | null = null;

  ngOnInit() {
    this.createSketch();
  }

  private createSketch() {
    this.p5 = new p5(this.sketch.bind(this));
  }

  private sketch(p: any) {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const planeSize = canvasHeight / 3;

    p.preload = () => {
      this.img = p.loadImage("assets/treats_logo_v3.png");
    };

    p.setup = () => {
      const c = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);

      // Enable transparency
      p.setAttributes('alpha', true);
      p.setAttributes('premultipliedAlpha', false);

      c.elt.style.backgroundColor = 'transparent';
      c.parent("scene-wrapper");

      p.clear(); // start with transparent background
    };

    p.draw = () => {
      this.frameCount++;

      // Clear canvas each frame to fully transparent
      p.clear();

      // Dynamic rainbow color for the rotating square
      const happyColors = [
        [255, 0, 0], [255, 128, 0], [255, 255, 0],
        [0, 255, 0], [0, 255, 255], [0, 128, 255],
        [128, 0, 255], [255, 0, 255],
      ];
      const transitionFrames = 180;
      const idx = Math.floor((this.frameCount / transitionFrames) % happyColors.length);
      const nextIdx = (idx + 1) % happyColors.length;
      const t = (this.frameCount % transitionFrames) / transitionFrames;
      const r = Math.round(happyColors[idx][0] * (1 - t) + happyColors[nextIdx][0] * t);
      const g = Math.round(happyColors[idx][1] * (1 - t) + happyColors[nextIdx][1] * t);
      const b = Math.round(happyColors[idx][2] * (1 - t) + happyColors[nextIdx][2] * t);

      p.push();
      p.rotateX(this.frameCount * 0.01);
      p.rotateY(this.frameCount * 0.01);

      // Color-changing square (background for logo)
      p.push();
      p.translate(0, 0, -0.1); // slight offset back
      p.noStroke();
      p.fill(r, g, b);
      p.plane(planeSize, planeSize);
      p.pop();

      // Black logo on top
      if (this.img) {
        p.push();
        p.translate(0, 0, 0.1); // slight offset forward to avoid z-fighting
        p.noStroke();
        p.tint(0); // black logo
        p.texture(this.img);
        p.plane(planeSize, planeSize);
        p.pop();
      }

      p.pop();
    };
  }
}

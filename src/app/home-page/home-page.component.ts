import { Component, OnInit } from "@angular/core";
import * as p5 from "p5";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
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

    var rectWidth = 100;
    var rectHeight = 100;

    var dotWidth = 5;

    p.setup = () => {
      p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
      p.strokeWeight(dotWidth);
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
      degree = frameCount++;

      p.background(125);

      p.rotateX(degree / 75);
      p.rotateY(degree / 75);

      p.push();
      p.noFill();
      p.rect(containerXPos, containerYPos, containerWidth, containerHeight);
      p.pop();

      p.fill(frameCount * 0.3, frameCount * 0.2, frameCount * 0.1);
      p.rect(rectStartX, rectStartY, rectWidth, rectHeight);

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

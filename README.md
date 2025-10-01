# Intro
This project creates an animated scene with [Angular](https://angular.io/) and [P5JS](https://p5js.org/). As part of this, it will animate an image file specified by the user. It is based heavily on the [P5](https://editor.p5js.org/icm/sketches/BJKWv5Tn) and [angular-sketchpad](https://github.com/andrewevans0102/angular-sketchpad) examples, but I have modified the behavior quite a bit since then.

# Demo
Check out https://jtasse.github.io/animated-logo to see the logo in action.

# Running the project
- Clone the repo
- Open the repo in your favorite IDE
- Run `npm install` to download dependencies
- Run `npm start`
- Open the project in a browser (default url is: http://localhost:4200/home-page)

# Changing the logo
By default, the project uses a logo I created. To change this:

- In an IDE, open `src\app\home-page\home-page.component.ts`
- Find the following code block...

```typescript
p.preload = () => {
	this.img = p.loadImage("assets/treats_logo_v3.png")
}
```

- ...and replace `assets/treats_logo_v3.png` with the relative path to your own image file (you will need to add the image to the project, of course)

> **NOTE**: I know, I really should move this to a configuration file at some point :)

# Other Options
If you look around the homepage component, you'll see there are a lot of options for things like colors, rotation speed, etc. At one point, I even modified this app to export the logo's frames for use in a video.

Just expect a lot of trial and error if you decide to make significant changes ;)

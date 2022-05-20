let controller;
let slideScene;
let pageScene;

function animateSlide() {
  //Init controller
  controller = new ScrollMagic.Controller();

  //Select somthing
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  //Loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    const slideTimeline = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    slideTimeline.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTimeline.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTimeline.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTimeline.fromTo(nav, { y: "-100%" }, { y: "0" }, "-=0.5");

    //Create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTimeline)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "slide",
      //   })
      .addTo(controller);

    //New Animation
    const pageTimeline = gsap.timeline();
    const nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];

    pageTimeline.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTimeline.fromTo(
      slide,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0.5 }
    );
    pageTimeline.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");

    //Create new Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      //   .addIndicators({
      //     // colorStart: "white",
      //     // colorTrigger: "white",
      //     // name: "page",
      //     indent: 200,
      //   })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTimeline)
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseTxt.innerHTML = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    mouseTxt.innerHTML = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}
//Barba Page Transition
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlide();
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
    },
  ],
  transition: [
    {
      leave({ current, next }) {
        let done = this.async();
        //An animation
        const tl = gsap.timeline({ default: { ease: "power2.inOut" } });
        tl.fromTo(
          current.container,
          1,
          { opacity: 1 },
          { opacity: 0, onComplete: done }
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //An Animation
        const tl = gsap.timeline({ default: { ease: "power2.inOut" } });
        tl.fromTo(
          next.container,
          1,
          { opacity: 0 },
          { opacity: 1, onComplete: done }
        );
      },
    },
  ],
});

//EventListeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);

animateSlide();

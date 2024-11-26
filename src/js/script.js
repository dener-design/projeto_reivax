const btnMenuMobile = document.querySelector(".exibir__menu");
const btnFecharMenu = document.querySelector(".fechar_menu__overlay");
const menuOverlay = document.querySelector(".menu__overlay");

btnMenuMobile.addEventListener("click", () => {
  menuOverlay.classList.add("active");
});

btnFecharMenu.addEventListener("click", () => {
  menuOverlay.classList.remove("active");
});

const menuLinks = document.querySelectorAll(".navegacao__principal_link");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
  });
});

const carousel = {
  currentSlide: 1,
  totalSlides: 2,
  isTransitioning: false,
  interval: null,
  autoplayTime: 5000,

  elements: {
    wrapper: document.querySelector(".o__que__fazemos"),
    foto: document.querySelector(".foto__produto"),
    controls: document.querySelectorAll(".controles__carousel"),
    contents: document.querySelectorAll(".carousel__topo_conteudo"),
    galeria: document.querySelector(".abrir__galeria__fotos__produtos"),
  },

  galleryUrls: {
    1: "/galeria-produtos/borracha-regenerada",
    2: "/galeria-produtos/po-de-borracha",
  },

  init() {
    this.goToSlide(1);

    this.elements.controls.forEach((control) => {
      const prev = control.querySelector(".voltar");
      const next = control.querySelector(".avancar");

      prev.addEventListener("click", (e) => {
        e.preventDefault();
        if (!prev.classList.contains("disabled")) {
          this.prevSlide();
        }
      });

      next.addEventListener("click", (e) => {
        e.preventDefault();
        if (!next.classList.contains("disabled")) {
          this.nextSlide();
        }
      });
    });

    this.startAutoplay();

    this.initTouchControls();
  },

  goToSlide(slideNumber) {
    const bgImage =
      slideNumber === 1
        ? "foto_borracha_1x.webp"
        : "foto_po_de_borracha_1x.webp";
    this.elements.foto.style.backgroundImage = `url('./public/img/${bgImage}')`;

    // Atualiza conteúdos
    this.elements.contents.forEach((content) => {
      content.style.display =
        content.getAttribute("data-slider") === String(slideNumber)
          ? "block"
          : "none";
    });

    this.elements.galeria.setAttribute("data-slider", String(slideNumber));
    this.elements.galeria.href = this.galleryUrls[slideNumber];

    this.updateControls(slideNumber);

    this.currentSlide = slideNumber;
  },

  updateSlide(direction = "next") {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const nextSlide =
      direction === "next"
        ? (this.currentSlide % this.totalSlides) + 1
        : this.currentSlide === 1
        ? this.totalSlides
        : this.currentSlide - 1;

    this.goToSlide(nextSlide);

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  },

  updateControls(slideNumber) {
    this.elements.controls.forEach((control) => {
      const prev = control.querySelector(".voltar");
      const next = control.querySelector(".avancar");

      // Reseta classes primeiro
      prev.classList.remove("disabled", "active");
      next.classList.remove("disabled", "active");

      // Aplica as classes corretas
      if (slideNumber === 1) {
        prev.classList.add("disabled");
        next.classList.add("active");
      } else if (slideNumber === this.totalSlides) {
        prev.classList.add("active");
        next.classList.add("disabled");
      }
    });
  },

  startAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.currentSlide === this.totalSlides) {
        this.currentSlide = 0;
      }
      this.nextSlide();
    }, this.autoplayTime);
  },

  nextSlide() {
    if (!this.isTransitioning) {
      this.updateSlide("next");
      this.restartAutoplay();
    }
  },

  prevSlide() {
    if (!this.isTransitioning) {
      this.updateSlide("prev");
      this.restartAutoplay();
    }
  },

  restartAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.startAutoplay();
  },

  initTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    };

    this.elements.wrapper.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.elements.wrapper.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  },
};

document.addEventListener("DOMContentLoaded", () => {
  carousel.init();
});

const carouselProcesso = {
  currentSlide: 1,
  totalSlides: 4,
  isTransitioning: false,
  interval: null,
  autoplayTime: 4500,
  pauseTime: 1000,
  isPaused: false,

  elements: {
    wrapper: document.querySelector(".nosso__processo"),
    slides: document.querySelectorAll(".slider__processo"),
    controls: document.querySelector(
      ".controles__carousel_processo .controles"
    ),
    bullets: document.querySelectorAll(
      ".lista__bullets__processo .bullet__processo"
    ),
    icon: document.querySelector(".controles__carousel_processo i"),
  },

  backgroundImages: {
    1: "./public/img/foto_processo_01_1x.webp",
    2: "./public/img/foto_processo_02_1x.webp",
    3: "./public/img/foto_processo_03_1x.webp",
    4: "./public/img/foto_processo_04_1x.webp",
  },

  init() {
    const prev = this.elements.controls.querySelector(".voltar");
    const next = this.elements.controls.querySelector(".avancar");

    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (!prev.classList.contains("disabled")) {
        this.prevSlide();
      }
    });

    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (!next.classList.contains("disabled")) {
        this.nextSlide();
      }
    });

    this.elements.bullets.forEach((bullet) => {
      bullet.addEventListener("click", (e) => {
        e.preventDefault();
        const slideNumber = parseInt(bullet.dataset.slide);
        if (!bullet.classList.contains("disabled")) {
          this.pauseAutoplay();
          this.goToSlide(slideNumber);
        }
      });
    });

    this.elements.wrapper.addEventListener("mouseenter", () =>
      this.pauseAutoplay()
    );
    this.elements.wrapper.addEventListener("mouseleave", () =>
      this.resumeAutoplay()
    );
    this.elements.wrapper.addEventListener(
      "touchstart",
      () => this.pauseAutoplay(),
      { passive: true }
    );
    this.elements.wrapper.addEventListener(
      "touchend",
      () => this.resumeAutoplay(),
      { passive: true }
    );

    this.startAutoplay();

    this.initTouchControls();
  },

  updateSlide(direction = "next") {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const nextSlide =
      direction === "next"
        ? (this.currentSlide % this.totalSlides) + 1
        : this.currentSlide === 1
        ? this.totalSlides
        : this.currentSlide - 1;

    this.goToSlide(nextSlide);
  },

  goToSlide(slideNumber) {
    // Atualiza slides
    this.elements.slides.forEach((slide) => {
      slide.style.display =
        slide.getAttribute("data-slider-processo") === String(slideNumber)
          ? "block"
          : "none";
    });

    this.elements.bullets.forEach((bullet) => {
      if (parseInt(bullet.dataset.slide) === slideNumber) {
        bullet.classList.add("disabled");
      } else {
        bullet.classList.remove("disabled");
      }
    });

    this.updateControls(slideNumber);

    this.updateBackground(slideNumber);

    this.currentSlide = slideNumber;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  },

  updateBackground(slideNumber) {
    this.elements.icon.style.backgroundImage = `url('${this.backgroundImages[slideNumber]}')`;
  },

  updateControls(slideNumber) {
    const prev = this.elements.controls.querySelector(".voltar");
    const next = this.elements.controls.querySelector(".avancar");

    prev.addEventListener("click", () => this.pauseAutoplay());
    next.addEventListener("click", () => this.pauseAutoplay());

    prev.classList.remove("disabled");
    next.classList.remove("disabled");

    if (slideNumber === 1) {
      prev.classList.add("disabled");
    } else if (slideNumber === this.totalSlides) {
      next.classList.add("disabled");
    }
  },

  pauseAutoplay() {
    this.isPaused = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },

  resumeAutoplay() {
    if (this.isPaused) {
      setTimeout(() => {
        this.isPaused = false;
        this.startAutoplay();
      }, this.pauseTime);
    }
  },

  startAutoplay() {
    if (this.interval) clearInterval(this.interval);

    if (!this.isPaused) {
      this.interval = setInterval(() => {
        if (this.currentSlide === this.totalSlides) {
          this.currentSlide = 0;
        }
        this.nextSlide();
      }, this.autoplayTime);
    }
  },

  nextSlide() {
    if (!this.isTransitioning) {
      this.updateSlide("next");
      this.restartAutoplay();
    }
  },

  prevSlide() {
    if (!this.isTransitioning) {
      this.updateSlide("prev");
      this.restartAutoplay();
    }
  },

  restartAutoplay() {
    if (this.interval) clearInterval(this.interval);
    this.startAutoplay();
  },

  initTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    };

    this.elements.wrapper.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.elements.wrapper.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );
  },
};

document.addEventListener("DOMContentLoaded", () => {
  carousel.init();
  carouselProcesso.init();
});

const header = document.querySelector("header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navegacao__principal_link");
const logoLink = document.querySelector(".logo__topo");
const btnToTop = document.querySelector(".btn__ir__para__o__topo");
let lastScroll = 0;
let isScrolling = false;

function smoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute("href");
  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    const headerHeight = header.offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

function handleScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      const currentScroll = window.pageYOffset;

      // Adicionar classe sticky após certa altura
      if (currentScroll > 100) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - header.offsetHeight - 10;
        const sectionHeight = section.offsetHeight;

        if (
          currentScroll >= sectionTop &&
          currentScroll < sectionTop + sectionHeight
        ) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${section.id}`) {
              link.classList.add("active");
            }
          });
        }
      });

      isScrolling = false;
    });
  }
  isScrolling = true;
}

window.addEventListener("scroll", handleScroll, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", smoothScroll);
});

logoLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

btnToTop.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

document.addEventListener("DOMContentLoaded", () => {
  handleScroll();
});

const footerLinks = document.querySelectorAll(".navegacao__footer_link");

footerLinks.forEach((link) => {
  link.addEventListener("click", smoothScroll);
});

const logoFooterLink = document.querySelector(".log__footer a");

logoFooterLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const vantagensSlider = {
  init() {
    const slider = document.querySelector(".slider__vantagens");
    const lista = document.querySelector(".lista__de__vantagens");
    let startX;
    let scrollLeft;

    // Touch events
    slider.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (window.innerWidth > 1250) return;
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = startX - x;
        slider.scrollLeft = scrollLeft + walk;
      },
      { passive: false }
    );

    slider.addEventListener("mousedown", (e) => {
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    });

    slider.addEventListener("mousemove", (e) => {
      if (window.innerWidth > 1250) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = startX - x;
      slider.scrollLeft = scrollLeft + walk;
    });

    slider.addEventListener("mouseup", () => {
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mouseleave", () => {
      slider.style.cursor = "grab";
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  vantagensSlider.init();
});

const depoimentosSlider = {
  init() {
    const slider = document.querySelector(".slider__depoimentos");
    let startX;
    let scrollLeft;

    slider.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchmove",
      (e) => {
        if (window.innerWidth > 1200) return;
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = startX - x;
        slider.scrollLeft = scrollLeft + walk;
      },
      { passive: false }
    );

    slider.addEventListener("mousedown", (e) => {
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    });

    slider.addEventListener("mousemove", (e) => {
      if (window.innerWidth > 1200) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = startX - x;
      slider.scrollLeft = scrollLeft + walk;
    });

    slider.addEventListener("mouseup", () => {
      slider.style.cursor = "grab";
    });

    slider.addEventListener("mouseleave", () => {
      slider.style.cursor = "grab";
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  depoimentosSlider.init();
});

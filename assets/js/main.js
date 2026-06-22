const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("hashchange", closeNav);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const parallaxItems = document.querySelectorAll(".parallax");
const updateParallax = () => {
  const scrollY = window.scrollY || 0;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    item.style.translate = `0 ${Math.round(scrollY * speed)}px`;
  });
};

window.addEventListener("scroll", updateParallax, { passive: true });
updateParallax();

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector(".contact-form-status");
  const defaultButtonLabel = submitButton?.innerHTML || "送信する";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity() || !submitButton || !status) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "送信中…";
    status.className = "contact-form-status";
    status.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      status.classList.add("is-success");
      status.textContent = "お問い合わせを送信しました。ありがとうございました。";
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = defaultButtonLabel;
    }
  });
}

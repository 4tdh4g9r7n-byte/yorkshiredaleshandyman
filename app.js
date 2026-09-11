document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileLinks = document.querySelectorAll("[data-mobile-menu] a");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");

      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
      );
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const quoteForm = document.querySelector("[data-quote-form]");
  const confirmation = document.querySelector("[data-confirmation]");
  const errorMessage = document.querySelector("[data-form-error]");
  const submitButton = document.querySelector("[data-submit-btn]");

  if (!quoteForm) return;

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (errorMessage) {
      errorMessage.hidden = true;
    }

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const formData = new FormData(quoteForm);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("The form could not be sent.");
      }

      quoteForm.reset();
      quoteForm.classList.add("is-hidden");

      if (confirmation) {
        confirmation.classList.add("is-visible");
        confirmation.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center"
        });
      }
    } catch (error) {
      if (errorMessage) {
        errorMessage.hidden = false;
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send My Details — Get a Quote";
      }
    }
  });
});

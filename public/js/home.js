const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("i");
  if (body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});






        
document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const wardrobeItems = document.querySelector(".wardrobe-items");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  let currentCategory = 0;

  function updateCategory(index) {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    categoryButtons[index].classList.add("active");
    wardrobeItems.style.transform = `translateX(-${index * 100}%)`;
    currentCategory = index;
  }

  categoryButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => updateCategory(index));
  });

  prevBtn.addEventListener("click", () => {
    currentCategory =
      (currentCategory - 1 + categoryButtons.length) % categoryButtons.length;
    updateCategory(currentCategory);
  });

  nextBtn.addEventListener("click", () => {
    currentCategory = (currentCategory + 1) % categoryButtons.length;
    updateCategory(currentCategory);
  });

  // Swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;

  wardrobeItems.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  wardrobeItems.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      currentCategory = (currentCategory + 1) % categoryButtons.length;
      updateCategory(currentCategory);
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right
      currentCategory =
        (currentCategory - 1 + categoryButtons.length) % categoryButtons.length;
      updateCategory(currentCategory);
    }
  }
});

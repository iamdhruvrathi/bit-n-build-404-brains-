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






        const wardrobe = document.querySelector('.wardrobe');
        const categoryButtons = document.querySelectorAll('.category-button');
        const prevButton = document.querySelector('.nav-button.prev');
        const nextButton = document.querySelector('.nav-button.next');
        let currentCategory = 0;
        const totalCategories = categoryButtons.length;

        function updateWardrobe() {
            wardrobe.style.transform = `translateX(-${currentCategory * 100}%)`;
            categoryButtons.forEach((button, index) => {
                button.classList.toggle('active', index === currentCategory);
            });
        }

        function changeCategory(direction) {
            currentCategory = (currentCategory + direction + totalCategories) % totalCategories;
            updateWardrobe();
        }

        categoryButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                currentCategory = index;
                updateWardrobe();
            });
        });

        prevButton.addEventListener('click', () => changeCategory(-1));
        nextButton.addEventListener('click', () => changeCategory(1));

        // Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        wardrobe.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        wardrobe.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                changeCategory(1); // Swipe left
            } else if (touchEndX - touchStartX > swipeThreshold) {
                changeCategory(-1); // Swipe right
            }
        }
    
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".navItem");
  const mobileNavItems = document.querySelectorAll(".mobileNavItem");
  const activeContainer = document.querySelector(".navItemActiveContainer");
  const mobileActiveContainer = document.querySelector(
    ".mobilenavItemActiveContainer"
  );

  const positions = [570, 370, 170, -30];
  const mobilePositions = [210, 140, 70, 0];

  // Function to update the active state
  function updateActiveState(index) {
    // Update active container position
    activeContainer.style.right = positions[index] + "px";
    mobileActiveContainer.style.bottom = mobilePositions[index] + "px";

    // Update active class for desktop nav items
    navItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update active class for mobile nav items
    mobileNavItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Initial active state based on current page URL
  const currentPath = window.location.pathname;
  let initialIndex = 0;
  if (currentPath.includes("/schedule")) {
    initialIndex = 1;
  }
  if (currentPath.includes("/episodes")) {
    initialIndex = 2;
  }
  if (currentPath.includes("/about")) {
    initialIndex = 3;
  }
  updateActiveState(initialIndex);

  // Event listeners for navigation items
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateActiveState(index);
    });
  });

  mobileNavItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateActiveState(index);
      mobileNav.style.display = "none";
    });
  });

  // Burger menu event listener
  const burgerMenu = document.querySelector(".burgerMenu");
  const mobileNav = document.querySelector(".mobileNav");
  burgerMenu.addEventListener("click", () => {
    mobileNav.style.display =
      mobileNav.style.display === "flex" ? "none" : "flex";
  });
});

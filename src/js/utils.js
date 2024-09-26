// Темная тема

export const darkModeHandle = () => {
  const darkModeSwitcher = document.getElementById("toggleDarkMode");
  const htmlElement = document.documentElement; // доступ к html элементу

  if (localStorage.getItem("mode") === "dark") {
    htmlElement.classList.add("dark");
    darkModeSwitcher.checked = true;
  }
  // localStorage – это основное хранилище данных, которое находится в объекте Window браузера. Можно сохранять любую информацию в localStorage, и она будет сохраняться даже при перезагрузке страницы или закрытии и повторном открытии браузера.

  darkModeSwitcher.addEventListener("input", () => {
    htmlElement.classList.toggle("dark"); // метод toggle используется для добавления или удаления класса у элемента в зависимости от его наличия.

    if (htmlElement.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
    } else {
      localStorage.setItem("mode", "light");
    }
  });
};

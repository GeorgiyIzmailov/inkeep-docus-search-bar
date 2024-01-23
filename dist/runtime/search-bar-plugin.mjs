import { defineNuxtPlugin } from "#app";
import { useRuntimeConfig } from "#imports";
function createInkeepScriptElement() {
  const script = document.createElement("script");
  script.src = "https://unpkg.com/@inkeep/widgets-embed@latest/dist/embed.js";
  script.type = "module";
  script.id = "inkeep-script";
  script.defer = true;
  document.head.appendChild(script);
  return script;
}
function createInkeepDivElement() {
  const div = document.createElement("div");
  div.id = "inkeep";
  return div;
}
function initializeInkeepWidget(inkeepConfig, isCurrentlyDark) {
  const inkeepScript = createInkeepScriptElement();
  inkeepScript.addEventListener("load", () => {
    const inkeepWidget = Inkeep().embed({
      componentType: "SearchBar",
      targetElement: document.getElementById("inkeep"),
      // Use the created div
      properties: {
        ...inkeepConfig,
        baseSettings: {
          ...inkeepConfig.baseSettings,
          colorMode: {
            forcedColorMode: isCurrentlyDark ? "dark" : "light"
          }
        }
      }
    });
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === "class") {
          const isDark = mutation.target.classList.contains("dark");
          inkeepWidget.render({
            baseSettings: {
              ...inkeepConfig.baseSettings,
              colorMode: {
                forcedColorMode: isDark ? "dark" : "light"
              }
            }
          });
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
  });
}
export default defineNuxtPlugin(() => {
  const {
    public: { inkeepConfig }
  } = useRuntimeConfig();
  if (!inkeepConfig) {
    throw new Error(
      "Configuration Error: inkeepConfig is missing in the Nuxt configuration file"
    );
  }
  if (document) {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const inkeepDiv = createInkeepDivElement();
    const rightSectionBar = document.querySelector(".right");
    if (rightSectionBar) {
      const observer = new MutationObserver(() => {
        rightSectionBar.appendChild(inkeepDiv);
      });
      observer.observe(document.documentElement, { attributes: true });
    }
    initializeInkeepWidget(inkeepConfig, isCurrentlyDark);
  }
});

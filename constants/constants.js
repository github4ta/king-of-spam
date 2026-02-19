export const BASES = {
  prod: "https://www.kingspan.com",
  stage: "https://stage.kingspan.com",
};

export const LANGS = {
  pl: "/pl/pl/",
  en: "/gb/en/",
};

export const PAGES = {
  home: "",
  about: { pl: "o-nas/", en: "about-us/" },
  contact: { pl: "kontakt/", en: "contact-us" },
  projects: { pl: "zrealizowane-projekty/", en: "" },
};

export const buildUrl = (domain, lang, page) => {
  const base = BASES[domain];
  const langPath = LANGS[lang];
  const pagePath =
    typeof PAGES[page] === "object"
      ? PAGES[page][lang] || ""
      : PAGES[page] || "";

  return `${base}${langPath}${pagePath}`;
};

export const button_accept_cookie = "#ccc-notify-accept";

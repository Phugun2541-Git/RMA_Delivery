const ICONS = Object.freeze({
  pin: "location_on",
  chevron: "chevron_right",
  search: "search",
  food: "restaurant",
  car: "directions_car",
  package: "inventory_2",
  sparkles: "auto_awesome",
  arrow: "arrow_forward",
  clock: "schedule",
  star: "star",
  home: "home",
  store: "storefront",
  receipt: "receipt_long",
  message: "chat_bubble",
  user: "person",
  sunny: "sunny",
  tune: "tune",
  arrowBack: "arrow_back",
  analytics: "analytics",
  menu: "menu_book",
  help: "help",
  map: "map",
  wallet: "account_balance_wallet",
  delivery: "local_shipping",
  notifications: "notifications",
  inbox: "inbox",
  wifiOff: "wifi_off",
  checkCircle: "check_circle",
  payments: "payments",
  camera: "photo_camera",
  error: "error_outline",
  light: "light_mode",
  dark: "dark_mode"
});

export function homeIcon(name, size = 20) {
  const iconSize = Math.max(12, Math.min(64, Number(size) || 20));
  const symbol = ICONS[name] || ICONS.sparkles;
  return `<span class="material-symbols-rounded home-symbol" aria-hidden="true" style="font-size:${iconSize}px">${symbol}</span>`;
}

const LEGACY_ICON_NAMES = Object.freeze({
  "⌕": "search", "⌖": "location_on", "▦": "qr_code", "▣": "notifications",
  "▤": "inbox", "▧": "photo_camera", "☏": "call", "⌂": "home",
  "✦": "auto_awesome", "⌁": "wifi_off", "◷": "schedule", "⌘": "sync",
  "⋯": "more_vert", "⋮": "more_vert", "›": "chevron_right", "★": "star",
  "📍": "location_on", "♡": "favorite", "⚙": "settings", "☼": "light_mode",
  "◐": "dark_mode", "✓": "check", "↗": "arrow_forward", "▱": "local_shipping",
  "◉": "two_wheeler", "▰": "directions_car"
});

export function replaceLegacyIcons(markup = "") {
  return String(markup).replace(/[⌕⌖▦▣▤▧☏⌂✦⌁◷⌘⋯⋮›★📍♡⚙☼◐✓↗▱◉▰]/gu, (legacy) => {
    const symbol = LEGACY_ICON_NAMES[legacy];
    return `<span class="material-symbols-rounded home-symbol legacy-icon" aria-hidden="true">${symbol}</span>`;
  });
}

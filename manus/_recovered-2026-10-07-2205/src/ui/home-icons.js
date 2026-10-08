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

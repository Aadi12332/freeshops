// src/data/filterConfig.js
export const filterConfig = {
    "Audio & Speakers": {
        priceRange: true,
        conditions: ["New", "Open box", "Used", "For parts"],
        brands: ["Sony", "JBL", "Bose", "Samsung"],
    },
    "Cell Phones & Accessories": {
        priceRange: true,
        conditions: ["New", "Used", "Reconditioned"],
        brands: ["Apple", "Samsung", "Google", "OnePlus"],
    },
    "Cameras & Photography": {
        priceRange: true,
        conditions: ["New", "Used"],
        brands: ["Canon", "Nikon", "Sony"],
    },
    "TV & Media players": {
        priceRange: true,
        conditions: ["New", "Open box", "Used"],
        brands: ["LG", "Samsung", "Sony"],
    },
    "Video games & Consoles": {
        priceRange: true,
        conditions: ["New", "Used"],
        platforms: ["PlayStation", "Xbox", "Nintendo Switch", "PC"],
    },
};

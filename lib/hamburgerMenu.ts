export type MenuTreeItem = {
  id: string;
  label: string;
  href?: string;
  futurePath?: string;
  children?: MenuTreeItem[];
};

export const hamburgerCategoryMenus: MenuTreeItem[] = [
  {
    id: "accesorios",
    label: "Accesorios",
    children: [
      { id: "auriculares", label: "Auriculares", href: "/airpods" },
      { id: "cargadores", label: "Cargadores", href: "/cargadores" },
      { id: "fundas", label: "Fundas", href: "/fundas" },
      {
        id: "vidrios-templados",
        label: "Vidrios templados",
        href: "/templados",
      },
    ],
  },
  {
    id: "tecnologia",
    label: "Tecnología",
    children: [
      {
        id: "playstation-5",
        label: "PlayStation 5",
        href: "/tienda",
        futurePath: "/tecnologia/playstation-5",
      },
      {
        id: "parlantes",
        label: "Parlantes",
        href: "/tienda",
        futurePath: "/tecnologia/parlantes",
      },
      {
        id: "smartwatch",
        label: "Smartwatch",
        href: "/tienda",
        futurePath: "/tecnologia/smartwatch",
      },
    ],
  },
  {
    id: "hogar",
    label: "Hogar",
    children: [
      {
        id: "tv",
        label: "TV",
        href: "/tienda",
        futurePath: "/hogar/tv",
      },
      {
        id: "termos",
        label: "Termos",
        href: "/tienda",
        futurePath: "/hogar/termos",
      },
    ],
  },
];

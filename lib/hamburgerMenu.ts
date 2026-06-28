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
      { id: "playstation-5", label: "PlayStation 5", href: "/tienda" },
      { id: "parlantes", label: "Parlantes", href: "/tienda" },
      { id: "smartwatch", label: "Smartwatch", href: "/tienda" },
    ],
  },
  {
    id: "hogar",
    label: "Hogar",
    children: [
      { id: "tv", label: "TV", href: "/tienda" },
      { id: "termos", label: "Termos", href: "/tienda" },
    ],
  },
];

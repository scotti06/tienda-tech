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
    id: "termos-vasos",
    label: "Termos y Vasos",
    children: [
      { id: "termos", label: "Termos", href: "/tienda/termos-vasos?sub=termos" },
      { id: "vasos", label: "Vasos", href: "/tienda/termos-vasos?sub=vasos" },
    ],
  },
  {
    id: "perfumes",
    label: "Perfumes",
    children: [
      {
        id: "perfumes-todos",
        label: "Ver perfumes",
        href: "/tienda/perfumes",
      },
    ],
  },
];

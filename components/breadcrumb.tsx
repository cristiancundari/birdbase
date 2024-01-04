import React from "react";
import { Breadcrumbs, Anchor, Card } from "@mantine/core";

interface BreadcrumbProps {
  items: { title: string; href: string }[];
}
function Breadcrumb({ items }: BreadcrumbProps) {
  const mapped = items.map((item, index) => (
    <Anchor href={item.href} key={index} c="dimmed" size="sm">
      {item.title}
    </Anchor>
  ));
  return (
    <Breadcrumbs separator="→" mb="sm">
      {mapped}
    </Breadcrumbs>
  );
}

export default Breadcrumb;

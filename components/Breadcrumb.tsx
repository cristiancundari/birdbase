import React from "react";
import { Breadcrumbs, Anchor, Card } from "@mantine/core";
import Link from "next/link";

interface BreadcrumbProps {
  items: { title: string; href: string }[];
}
function Breadcrumb({ items }: BreadcrumbProps) {
  const mapped = items.map((item, index) => (
    <Anchor href={item.href} key={index} c="dimmed" size="sm" component={Link}>
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

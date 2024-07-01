import React from "react";
import { Avatar, Layout, Menu } from "antd";
import { ItemType } from "antd/lib/menu/interface";
import Link from "next/link";
import Image from "next/image";
import { isUserInRole, logout, useUser } from "../../lib/api";
import { usePathname } from "next/navigation";
import { AccessRole } from "../../types";
import { Route } from "../../lib/routes";

const LoginButton = () => {
  const { data, isLoading } = useUser();
  const pathname = usePathname();
  if (pathname?.startsWith("/login")) {
    return <Link href="/login">Log In</Link>;
  }

  if (isLoading || !data) {
    return null;
  }
  return (
    <span
      title="Logout"
      onClick={async () => {
        await logout();
        location.reload();
      }}
    >
      <Avatar shape="square" src={data.avatar_url} />
      <span className="hide-below-sm">&nbsp;&nbsp;{data.email}</span>
    </span>
  );
};

const pages: (ItemType & {
  requiredRoles?: AccessRole[];
})[] = [
  {
    key: "default",
    label: (
      <Image priority src="/0x_logo.svg" height={30} width={30} alt="Logo" />
    ),
    requiredRoles: [AccessRole.MEMBER],
  },
  {
    key: "home",
    label: <Link href={Route.HOME}>Hours</Link>,
    requiredRoles: [AccessRole.MEMBER],
  },
  {
    key: "vacation",
    label: <Link href={Route.VACATION}>Vacation</Link>,
    requiredRoles: [AccessRole.MEMBER],
  },
  {
    key: "settings",
    label: <Link href={Route.SETTINGS}>Settings</Link>,
    requiredRoles: [AccessRole.MEMBER],
  },
  {
    key: "admin",
    label: <Link href={Route.ADMIN}>Admin</Link>,
    requiredRoles: [AccessRole.ADMIN, AccessRole.MANAGER],
  },
  { key: "login", label: <LoginButton /> },
];

export default function Header() {
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const filteredPages = pages.filter(
    (p) =>
      !p.requiredRoles ||
      (user && p.requiredRoles && isUserInRole(user, p.requiredRoles))
  );

  return (
    <Layout.Header className="header">
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[pathname?.split("/")[1] || "home"]}
        items={filteredPages}
      />
    </Layout.Header>
  );
}

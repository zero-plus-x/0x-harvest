import React from "react";
import { Menu, Layout, Avatar } from "antd";
import Link from "next/link";
import Image from "next/image";
import { logout, useUser } from "../../lib/api";
import { useRouter } from "next/dist/client/router";

export default function Header() {
  const { data, isLoading } = useUser();
  const router = useRouter();
  console.log(router.pathname.split("/")[1] || "home");
  return (
    <Layout.Header>
      <div
        style={{
          float: "left",
          width: "80px",
          height: "30px",
          marginTop: 10,
          marginLeft: 30,
        }}
      >
        <Image src="/0x_logo.svg" height={30} width={30} alt="Logo" />
      </div>
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[router.pathname.split("/")[1] || "home"]}
      >
        <Menu.Item key="home">
          <Link href="/">Hours</Link>
        </Menu.Item>
        <Menu.Item key="vacation">
          <Link href="/vacation">Vacation</Link>
        </Menu.Item>
        <Menu.Item key="settings">
          <Link href="/settings">Settings</Link>
        </Menu.Item>
        {!isLoading && (
          <Menu.Item key="login">
            {data ? (
              <span
                title="Logout"
                onClick={async () => {
                  await logout();
                  location.reload();
                }}
              >
                <Avatar shape="square" src={data.avatar_url} /> {data.email}
              </span>
            ) : (
              <Link href="/login">Log In</Link>
            )}
          </Menu.Item>
        )}
      </Menu>
    </Layout.Header>
  );
}

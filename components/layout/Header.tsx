import React from "react";
import { Menu, Layout, Avatar } from "antd";
import Link from "next/link";
import Image from "next/image";
import { logout, useUser } from "../../lib/api";

export default function Header() {
  const { data, isLoading } = useUser();

  return (
    <Layout.Header>
      <div
        style={{
          float: "left",
          width: "80px",
          height: "30px",
          marginTop: 10,
        }}
      >
        <Image src="/0x_logo.svg" height={30} width={30} alt="Logo" />
      </div>
      <Menu mode="horizontal">
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

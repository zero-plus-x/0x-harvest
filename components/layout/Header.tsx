import React from "react";
import { Menu, Layout, Avatar } from "antd";
import Link from "next/link";
import Image from "next/image";
import { logout, useUser } from "../../lib/api";
import { useRouter } from "next/dist/client/router";

export default function Header() {
  const { data, isLoading } = useUser();
  const router = useRouter();

  return (
    <Layout.Header className="header">
      <div className="logo">
        <Image src="/0x_logo.svg" height={30} width={30} alt="Logo" />
      </div>
      <style jsx>{`
        .logo {
          float: left;
          width: 80px;
          height: 30px;
          margin-top: 10px;
          margin-left: 30px;
        }

        @media (max-width: 576px) {
          .logo {
            margin-left: 0px;
            width: 50px;
          }
        }
      `}</style>
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[router.pathname.split("/")[1] || "home"]}
        items={[
          { key: "home", label: <Link href="/">Hours</Link> },
          { key: "vacation", label: <Link href="/vacation">Vacation</Link> },
          { key: "settings", label: <Link href="/settings">Settings</Link> },
          {
            key: "login",
            label: !isLoading && (
              <>
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
              </>
            ),
          },
        ]}
      />
    </Layout.Header>
  );
}

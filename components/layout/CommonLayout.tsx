import React from "react";
import { Col, Layout, Row } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import Header from "./Header";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content style={{ paddingTop: 15 }}>
        <Row>
          <Col xxl={5} xl={4} lg={2} md={2} sm={1} xs={0}></Col>
          <Col
            xxl={14}
            xl={16}
            lg={20}
            md={20}
            sm={22}
            xs={24}
            style={{ paddingTop: 20, paddingBottom: 50 }}
          >
            {children}
          </Col>
          <Col xxl={5} xl={4} lg={2} md={2} sm={1} xs={0}></Col>
        </Row>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        Feature requests and bug reports welcome at GitHub{" "}
        <a
          href="https://github.com/jakubkottnauer/0x-harvest"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
        </a>
      </Layout.Footer>
    </Layout>
  );
}

import React from "react";
import { Card, Col, Row, Skeleton } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import { isUserInRole, useUser } from "../lib/api";
import { cachePage } from "../lib/caching";
import { useRouter } from "next/router";
import { AccessRole } from "../types";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  cachePage(res);
  return {
    props: {},
  };
};

const Admin: NextPage = () => {
  const router = useRouter();
  const { data: user } = useUser();

  React.useEffect(() => {
    if (user && !isUserInRole(user, [AccessRole.ADMIN, AccessRole.MANAGER])) {
      router.push({
        pathname: "/",
      });
    }
  }, [user]);

  if (!user) {
    return <Skeleton />;
  }

  return (
    <Row gutter={20}>
      <Col md={12} xs={24}>
        <VacationAllowanceCard />
      </Col>
    </Row>
  );
};

const VacationAllowanceCard = () => {
  return (
    <Card>
      <Card.Meta title="Add red days to all users" />
    </Card>
  );
};

export default Admin;

import { Button, PageHeader, Typography } from "antd";
import type { NextPage } from "next";

const Login: NextPage = () => {
  return (
    <PageHeader title="Welcome 0+x-er!">
      <Typography.Paragraph>
        This new Harvest frontend will hopefully make tracking your worked hours
        a breeze. To start, click the button below to log in through Harvest.
      </Typography.Paragraph>
      <Button onClick={() => window.location.replace("/api/oauth2")}>
        Log in with Harvest
      </Button>
    </PageHeader>
  );
};

export default Login;

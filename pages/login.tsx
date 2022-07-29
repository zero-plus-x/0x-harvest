import { Button, PageHeader, Typography } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import { cachePage } from "../lib/caching";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  cachePage(res);
  return {
    props: {},
  };
};

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
      {process.env.NODE_ENV !== "production" && (
        <div>
          <br />
          <Button
            onClick={() => window.location.replace("/api/e2e-test-login")}
            id="e2e-test-login"
          >
            mock server login (hidden in prod)
          </Button>
        </div>
      )}
    </PageHeader>
  );
};

export default Login;

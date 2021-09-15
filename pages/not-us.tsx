import { Result } from "antd";
import type { NextPage } from "next";
import CommonLayout from "../components/layout/CommonLayout";

const Settings: NextPage = () => {
  return (
    <CommonLayout>
      <Result
        status="403"
        title="No time logging for you"
        subTitle="Sorry, this app is only meant to be used by Hyper One employees."
      />
    </CommonLayout>
  );
};

export default Settings;

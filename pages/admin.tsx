import React, { useState } from "react";
import { Button, Card, Col, Row, Select, Skeleton, Spin } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import {
  createTimeEntry,
  FALLBACK_HOURS,
  isUserInRole,
  Project,
  PUBLIC_HOLIDAY_TASK_ID,
  useAllUsers,
  useUser,
} from "../lib/api";
import { cachePage } from "../lib/caching";
import { useRouter } from "next/router";
import { AccessRole, AdminRoles, User } from "../types";
import { delay, partitionArray, useRedirectIfNotInRole } from "../lib/utils";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { Route } from "../lib/routes";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  cachePage(res);
  return {
    props: {},
  };
};

const Admin: NextPage = () => {
  const { data: user } = useUser();
  useRedirectIfNotInRole(Route.HOME, AdminRoles);

  if (!user) {
    return <Skeleton />;
  }

  return (
    <Row gutter={20}>
      <Col md={12} xs={24}>
        <AllUsersTaskEntry />
      </Col>
    </Row>
  );
};

// TODO: make this configurable in the UI and fetch the list from somewhere
const redDays: { date: string; note: string }[] = [
  { date: "2023-05-01", note: "Första maj" },
  { date: "2023-05-18", note: "Kristi himmelsfärds dag" },
  { date: "2023-06-06", note: "Sveriges nationaldag" },
  { date: "2023-06-23", note: "Midsommarafton" },
  { date: "2023-12-25", note: "Juldagen" },
  { date: "2023-12-26", note: "Annandag jul" },
];

const SLEEP_BATCH_SECONDS = 15;

const ALL_USERS_FAKE_ID = -1;

const AllUsersTaskEntry = () => {
  const { data: users, isLoading } = useAllUsers();
  const [loading, setLoading] = useState(false);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
  if (isLoading) {
    return <Skeleton />;
  }

  const userList = users?.users || [];
  const activeUsers = userList.filter((user) => user.is_active);

  const usersToBeProcessed =
    selectedUsers[0] === ALL_USERS_FAKE_ID
      ? activeUsers.map((u) => u.id)
      : selectedUsers;

  const haveProcessedAll =
    usersToBeProcessed.length > 0 &&
    totalProcessed === usersToBeProcessed.length;
  return (
    <Card>
      <Card.Meta title="Add red days to users" />
      <UserSelect
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        allUsers={activeUsers}
      />
      {activeUsers.length > 0 ? (
        <>
          <p style={{ marginTop: 10 }}>
            {usersToBeProcessed.length === 0
              ? "Please select some users in the dropdown in order to create time entries "
              : `Clicking the button below will create new time entries for
            ${usersToBeProcessed.length} user${
                  usersToBeProcessed.length > 1 ? "s" : ""
                } `}
            on the following dates:
          </p>
          <ul>
            {redDays.map((day) => (
              <li key={day.date}>
                {day.date} - {day.note}
              </li>
            ))}
          </ul>
          <p>
            Note that we currently do not check for existing time entries, so
            running this multiple times for one user will create duplicate
            entries in their time sheet.
          </p>
          <Button
            disabled={loading || !usersToBeProcessed.length}
            loading={loading}
            type="primary"
            onClick={async () => {
              setTotalProcessed(0);
              setLoading(true);
              // send requests in batches due to harvest api rate limiting
              const batches = partitionArray(usersToBeProcessed, 10);

              for (const [batchIndex, batch] of batches.entries()) {
                const promises = batch.flatMap((userId) =>
                  redDays.map((day) =>
                    createTimeEntry(
                      day.date,
                      Project.ABSENCE,
                      PUBLIC_HOLIDAY_TASK_ID,
                      FALLBACK_HOURS,
                      day.note,
                      userId
                    )
                  )
                );
                await Promise.all(promises);
                setTotalProcessed((p) => p + batch.length);
                if (batchIndex < batches.length - 1) {
                  await delay(SLEEP_BATCH_SECONDS);
                }
              }
              setLoading(false);
            }}
          >
            Create time entries
          </Button>
          {loading && !haveProcessedAll && (
            <span>
              {" "}
              Processed {totalProcessed}/{activeUsers.length} users... <Spin />
              <br />
              Keep the browser tab open, we sleep for {SLEEP_BATCH_SECONDS}{" "}
              seconds after processing a batch of users to avoid triggering rate
              limiting in Harvest API.
            </span>
          )}
          {!loading && haveProcessedAll && (
            <span>
              {" "}
              Done <CheckCircleTwoTone twoToneColor="#52c41a" />
            </span>
          )}
        </>
      ) : (
        <>No users have been fetched, you probably lack permissions.</>
      )}
    </Card>
  );
};

const UserSelect = ({
  selectedUsers,
  setSelectedUsers,
  allUsers,
}: {
  selectedUsers: number[];
  setSelectedUsers: (ids: number[]) => void;
  allUsers: User[];
}) => {
  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%", marginTop: 10 }}
      placeholder="Select users..."
      value={selectedUsers}
      onChange={(value: number[]) => {
        let newValue =
          selectedUsers.includes(ALL_USERS_FAKE_ID) && value.length === 2
            ? value.filter((v) => v !== ALL_USERS_FAKE_ID)
            : value;

        newValue = newValue.includes(ALL_USERS_FAKE_ID)
          ? [ALL_USERS_FAKE_ID]
          : newValue;

        setSelectedUsers(newValue);
      }}
      filterOption={(inputValue, option) =>
        !!option?.label
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase())
      }
      options={[
        { label: `All ${allUsers.length} users`, value: ALL_USERS_FAKE_ID },
        ...allUsers
          .map((user) => ({
            label: `${user.first_name} ${user.last_name}`,
            value: user.id,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ]}
    />
  );
};

export default Admin;

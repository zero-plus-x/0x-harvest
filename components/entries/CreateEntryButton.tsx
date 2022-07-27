import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, message } from "antd";
import { useState } from "react";
import {
  createTimeEntry,
  FALLBACK_HOURS,
  HARVEST_DATE_FORMAT,
  specialTasks,
  useProjectAssignments,
} from "../../lib/api";
import { TimeEntry } from "../../types";
import { Day, isSoftwareDevTask, usePrimaryTask } from "../../utils";

const CreateEntryButton = ({
  day,
  loadMonth,
  setEntries,
  type,
}: {
  day: Day;
  loadMonth: () => Promise<void>;
  setEntries: (
    fn: (e: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => void;
  type?: "regular" | "small";
}) => {
  const [loading, setLoading] = useState(false);

  const primaryTask = usePrimaryTask();
  const { data: projectAssignments } = useProjectAssignments();

  const createEntry = async (
    projectId: number,
    taskId: number,
    hours?: number
  ) => {
    setLoading(true);
    const response = await createTimeEntry(
      day.date.format(HARVEST_DATE_FORMAT),
      projectId,
      taskId,
      hours
    );
    setLoading(false);
    if (response.status === 201) {
      message.success("New entry created!");

      setEntries((prevEntries) => {
        if (!prevEntries) {
          return prevEntries;
        }
        return [...prevEntries, response.data].sort((a, b) =>
          b.spent_date.localeCompare(a.spent_date)
        );
      });
    } else {
      message.error("Something went wrong while creating entry.");
      await loadMonth();
    }
  };

  const menu = (
    <Menu
      items={projectAssignments?.map((p) => ({
        key: p.project.id,
        label: p.project.name,
        type: "group",
        children: p.task_assignments.map((t) => {
          const override = specialTasks[t.task.id];
          return {
            key: t.task.id,
            onClick: () => createEntry(p.project.id, t.task.id, FALLBACK_HOURS),
            label: (
              <>
                {t.task.name} {override?.emoji}{" "}
                {primaryTask?.taskId === t.task.id ? (
                  <>
                    (current <i>work</i>)
                  </>
                ) : null}
              </>
            ),
          };
        }),
      }))}
    />
  );

  if (type === "small") {
    return (
      <Dropdown overlay={menu}>
        <Button>
          <PlusOutlined />
        </Button>
      </Dropdown>
    );
  }
  return (
    <Dropdown.Button
      overlay={menu}
      disabled={loading}
      onClick={async () => {
        if (primaryTask) {
          await createEntry(
            primaryTask.projectId,
            primaryTask.taskId,
            FALLBACK_HOURS
          );
        }
      }}
    >
      <PlusOutlined /> {FALLBACK_HOURS}&nbsp;
      <>
        <span>h</span>
        <span className="hide-below-md">our</span>
      </>
      &nbsp;
      {isSoftwareDevTask(primaryTask?.taskName)
        ? "work"
        : primaryTask?.taskName}
    </Dropdown.Button>
  );
};

export default CreateEntryButton;

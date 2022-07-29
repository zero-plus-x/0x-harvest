import { render, screen } from "@testing-library/react";
import TaskName from "../TaskName";
import "@testing-library/jest-dom";

describe("TaskName", () => {
  it("renders a correct name for software dev task", () => {
    const { container } = render(
      <TaskName
        entry={{
          projectId: 1,
          projectName: "Test Project",
          taskId: 2,
          taskName: "Software Development",
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders a correct name for a regular task", () => {
    const { container } = render(
      <TaskName
        entry={{
          projectId: 1,
          projectName: "Test Project",
          taskId: 2,
          taskName: "Cool Task",
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders a correct name for a special task", () => {
    const { container } = render(
      <TaskName
        entry={{
          projectId: 1,
          projectName: "Test Project",
          taskId: 8114249,
          taskName: "Cool Task",
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});

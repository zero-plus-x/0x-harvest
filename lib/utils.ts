import { useRouter } from "next/router";
import { isUserInRole, useUser } from "./api";
import React from "react";
import { AccessRole } from "../types";

export const delay = (seconds: number) =>
  new Promise((res) => setTimeout(res, seconds * 1000));

export const partitionArray = <T>(array: T[], chunkSize: number) => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};

export const useRedirectIfNotInRole = (
  redirectTo: string,
  requiredRoles: AccessRole[]
) => {
  const router = useRouter();
  const { data: user } = useUser();

  React.useEffect(() => {
    if (user && !isUserInRole(user, requiredRoles)) {
      router.push({
        pathname: redirectTo,
      });
    }
  }, [user, router]);
};

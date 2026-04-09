import type { ProjectSeed } from "@/types";
import { finTrackProject } from "./fintrack";
import { launchPadProject } from "./launchpad";
import { shopFlowProject } from "./shopflow";

export const seededProjects: ProjectSeed[] = [
  finTrackProject,
  launchPadProject,
  shopFlowProject,
];

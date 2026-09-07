import type { ResearchProject } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { AnalysisStatus } from "@/features/research-projects/interfaces/research-projects.interfaces";

export const isSameMonth = (value: string, reference: Date): boolean => {
    const date = new Date(value);
    return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
};

export const sumBy = (projects: ResearchProject[], selector: (project: ResearchProject) => number): number => {
    return projects.reduce((total, project) => total + selector(project), 0);
};

export const getCompletedProjects = (projects: ResearchProject[]): ResearchProject[] => {
    return projects.filter((project) => project.status === AnalysisStatus.COMPLETED);
};

export const getRunningProjects = (projects: ResearchProject[]): ResearchProject[] => {
    return projects.filter(
        (project) => project.status !== AnalysisStatus.COMPLETED && project.status !== AnalysisStatus.FAILED,
    );
};

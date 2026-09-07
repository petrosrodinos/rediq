import { useState } from "react";

export interface LocalProfileFields {
    full_name: string;
    job_title: string;
    timezone: string;
    research_focus: string;
}

const STORAGE_KEY = "threadline:settings:local-profile-fields";

const defaultFields: LocalProfileFields = {
    full_name: "",
    job_title: "",
    timezone: "",
    research_focus: "",
};

const readStoredFields = (): LocalProfileFields => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultFields;
        return { ...defaultFields, ...JSON.parse(raw) };
    } catch {
        return defaultFields;
    }
};

/**
 * The backend `User` model only has email/phone/role — full name, job title,
 * timezone and research focus have nowhere real to persist yet, so they're
 * kept on-device only until a profile field exists server-side.
 */
export const useLocalProfileFields = () => {
    const [fields, setFieldsState] = useState<LocalProfileFields>(readStoredFields);

    const saveFields = (next: LocalProfileFields) => {
        setFieldsState(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // best-effort only — device storage isn't guaranteed
        }
    };

    return { fields, saveFields };
};

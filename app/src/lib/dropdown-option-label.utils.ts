interface DropdownOptionLike {
    id: string;
    label: string;
}

export function getDropdownOptionLabel<T extends DropdownOptionLike>(options: T[], id: string | null | undefined): string {
    return options.find((option) => option.id === id)?.label ?? (id ?? "");
}

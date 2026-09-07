import { PostSortOrder, type PostSortOrderType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

export const PostSortOrderFormOptions: { id: PostSortOrderType; label: string }[] = [
    { id: PostSortOrder.HOT, label: "Hot" },
    { id: PostSortOrder.TOP, label: "Top" },
    { id: PostSortOrder.NEW, label: "New" },
    { id: PostSortOrder.RISING, label: "Rising" },
    { id: PostSortOrder.CONTROVERSIAL, label: "Controversial" },
];

export function getPostSortOrderLabel(value: PostSortOrderType | string): string {
    return PostSortOrderFormOptions.find((option) => option.id === value)?.label ?? value;
}

import type { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateResearchProject } from "@/features/research-projects/hooks/use-research-projects";
import { renameProjectSchema, type RenameProjectFormData } from "../validation-schemas/rename-project.schema";

interface RenameProjectDialogProps {
  projectId: string | null;
  currentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RenameProjectDialog: FC<RenameProjectDialogProps> = ({ projectId, currentName, isOpen, onClose }) => {
  const updateProject = useUpdateResearchProject();

  const form = useForm<RenameProjectFormData>({
    resolver: zodResolver(renameProjectSchema),
    defaultValues: { name: currentName },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ name: currentName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentName]);

  const onSubmit = form.handleSubmit((data) => {
    if (!projectId) return;
    updateProject.mutate(
      { id: projectId, dto: { name: data.name } },
      {
        onSuccess: () => onClose(),
      },
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !updateProject.isPending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={updateProject.isPending}>
                Cancel
              </Button>
              <Button type="submit" loading={updateProject.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

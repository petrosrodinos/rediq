import { useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useUpdateMe } from "@/features/user/hooks/use-user";
import { updateProfileSchema, type UpdateProfileFormData } from "../validation-schemas/profile.schema";
import { useLocalProfileFields } from "../hooks/use-local-profile-fields";
import { TimezoneOptions } from "@/config/constants/dropdowns/timezone.options";
import { toast } from "@/hooks/use-toast";

export const ProfilePane: FC = () => {
  const me = useGetMe();
  const updateMe = useUpdateMe();
  const { fields: localFields, saveFields } = useLocalProfileFields();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: "",
      full_name: localFields.full_name,
      job_title: localFields.job_title,
      timezone: localFields.timezone,
      research_focus: localFields.research_focus,
    },
  });

  useEffect(() => {
    if (!me.data) return;
    form.reset({
      email: me.data.email,
      full_name: localFields.full_name,
      job_title: localFields.job_title,
      timezone: localFields.timezone,
      research_focus: localFields.research_focus,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.data]);

  const initials = (localFields.full_name || me.data?.email || "U").slice(0, 2).toUpperCase();

  const onSubmit = (values: UpdateProfileFormData) => {
    saveFields({
      full_name: values.full_name ?? "",
      job_title: values.job_title ?? "",
      timezone: values.timezone ?? "",
      research_focus: values.research_focus ?? "",
    });

    if (values.email !== me.data?.email) {
      updateMe.mutate({ email: values.email });
    } else {
      toast({ title: "Profile updated", description: "Your changes were saved.", duration: 2000 });
    }
  };

  if (me.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
        <CardDescription>How you show up across Threadline.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="font-mono text-sm font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => toast({ title: "Photo uploads aren't wired up yet", duration: 2000 })}
                >
                  Change photo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toast({ title: "Photo uploads aren't wired up yet", duration: 2000 })}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mara Ruiz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input placeholder="Independent researcher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time zone</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select a time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TimezoneOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="research_focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research focus</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What you're usually digging for — used to help rank results toward what matters to you."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground">
              Only your email is stored on our servers today. Full name, job title, time zone and research focus are
              saved on this device only, until we add real profile fields for them.
            </p>

            <div className="flex gap-2">
              <Button type="submit" loading={updateMe.isPending}>
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

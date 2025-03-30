"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
  repoUrl: z.string().url({
    message: "Please enter a valid GitHub repository URL.",
  }),
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  githubToken: z.string().optional(),
});

const CreatePage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
      projectName: "",
      githubToken: "",
    },
  });

  // Mutation for submitting the form
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/connect-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to connect repository");
      }

      return res.json();
    },
    onSuccess: () => {
      setMessage(" Repository linked successfully!");
      form.reset();
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setMessage(null); // Clear previous messages
    mutation.mutate(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Link GitHub Repository</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your repository URL and project details to get started
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL of your GitHub repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a display name for your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Token (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      For private repositories or increased API limits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {message && (
                <p className={`text-sm ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
                  {message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Connecting..." : "Connect Repository"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;

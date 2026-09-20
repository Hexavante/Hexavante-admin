"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api-url";

const API_URL = getApiUrl();

// Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  courseType: string;
  level: string;
  estimatedHours: number | null;
  totalModules: number;
  totalLessons: number;
  instructorName: string;
  createdAt: string;
}

export interface CourseDetail extends Course {
  description: string | null;
  coverImage: string | null;
  progressionType: string;
  status: string;
  modules: {
    id: string;
    title: string;
    description: string | null;
    orderNumber: number;
    lessons: {
      id: string;
      title: string;
      description: string | null;
      duration: number | null;
      orderNumber: number;
    }[];
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  courseType?: string;
}

// Query Keys
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params: CourseQueryParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Hooks
export function useCourses(params: CourseQueryParams = {}) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Course>> => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.search) searchParams.set("search", params.search);
      if (params.level) searchParams.set("level", params.level);
      if (params.courseType) searchParams.set("courseType", params.courseType);

      const res = await fetch(
        `${API_URL}/api/v1/courses?${searchParams.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async (): Promise<CourseDetail> => {
      const res = await fetch(`${API_URL}/api/v1/courses/${id}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await fetch(`${API_URL}/api/v1/courses/${courseId}/enroll`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to enroll");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch course details
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

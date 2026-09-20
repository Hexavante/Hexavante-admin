/** Serializers for REST API v1 responses — keeps payloads stable for Ionic/Tauri clients. */

type CourseListRow = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  level: string | null;
  courseType: string;
  category: { id: string; name: string } | null;
  instructors: Array<{
    user: { fullName: string; username: string | null };
  }>;
  _count?: { modules: number; enrollments: number };
};

export function serializeCourseSummary(course: CourseListRow) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    shortDescription: course.shortDescription,
    thumbnailUrl: course.thumbnailUrl,
    level: course.level,
    courseType: course.courseType,
    category: course.category,
    instructors: course.instructors.map((row) => ({
      name: row.user.fullName,
      username: row.user.username,
    })),
    moduleCount: course._count?.modules ?? 0,
    enrollmentCount: course._count?.enrollments ?? 0,
  };
}

type CourseDetailRow = CourseListRow & {
  description: string | null;
  modules: Array<{
    id: string;
    title: string;
    orderNumber: number;
    lessons: Array<{
      id: string;
      title: string;
      orderNumber: number;
      duration?: number | null;
      durationMinutes?: number | null;
    }>;
  }>;
};

export function serializeCourseDetail(course: CourseDetailRow) {
  return {
    ...serializeCourseSummary(course),
    description: course.description,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      orderNumber: module.orderNumber,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        orderNumber: lesson.orderNumber,
        durationMinutes: lesson.durationMinutes ?? lesson.duration ?? null,
      })),
    })),
  };
}

type ExamListRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  examType: string;
  timeLimit?: number | null;
  durationMinutes?: number | null;
  isPremiumOnly: boolean;
  coverImage?: string | null;
  coverImageUrl?: string | null;
  _count?: { questions?: number; attempts?: number };
};

export function serializeExamSummary(exam: ExamListRow) {
  return {
    id: exam.id,
    title: exam.title,
    slug: exam.slug,
    description: exam.description,
    examType: exam.examType,
    durationMinutes: exam.durationMinutes ?? exam.timeLimit ?? null,
    isPremiumOnly: exam.isPremiumOnly,
    coverImageUrl: exam.coverImageUrl ?? exam.coverImage ?? null,
    questionCount: exam._count?.questions ?? 0,
    attemptCount: exam._count?.attempts ?? 0,
  };
}

type ExamDetailRow = ExamListRow & {
  questions: Array<{
    id: string;
    type: string;
    subject: string | null;
    difficulty: number | string | null;
    orderNumber: number;
  }>;
};

export function serializeExamDetail(exam: ExamDetailRow) {
  return {
    ...serializeExamSummary(exam),
    questions: exam.questions.map((q) => ({
      id: q.id,
      type: q.type,
      subject: q.subject,
      difficulty: q.difficulty,
      orderNumber: q.orderNumber,
    })),
  };
}

export function serializeEnrollment(row: {
  id: string;
  progress: number;
  enrolledAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    level: string | null;
    category: { name: string } | null;
  };
}) {
  return {
    id: row.id,
    progress: row.progress,
    enrolledAt: row.enrolledAt.toISOString(),
    course: {
      id: row.course.id,
      title: row.course.title,
      slug: row.course.slug,
      thumbnailUrl: row.course.thumbnailUrl,
      level: row.course.level,
      categoryName: row.course.category?.name ?? null,
    },
  };
}

export function serializeNotification(row: {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    link: row.link,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function serializeUserProfile(user: {
  id: string;
  username: string | null;
  fullName: string;
  email: string;
  bio: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  profileVisibility: string;
  avatarUrl: string | null;
}) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    phone: user.phone,
    city: user.city,
    state: user.state,
    profileVisibility: user.profileVisibility,
    avatarUrl: user.avatarUrl,
  };
}

export function serializeExamAttempt(attempt: {
  id: string;
  examId: string;
  studyMode: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  startedAt: Date;
  finishedAt: Date | null;
  dailyAttemptIndex?: number | null;
  dailyRewardMultiplier?: number | null;
}) {
  return {
    id: attempt.id,
    examId: attempt.examId,
    studyMode: attempt.studyMode,
    totalQuestions: attempt.totalQuestions,
    correctAnswers: attempt.correctAnswers,
    score: attempt.score,
    startedAt: attempt.startedAt.toISOString(),
    finishedAt: attempt.finishedAt?.toISOString() ?? null,
    dailyAttemptIndex: attempt.dailyAttemptIndex ?? null,
    dailyRewardMultiplier: attempt.dailyRewardMultiplier ?? null,
  };
}

type ExamQuestionTakingRow = {
  id: string;
  type: string;
  statement: string;
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageDisplaySize: string | null;
  orderNumber: number;
  subject: string | null;
  difficulty: number;
  alternatives?: Array<{ id: string; text: string }>;
};

export function serializeExamQuestionForTaking(question: ExamQuestionTakingRow) {
  return {
    id: question.id,
    type: question.type,
    statement: question.statement,
    imageUrl: question.imageUrl,
    imageWidth: question.imageWidth,
    imageHeight: question.imageHeight,
    imageDisplaySize: question.imageDisplaySize,
    orderNumber: question.orderNumber,
    subject: question.subject,
    difficulty: question.difficulty,
    alternatives: question.alternatives?.map((alt) => ({
      id: alt.id,
      text: alt.text,
    })) ?? [],
  };
}

export function serializeAttemptResult(attempt: {
  id: string;
  examId: string;
  studyMode: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  startedAt: Date;
  finishedAt: Date | null;
  dailyAttemptIndex?: number | null;
  dailyRewardMultiplier?: number | null;
  exam: {
    id: string;
    title: string;
    slug: string;
    timeLimit: number | null;
  };
  answers: Array<{
    id: string;
    questionId: string;
    alternativeId: string | null;
    essayAnswer: string | null;
    essayStatus: string | null;
    isCorrect: boolean;
    question: {
      id: string;
      type: string;
      statement: string;
      orderNumber: number;
      subject: string | null;
      difficulty: number;
      explanation: string | null;
      alternatives: Array<{ id: string; text: string; isCorrect: boolean }>;
    };
    alternative: { id: string; text: string; isCorrect: boolean } | null;
  }>;
}) {
  const pendingEssays = attempt.answers.filter((a) => a.essayStatus === "PENDING").length;

  return {
    attempt: serializeExamAttempt(attempt),
    exam: {
      id: attempt.exam.id,
      title: attempt.exam.title,
      slug: attempt.exam.slug,
      timeLimitMinutes: attempt.exam.timeLimit,
    },
    pendingEssays,
    answers: attempt.answers.map((answer) => ({
      id: answer.id,
      questionId: answer.questionId,
      alternativeId: answer.alternativeId,
      essayAnswer: answer.essayAnswer,
      essayStatus: answer.essayStatus,
      isCorrect: answer.isCorrect,
      question: {
        id: answer.question.id,
        type: answer.question.type,
        statement: answer.question.statement,
        orderNumber: answer.question.orderNumber,
        subject: answer.question.subject,
        difficulty: answer.question.difficulty,
        explanation: answer.question.explanation,
        alternatives: answer.question.alternatives.map((alt) => ({
          id: alt.id,
          text: alt.text,
          isCorrect: alt.isCorrect,
        })),
      },
      selectedAlternative: answer.alternative
        ? {
            id: answer.alternative.id,
            text: answer.alternative.text,
          }
        : null,
    })),
  };
}

export function serializeLessonDetail(data: {
  course: {
    id: string;
    title: string;
    slug: string;
    progressionType: string;
    estimatedHours: number | null;
    modules: Array<{
      id: string;
      title: string;
      orderNumber: number;
      materials: Array<{
        id: string;
        title: string;
        fileUrl: string;
        fileType: string | null;
      }>;
    }>;
  };
  enrollment: { id: string; progress: number };
  lesson: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    videoProvider: string | null;
    duration: number | null;
    orderNumber: number;
    moduleId: string;
  };
  module: { id: string; title: string; orderNumber: number; materials: Array<unknown> } | undefined;
  allLessons: Array<{
    id: string;
    title: string;
    orderNumber: number;
    moduleId: string;
    moduleOrder: number;
  }>;
  progresses: Array<{ lessonId: string; completed: boolean }>;
  learning: {
    completedLessons: number;
    totalLessons: number;
    currentLessonNumber: number;
    remainingMinutes: number;
    remainingLabel: string;
    nextLesson: { id: string; title: string } | null;
    isFavorite: boolean;
    note: string | null;
    favoriteLessonIds: string[];
  };
}) {
  const completedIds = data.progresses.filter((p) => p.completed).map((p) => p.lessonId);

  return {
    course: {
      id: data.course.id,
      title: data.course.title,
      slug: data.course.slug,
      progressionType: data.course.progressionType,
      estimatedHours: data.course.estimatedHours,
    },
    enrollment: {
      id: data.enrollment.id,
      progress: data.enrollment.progress,
    },
    lesson: {
      id: data.lesson.id,
      title: data.lesson.title,
      description: data.lesson.description,
      videoUrl: data.lesson.videoUrl,
      videoProvider: data.lesson.videoProvider,
      durationMinutes: data.lesson.duration,
      orderNumber: data.lesson.orderNumber,
      moduleId: data.lesson.moduleId,
      isCompleted: completedIds.includes(data.lesson.id),
    },
    module: data.module
      ? {
          id: data.module.id,
          title: data.module.title,
          orderNumber: data.module.orderNumber,
          materials: data.module.materials,
        }
      : null,
    sidebarLessons: data.allLessons.map((lesson) => {
      const mod = data.course.modules.find((m) => m.id === lesson.moduleId);
      return {
        id: lesson.id,
        title: lesson.title,
        orderNumber: lesson.orderNumber,
        moduleId: lesson.moduleId,
        moduleOrder: lesson.moduleOrder,
        moduleTitle: mod?.title ?? "",
        isCompleted: completedIds.includes(lesson.id),
      };
    }),
    learning: data.learning,
  };
}

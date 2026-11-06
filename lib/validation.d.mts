/** Runtime validation shared by the application and dependency-free tests. */
export function safeImage(value: unknown): boolean;
export function safeVideo(value: unknown): boolean;
export function validateProject(project: unknown): void;
export function validateProjectTranslations(
  project: unknown,
  locales: Record<string, unknown>,
): void;

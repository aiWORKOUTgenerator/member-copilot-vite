import { PromptService } from "@/domain/interfaces/services/PromptService";
import { PromptServiceImpl } from "@/services/prompt/PromptServiceImpl";
import { useApiService } from "./useApiService";
import { useMemo } from "react";

/**
 * Hook to access the PromptService
 * @returns An instance of PromptService
 */
export function usePromptService(): PromptService {
  const apiService = useApiService();

  const promptService = useMemo(() => {
    return new PromptServiceImpl(apiService);
  }, [apiService]);

  return promptService;
}

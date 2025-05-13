import { PromptServiceImpl } from "../PromptServiceImpl";
import { ApiService } from "../../../domain/interfaces/api/ApiService";
import {
  Prompt,
  PromptProps,
  PromptType,
} from "../../../domain/entities/prompt";

describe("PromptServiceImpl", () => {
  // Setup
  let promptService: PromptServiceImpl;
  let mockApiService: jest.Mocked<ApiService>;

  // Mock data
  const mockPromptProps: PromptProps[] = [
    {
      id: "prompt1",
      text: "What is your goal?",
      hint_text: "Select your primary fitness goal",
      prompt_type: PromptType.LIST,
      is_identifier: false,
      allow_multiple: false,
      choices: [
        { id: "goal1", text: "Weight Loss" },
        { id: "goal2", text: "Muscle Gain" },
      ],
      validation_rules: { required: true },
      variable_name: "fitness_goal",
      popup_text: "Choose a fitness goal that aligns with your objectives",
      popup_link_text: "Learn more",
      other_choice_enabled: false,
      other_choice_text: "",
      other_choice_validation: {},
      attribute_type: null,
    },
    {
      id: "prompt2",
      text: "How old are you?",
      hint_text: "Enter your age",
      prompt_type: PromptType.NUMBER,
      is_identifier: false,
      allow_multiple: false,
      choices: [],
      validation_rules: { min: 18, max: 100, required: true },
      variable_name: "age",
      popup_text: "",
      popup_link_text: "",
      other_choice_enabled: false,
      other_choice_text: "",
      other_choice_validation: {},
      attribute_type: null,
    },
  ];

  beforeEach(() => {
    // Create a mock API service
    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    // Create a new instance for each test
    promptService = new PromptServiceImpl(mockApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPrompts", () => {
    it("should return prompts data from the API", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockPromptProps);

      // Act
      const result = await promptService.getAllPrompts();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Prompt);
      expect(result[0].id).toBe("prompt1");
      expect(result[0].text).toBe("What is your goal?");
      expect(result[1].id).toBe("prompt2");
      expect(result[1].type).toBe(PromptType.NUMBER);
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith("/members/prompts");
    });

    it("should throw an error when API call fails", async () => {
      // Arrange
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act & Assert
      await expect(promptService.getAllPrompts()).rejects.toThrow(
        "Failed to fetch prompts"
      );
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith("/members/prompts");
    });
  });

  describe("getPromptById", () => {
    it("should return a prompt by id", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockPromptProps);

      // Act
      const result = await promptService.getPromptById("prompt2");

      // Assert
      expect(result).toBeInstanceOf(Prompt);
      expect(result?.id).toBe("prompt2");
      expect(result?.text).toBe("How old are you?");
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
      expect(mockApiService.get).toHaveBeenCalledWith("/members/prompts");
    });

    it("should return null when prompt with id is not found", async () => {
      // Arrange
      mockApiService.get.mockResolvedValueOnce(mockPromptProps);

      // Act
      const result = await promptService.getPromptById("non-existent-id");

      // Assert
      expect(result).toBeNull();
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });

    it("should throw an error when API call fails", async () => {
      // Arrange
      mockApiService.get.mockRejectedValueOnce(new Error("API error"));

      // Act & Assert
      await expect(promptService.getPromptById("prompt1")).rejects.toThrow(
        "Failed to fetch prompt with id prompt1"
      );
      expect(mockApiService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("submitPromptValues", () => {
    it("should post prompt values to the API", async () => {
      // Arrange
      const promptValues = [
        { prompt_id: "prompt1", value: "goal1" },
        { prompt_id: "prompt2", value: 30 },
      ];
      mockApiService.post.mockResolvedValueOnce(undefined);

      // Act
      await promptService.submitPromptValues(promptValues);

      // Assert
      expect(mockApiService.post).toHaveBeenCalledTimes(1);
      expect(mockApiService.post).toHaveBeenCalledWith(
        "/members/submit-prompts",
        { promptValues }
      );
    });

    it("should throw an error when API call fails", async () => {
      // Arrange
      const promptValues = [{ prompt_id: "prompt1", value: "goal1" }];
      mockApiService.post.mockRejectedValueOnce(new Error("API error"));

      // Act & Assert
      await expect(
        promptService.submitPromptValues(promptValues)
      ).rejects.toThrow("Failed to submit prompt values");
      expect(mockApiService.post).toHaveBeenCalledTimes(1);
    });
  });
});

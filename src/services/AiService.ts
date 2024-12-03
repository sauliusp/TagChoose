const SYSTEM_PROMPT = `You are a highly intelligent and efficient assistant designed to categorize and organize bookmarks into appropriate folders.`;

class AiService {
  private static instance: AiService;

  private session: AILanguageModel | null = null;

  private constructor() {}

  static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  async getAiCapabilities(): Promise<
    AILanguageModelCapabilities | 'unsupported'
  > {
    if (!('aiOriginTrial' in chrome)) {
      return 'unsupported';
    }

    return await self.ai.languageModel.capabilities();
  }

  async initSession(): Promise<void> {
    try {
      this.session = await self.ai.languageModel.create({
        systemPrompt: SYSTEM_PROMPT,
      });
    } catch {
      throw new Error('Failed to initialize the AI session.');
    }
  }

  async runPrompt(prompt: string): Promise<string> {
    try {
      if (this.session === null) {
        await this.initSession();
      }

      return this.session!.prompt(prompt);
    } catch (e) {
      console.error('Prompt failed', e);

      await this.reset();
      throw new Error('Failed to run the prompt.');
    }
  }

  async reset(): Promise<void> {
    if (this.session) {
      this.session.destroy();
    }

    this.session = null;
  }
}

export const aiService = AiService.getInstance();

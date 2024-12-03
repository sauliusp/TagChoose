import { PromptPayload } from '../types/PromptPayload';

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

    return await chrome.aiOriginTrial.languageModel.capabilities();
  }

  async initSession(): Promise<void> {
    try {
      this.session = await chrome.aiOriginTrial.languageModel.create({
        systemPrompt: SYSTEM_PROMPT,
      });
    } catch {
      throw new Error('Failed to initialize the AI session.');
    }
  }

  getPrompt(payload: PromptPayload): string {
    const { url, title, folderListString } = payload;

    return `
<reference>
  Website URL: ${url}, title: ${title}, available folders: ${folderListString}
</reference>
<instruction>
  Select the most appropriate folder for the bookmark from the list. 
  Preferably choose one folder, but if the content strongly fits multiple, return up to three folders. 
  Output a comma-separated list of folder titles (e.g., "Folder1" or "Folder1, Folder2"). 
</instruction>
    `.trim();
  }

  async runPrompt(payload: PromptPayload): Promise<string> {
    try {
      if (this.session === null) {
        await this.initSession();
      }

      return this.session!.prompt(this.getPrompt(payload));
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

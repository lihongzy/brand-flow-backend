import { Injectable } from '@nestjs/common';
import { OpenAIImageProvider } from './providers/openai-image.provider';
import { runImageWorkflow } from './workflow/image.workflow';

@Injectable()
export class ImageWorkflowService {
  constructor(private readonly imageProvider: OpenAIImageProvider) {}

  async generate(prompt: string) {
    return runImageWorkflow({ prompt }, this.imageProvider);
  }
}

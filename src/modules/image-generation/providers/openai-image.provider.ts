import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImageProvider } from './image-provider.interface';

@Injectable()
export class OpenAIImageProvider implements ImageProvider {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    this.client = new OpenAI({ apiKey });
  }

  async generate(prompt: string): Promise<string> {
    const model =
      this.configService.get<string>('OPENAI_IMAGE_MODEL') ?? 'gpt-image-1';

    const result = await this.client.images.generate({
      model,
      prompt,
      size: '1024x1024',
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new InternalServerErrorException(
        'OpenAI did not return image data.',
      );
    }

    return `data:image/png;base64,${imageBase64}`;
  }
}

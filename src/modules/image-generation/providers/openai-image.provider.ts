import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ImagesResponse } from 'openai/resources/images';
import { ImageProvider } from './image-provider.interface';

@Injectable()
export class OpenAIImageProvider implements ImageProvider {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }

  async generate(prompt: string): Promise<string> {
    const model = this.configService.get<string>('OPENAI_IMAGE_MODEL');

    const result = await this.client.post<ImagesResponse>(
      '/images/generations',
      {
        body: {
          model,
          prompt,
          size: '1024x1024',
          n: 1,
          step: 20,
        },
      },
    );

    const image = result.data?.[0];

    if (image?.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    if (image?.url) {
      return image.url;
    }

    if (!image) {
      throw new InternalServerErrorException(
        'OpenAI did not return image data.',
      );
    }

    throw new InternalServerErrorException(
      'OpenAI returned an unsupported image response format.',
    );
  }
}

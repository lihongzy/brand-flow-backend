import { Module } from '@nestjs/common';
import { ImageGenerationController } from './image-generation.controller';
import { ImageWorkflowService } from './image-workflow.service';
import { OpenAIImageProvider } from './providers/openai-image.provider';

@Module({
  controllers: [ImageGenerationController],
  providers: [ImageWorkflowService, OpenAIImageProvider],
  exports: [ImageWorkflowService],
})
export class ImageGenerationModule {}

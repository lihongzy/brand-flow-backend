import { Body, Controller, Post } from '@nestjs/common';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ImageWorkflowService } from './image-workflow.service';

@Controller('images')
export class ImageGenerationController {
  constructor(private readonly imageWorkflowService: ImageWorkflowService) {}

  @Post('generate')
  generate(@Body() dto: GenerateImageDto) {
    return this.imageWorkflowService.generate(dto.prompt);
  }
}

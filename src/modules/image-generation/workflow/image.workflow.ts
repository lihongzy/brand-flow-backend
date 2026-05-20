import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ImageProvider } from '../providers/image-provider.interface';
import { ImageWorkflowState } from './image-state';

const ImageWorkflowAnnotation = Annotation.Root({
  prompt: Annotation<string>(),
  finalPrompt: Annotation<string | undefined>(),
  image: Annotation<string | null | undefined>(),
});

export async function runImageWorkflow(
  state: ImageWorkflowState,
  imageProvider: ImageProvider,
): Promise<ImageWorkflowState> {
  const graph = new StateGraph(ImageWorkflowAnnotation)
    .addNode('generateImage', async (currentState) => {
      const finalPrompt = currentState.finalPrompt ?? currentState.prompt;
      const image = await imageProvider.generate(finalPrompt);

      return {
        finalPrompt,
        image,
      };
    })
    .addEdge(START, 'generateImage')
    .addEdge('generateImage', END)
    .compile();

  return graph.invoke(state);
}

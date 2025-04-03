import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import ImageUploader from '../ImageUploader';
import { ArticleFormData, validateArticleForm } from '../../utils/formValidation';

interface ArticleFormProps {
  initialData?: {
    title: string;
    perex: string;
    content: string;
    imageId?: string;
  };
  onSubmit: (formData: ArticleFormData & { imageId?: string }) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData = { title: '', perex: '', content: '' },
  onSubmit,
  isSubmitting,
  submitButtonText,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [perex, setPerex] = useState(initialData.perex);
  const [content, setContent] = useState(initialData.content);
  const [imageId, setImageId] = useState<string | undefined>(initialData.imageId);
  const [errors, setErrors] = useState({
    title: '',
    perex: '',
    content: '',
  });

  useEffect(() => {
    setTitle(initialData.title);
    setPerex(initialData.perex);
    setContent(initialData.content);
    setImageId(initialData.imageId);
  }, [initialData]);

  const validateForm = () => {
    const { isValid, errors } = validateArticleForm({ title, perex, content });
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit({
      title,
      perex,
      content,
      imageId,
    });
  };

  const handleImageUploaded = (newImageId: string) => {
    setImageId(newImageId);
  };

  const handleImageRemoved = () => {
    setImageId(undefined);
  };

  const editorOptions = React.useMemo(() => {
    return {
      spellChecker: false,
      placeholder: 'Write your article content here...',
      status: false,
    };
  }, []);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="start">
        <FormControl isInvalid={!!errors.title} isRequired>
          <FormLabel>Article Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.perex} isRequired>
          <FormLabel>Perex</FormLabel>
          <Textarea
            value={perex}
            onChange={(e) => setPerex(e.target.value)}
            placeholder="Short summary of the article"
            rows={3}
          />
          <FormErrorMessage>{errors.perex}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.content} isRequired>
          <FormLabel>Content</FormLabel>
          <Box border={errors.content ? "1px solid red" : "1px solid"} borderColor={errors.content ? "red.500" : "gray.200"} borderRadius="md">
            <SimpleMDE
              value={content}
              onChange={setContent}
              options={editorOptions}
            />
          </Box>
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>

        <ImageUploader
          initialImageId={imageId}
          onImageUploaded={handleImageUploaded}
          onImageRemoved={handleImageRemoved}
        />

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          width={{ base: "100%", md: "auto" }}
        >
          {submitButtonText}
        </Button>
      </VStack>
    </Box>
  );
};

export default ArticleForm;

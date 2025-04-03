import React, { useState, useEffect, useRef } from 'react';
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
import 'easymde/dist/easymde.min.css';
import ImageUploader from '../ImageUploader';
import { ArticleFormData, validateArticleForm } from '../../utils/formValidation';

interface ArticleFormProps {
  initialData?: {
    title: string;
    perex: string;
    content: string;
    imageId?: string;
  };
  onSubmit: (data: ArticleFormData & { imageId?: string }) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData = { title: '', perex: '', content: '' },
  onSubmit,
  isSubmitting,
  submitButtonText,
}) => {
  const isInitialMount = useRef(true);
  
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    perex: initialData.perex || '',
    content: initialData.content || '',
    imageId: initialData.imageId,
  });
  
  const [errors, setErrors] = useState({
    title: '',
    perex: '',
    content: '',
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasRealInitialData = 
      initialData.title?.trim() || 
      initialData.perex?.trim() || 
      initialData.content?.trim() ||
      initialData.imageId;
      
    if (hasRealInitialData) {
      setFormData({
        title: initialData.title || '',
        perex: initialData.perex || '',
        content: initialData.content || '',
        imageId: initialData.imageId,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const { isValid, errors } = validateArticleForm({ 
      title: formData.title, 
      perex: formData.perex, 
      content: formData.content 
    });
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      title: formData.title,
      perex: formData.perex,
      content: formData.content,
      imageId: formData.imageId,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploaded = (newImageId: string) => {
    setFormData(prev => ({
      ...prev,
      imageId: newImageId
    }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({
      ...prev,
      imageId: undefined
    }));
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
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            placeholder="Title" 
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.perex} isRequired>
          <FormLabel>Perex</FormLabel>
          <Textarea
            value={formData.perex}
            onChange={(e) => handleChange('perex', e.target.value)}
            placeholder="Short summary of the article"
            rows={3}
          />
          <FormErrorMessage>{errors.perex}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.content} isRequired>
          <FormLabel>Content</FormLabel>
          <Box
            border={errors.content ? '1px solid red' : '1px solid'}
            borderColor={errors.content ? 'red.500' : 'gray.200'}
            borderRadius="md"
          >
            <SimpleMDE 
              value={formData.content} 
              onChange={(value) => handleChange('content', value)} 
              options={editorOptions} 
            />
          </Box>
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>

        <ImageUploader
          initialImageId={formData.imageId}
          onImageUploaded={handleImageUploaded}
          onImageRemoved={handleImageRemoved}
        />

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          width={{ base: '100%', md: 'auto' }}
        >
          {submitButtonText}
        </Button>
      </VStack>
    </Box>
  );
};

export default ArticleForm;

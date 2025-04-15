import React from 'react';
import { Box, Heading, Container, VStack, Divider } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const readmeContent = `# Blog Frontend Application

## Introduction

React-based frontend application for a blogging platform, allowing users to view articles and comments, and administrators to create, edit, and manage articles.

### Key Features

- **Public Features**
  - Article listing with sorting and pagination
  - Article detail view with Markdown rendering
  - Comment system with real-time updates via WebSockets
  - Comment voting (upvote/downvote)

- **Admin Features**
  - Authentication system
  - Article creation with Markdown editor
  - Article editing and deletion
  - Image upload functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
\`\`\`
npm install
\`\`\`

### Running the Application

- **Development Mode**
\`\`\`
npm start
\`\`\`

- **Production Build**
\`\`\`
npm run build
\`\`\`

## Architecture

### Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router v6**: Routing
- **Chakra UI**: Component library
- **Axios**: HTTP client
- **Jest & React Testing Library**: Testing
- **WebSockets**: Real-time updates
- **SimpleMDE**: Markdown editor

### Application Structure

The application follows a feature-based organization:
\`\`\`
src/
  components/         # Reusable UI components
    ArticleCard/
    ApiImage/
    CommentsSection/
    ...
  pages/              # Page components
    ArticleList/
    ArticleDetail/
    AdminArticleList/
    ...
  store/              # Redux state management
    slices/           # Redux slices
    actions/          # Async actions
  api/                # API integration
  hooks/              # Custom React hooks
  utils/              # Helper utilities
  types/              # TypeScript type definitions
\`\`\`

## Features

### Public Features

#### Article List
- Display all published articles with pagination
- Sort articles by date (newest first)
- Show article title, perex, and publication date

#### Article Detail
- Display article content with Markdown rendering
- Show article metadata (author, date)
- View comments section

#### Comments
- View comments for each article
- Submit new comments (authentication required)
- Upvote/downvote comments
- Real-time comment updates via WebSockets

### Admin Features

#### Authentication
- Login with username/password
- Token-based authentication
- Protected routes for admin operations

#### Article Management
- Create new articles with Markdown editor
- Edit existing articles
- Delete articles
- View list of all articles with edit/delete options

#### Image Upload
- Upload images for articles
- Preview uploaded images
- Image management

## State Management

### Redux Setup

The application uses Redux Toolkit for state management, with a structure organized around feature slices:

- **articlesSlice**: Manages article list state
- **articlesEntitySlice**: Normalized article data using entity adapter
- **authSlice**: Authentication state

### Entity Adapters

Entity adapters are used for state management of collections:

- **articlesEntityAdapter**: Normalized storage of articles
- Provides selectors like \`selectAllArticles\`, \`selectById\`

### Async Operations

Async operations are handled using Redux Toolkit's \`createAsyncThunk\`:

- **fetchArticles**: Get all articles
- **fetchArticleById**: Get single article
- **createArticle**: Create new article
- **updateArticle**: Update existing article
- **deleteArticle**: Delete article`;

const AboutPage: React.FC = () => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack align="stretch" spacing={6}>
        <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
          <Heading as="h1" size="xl" mb={6}>
            About This Project
          </Heading>
          <Divider mb={6} />
          <Box className="markdown-content">
            <ReactMarkdown>{readmeContent}</ReactMarkdown>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage;

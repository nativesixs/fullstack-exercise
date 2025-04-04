# Blog Frontend Application

## Introduction

React-based frontend application for a blogging platform, allowing users to view articles and comments, and administrators to create, edit, and manage articles.

### Key Features

- **Public Features**
  - Article listing with sorting and pagination
  - Article detail view with Markdown rendering
  - Comment system with real-time updates via WebSocketshttps://eldenring.wiki.fextralife.com/Armork
  - Comment voting (upvote/downvote)

- **Admin Features**
  - Authentication system
  - Article creation with Markdown editorhttps://eldenring.wiki.fextralife.com/Armor
  - Article editing and deletion
  - Image upload functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
```
npm install
```

### Running the Application

- **Development Mode**
```
npm start
```

- **Production Build**
```
npm run build
```

### Docker Setup
The application can be containerized using Docker for easier deployment and consistent environments.

## Building and Running with Docker
Using Docker Directly
```
docker compose up
docker compose down
```

- **Running Tests**
```
npm test                  # Run all tests
npm run test:coverage     # Run tests with coverage report
npm run test:watch        # Run tests in watch mode
npm run test:components   # Run only component tests
npm run test:pages        # Run only page tests
npm run test:utils        # Run only utility tests
npm run test:api          # Run only API tests
npm run test:store        # Run only store tests
```
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
```
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
```
### Component Architecture

The application uses a component-based architecture with:

1. **Container Components**: Connect to Redux store and handle data fetching (pages)
2. **Presentational Components**: Focus on UI rendering with props
3. **Shared Components**: Reusable components across features
4. **HOCs**: Higher-order components like ProtectedRoute for authentication

### Data Flow

1. User interacts with UI
2. Components dispatch Redux actions
3. Redux thunks handle API requests
4. API responses update Redux store
5. UI components react to state changes
6. For real-time features, WebSockets push updates directly to components

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
- Provides selectors like `selectAllArticles`, `selectById`

### Async Operations

Async operations are handled using Redux Toolkit's `createAsyncThunk`:

- **fetchArticles**: Get all articles
- **fetchArticleById**: Get single article
- **createArticle**: Create new article
- **updateArticle**: Update existing article
- **deleteArticle**: Delete article

## API Integration

### REST API Clients

API integration is handled through Axios with request interceptors for:

- Authentication token inclusion
- API key management
- Error handling
- Response normalization

### WebSocket Integration

WebSockets are used for real-time comment updates:

- Connection management in custom hook
- Auto-reconnect functionality
- Message parsing and handling

### Error Handling

- API error interceptors
- Error state in Redux
- User-friendly error messages
- Retry mechanisms for transient failures

## Testing

### Testing Strategy

- **Unit Tests**: For utility functions
- **Component Tests**: For UI components
- **Integration Tests**: For page components
- **Redux Tests**: For state management

### Test Utils

The application includes testing utilities:

- `mockStore`: Redux store mocking
- Component test helpers
- API mocking utilities

## Deployment

### Build Process
```
npm run build
```

### Environment Configuration

Environment-specific configurations:

- `.env.development`: Development settings
- `.env.production`: Production settings
- `.env.test`: Test-specific settings

### Production Considerations

- Enable caching of static assets
- Set up proper CORS headers
- Configure proper API URL
- Ensure WebSocket connections work in production

## Code Quality

### TypeScript Type Safety

The application uses TypeScript for type safety:

- Defined interfaces for all data models
- Type-safe Redux using RTK
- Type-safe props with PropTypes
- Generics for reusable components

### Coding Standards

Code quality is maintained through:

- ESLint
- Consistent coding patterns
- Component structure conventions

```
npm run lint       # to check for linting issues
npm run lint:fix   # to automatically fix linting issues
npm run format     # to format code with prettier
```

## Prettier Integration

Code formatting is standardized using Prettier with the following configuration:

- Single quotes
- Semi-colons required
- 100 character line length
- 2 space indentation
- ES5 trailing commas
  
### Performance Optimization

Performance optimizations include:

- Memoization of components and selectors
- Lazy loading of routes
- Pagination for large data sets
- Image optimization

## Known Issues & Limitations

### Current Limitations

- Single user system (no user registration)
- Limited image management options
- No draft system for articles
- Limited comment moderation tools

### Planned Improvements

- Enhanced test coverage
- Draft system for articles
- Comment moderation tools
- User management





### Author notes

- i did not manage to make the comment api work as described - mocked
- articles might not contain the correct author since the articles dont carry this information - might be good excercise for BE
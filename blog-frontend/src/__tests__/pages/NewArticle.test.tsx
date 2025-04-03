import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import NewArticle from '../../pages/NewArticle';
import createMockStore from '../../utils/testing/mockStore';

jest.mock('react-simplemde-editor', () => {
  return function MockSimpleMDE(props: any) {
    return (
      <textarea
        data-testid="mock-editor"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    );
  };
});

jest.mock('../../components/ImageUploader', () => {
  return function MockImageUploader(props: any) {
    return <div data-testid="mock-image-uploader">Image Uploader</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('NewArticle Page', () => {
  let store: any;

  beforeEach(() => {
    store = createMockStore({
      articles: {
        loading: false,
        error: null,
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <NewArticle />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the new article form', () => {
    renderComponent();

    expect(screen.getByText('Create New Article')).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: /Article Title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Perex/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Article/i })).toBeInTheDocument();
  });
});

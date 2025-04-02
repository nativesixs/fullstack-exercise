import {
  createEntityAdapter,
  createSlice,
  EntityAdapter,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  EntityId
} from '@reduxjs/toolkit';
import { createAsyncThunk } from './reduxHelpers';

/**
 * Extended entity state with loading and error state
 */
export interface EntityStateExt<T, K extends EntityId = string> extends EntityState<T, K> {
  loading: boolean;
  error: string | null;
  selectedId: K | null;
}

/**
 * Creates a standard entity adapter slice with async handlers
 */
export function createEntitySlice<
  T extends { [key: string]: any },
  K extends EntityId = string,
  Reducers extends SliceCaseReducers<EntityStateExt<T, K>> = SliceCaseReducers<EntityStateExt<T, K>>
>(
  name: string,
  selectId: (entity: T) => K,
  reducers: ValidateSliceCaseReducers<EntityStateExt<T, K>, Reducers>,
  extraReducers?: (builder: any) => void
) {
  // Create adapter
  const adapter = createEntityAdapter<T, K>({
    selectId
  });
  
  // Create initial state with loading and error
  const initialState = adapter.getInitialState<{
    loading: boolean;
    error: string | null;
    selectedId: K | null;
  }>({
    loading: false,
    error: null,
    selectedId: null as K | null
  });
  
  // Create slice
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      // Add standard entity adapter reducers
      setOne: adapter.setOne,
      setAll: adapter.setAll,
      setMany: adapter.setMany,
      addOne: adapter.addOne,
      addMany: adapter.addMany,
      updateOne: adapter.updateOne,
      updateMany: adapter.updateMany,
      removeOne: adapter.removeOne,
      removeMany: adapter.removeMany,
      // Add loading state reducers
      setLoading: (state: EntityStateExt<T, K>, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state: EntityStateExt<T, K>, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      setSelectedId: (state: EntityStateExt<T, K>, action: PayloadAction<K | null>) => {
        state.selectedId = action.payload;
      },
      ...reducers as any
    },
    extraReducers
  });
  
  return {
    slice,
    adapter,
    ...adapter.getSelectors()
  };
}

/**
 * Creates an async thunk with entity adapter integration
 */
export function createEntityThunk<ResultType, ArgType = void, K extends EntityId = string>(
  typePrefix: string,
  payloadCreator: (arg: ArgType) => Promise<ResultType>,
  adapter: EntityAdapter<any, K>
) {
  const thunk = createAsyncThunk<ResultType, ArgType>(typePrefix, payloadCreator);
  
  return {
    thunk,
    reducers: {
      pending: (state: EntityStateExt<any, K>) => {
        state.loading = true;
        state.error = null;
      },
      fulfilled: (state: EntityStateExt<any, K>, action: PayloadAction<ResultType>) => {
        state.loading = false;
        // Handle different types of results
        if (Array.isArray(action.payload)) {
          adapter.setAll(state, action.payload);
        } else if (action.payload && typeof action.payload === 'object') {
          adapter.setOne(state, action.payload);
        }
      },
      rejected: (state: EntityStateExt<any, K>, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      }
    }
  };
}

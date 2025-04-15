import {
  createEntityAdapter,
  createSlice,
  EntityAdapter,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  EntityId,
} from '@reduxjs/toolkit';
import { createAsyncThunk } from './reduxHelpers';

export interface EntityStateExt<T, K extends EntityId = string> extends EntityState<T, K> {
  loading: boolean;
  error: string | null;
  selectedId: K | null;
}

export function createEntitySlice<
  T extends { [key: string]: any },
  K extends EntityId = string,
  Reducers extends SliceCaseReducers<EntityStateExt<T, K>> = SliceCaseReducers<
    EntityStateExt<T, K>
  >,
>(
  name: string,
  selectId: (entity: T) => K,
  reducers: ValidateSliceCaseReducers<EntityStateExt<T, K>, Reducers>,
  extraReducers?: (builder: any) => void
) {
  const adapter = createEntityAdapter<T, K>({
    selectId,
  });

  const initialState = adapter.getInitialState<{
    loading: boolean;
    error: string | null;
    selectedId: K | null;
  }>({
    loading: false,
    error: null,
    selectedId: null as K | null,
  });

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setOne: adapter.setOne,
      setAll: adapter.setAll,
      setMany: adapter.setMany,
      addOne: adapter.addOne,
      addMany: adapter.addMany,
      updateOne: adapter.updateOne,
      updateMany: adapter.updateMany,
      removeOne: adapter.removeOne,
      removeMany: adapter.removeMany,
      setLoading: (state: EntityStateExt<T, K>, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state: EntityStateExt<T, K>, action: PayloadAction<string | null>) => {
        state.error = action.payload;
      },
      setSelectedId: (state: EntityStateExt<T, K>, action: PayloadAction<K | null>) => {
        state.selectedId = action.payload;
      },
      ...(reducers as any),
    },
    extraReducers,
  });

  return {
    slice,
    adapter,
    ...adapter.getSelectors(),
  };
}

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
        if (Array.isArray(action.payload)) {
          adapter.setAll(state, action.payload);
        } else if (action.payload && typeof action.payload === 'object') {
          adapter.setOne(state, action.payload);
        }
      },
      rejected: (state: EntityStateExt<any, K>, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      },
    },
  };
}

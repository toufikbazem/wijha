import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

interface Subscription {
  id: string;
  plan_name: string;
  plan_type: string;
  price: number;
  status: string;
  start_day: string;
  end_day: string;
  is_custom: boolean;
  job_post_used: number;
  job_post_limit: number | null;
  profile_access_used: number;
  profile_access_limit: number | null;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  duration: number;
  price: number;
  job_post_limit: number | null;
  profile_access_limit: number | null;
}

interface Invoice {
  id: string;
  start_day: string;
  end_day: string;
  status: string;
  created_at: string;
  plan_name: string;
  plan_type: string;
  price: number;
  job_post_used: number;
  profile_access_used: number;
}

interface PendingSubscription {
  id: string;
  plan_name: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  pendingSubscription: PendingSubscription | null;
  plans: Plan[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  pendingSubscription: null,
  plans: [],
  invoices: [],
  loading: false,
  error: null,
};

export const fetchMySubscription = createAsyncThunk(
  "subscription/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/subscriptions/my-subscription`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return { subscription: data.subscription, pendingSubscription: data.pendingSubscription };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/subscriptions/plans`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const subscribeToPlan = createAsyncThunk(
  "subscription/subscribe",
  async (plan_id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/subscriptions/subscribe`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchInvoices = createAsyncThunk(
  "subscription/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/subscriptions/invoices`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.invoices;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMySubscription
      .addCase(fetchMySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.pendingSubscription = action.payload.pendingSubscription;
      })
      .addCase(fetchMySubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchPlans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // subscribeToPlan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToPlan.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchInvoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subscriptionSlice.reducer;

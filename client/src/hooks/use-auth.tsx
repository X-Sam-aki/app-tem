import { useContext, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase';
import { LoginInput, RegisterInput } from '@shared/schema';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  const [, navigate] = useLocation();

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { setUser, user } = authContext;

  // Query to get the current user
  const { isLoading: isLoadingUser, refetch: refetchUser } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const { data, error } = await supabaseAuth.getUser();
      if (error) throw error;
      setUser(data);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Mutation for login
  const login = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data, error } = await supabaseAuth.signIn(credentials);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      toast.success('Login successful!');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  // Mutation for registration
  const register = useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { data, error } = await supabaseAuth.signUp(userData);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
      toast.success('Registration successful!');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  // Mutation for logout
  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseAuth.signOut();
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully!');
      navigate('/login');
    },
    onError: () => {
      toast.error('Failed to logout');
    },
  });

  // Check authentication status
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser,
    login: login.mutate,
    register: register.mutate,
    logout: logout.mutate,
    isLoginPending: login.isPending,
    isRegisterPending: register.isPending,
  };
};

// Import queryClient for cache clearing on logout
import { queryClient } from '@/lib/queryClient';

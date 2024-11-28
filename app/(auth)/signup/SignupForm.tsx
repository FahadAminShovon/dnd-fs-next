'use client';

import { Alert } from '@/components/custom/Alert';
import { FormInput } from '@/components/hook-form-components';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { type InsertUserSchemaType, insertUserSchema } from '@/db/schema/users';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { signupAction } from './actions';

const SignupForm = () => {
  const [state, formAction] = useActionState(signupAction, { message: '' });
  const [isPending, startTransition] = useTransition();

  const form = useForm<InsertUserSchemaType>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: InsertUserSchemaType) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    startTransition(() => formAction(formData));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Sign Up
        </CardTitle>
        <CardDescription className="text-center">
          Create your account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="firstName"
                label="First Name"
              />
              <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
              />
            </div>
            <FormInput
              control={form.control}
              name="username"
              label="Username"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              type="email"
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
            />
            <FormInput
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        {state.message && !state.user && (
          <Alert
            variant={'destructive'}
            title={state.message}
            className="mt-4"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;

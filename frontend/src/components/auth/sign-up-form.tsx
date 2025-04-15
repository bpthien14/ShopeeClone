'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { registerAccount } from '@/apis/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useUser } from '@/hooks/auth/use-user';

const roleOptions = ['merchant', 'customer'] as const;

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  role: zod.enum(roleOptions),
  phoneNumber: zod.string().min(1, { message: 'Phone number is required' }),
  shop: zod
    .object({
      name: zod.string().min(1, { message: 'Shop name is required' }),
    })
    .optional(),
  customerClass: zod.string().optional(),
  amountPaid: zod.number().default(0),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  name: '',
  email: '',
  password: '',
  role: 'merchant',
  phoneNumber: '',
  amountPaid: 0,
} satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession, setUser } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);

        const res = await registerAccount(values);
        setUser(res.user);

        // Refresh the auth state
        await checkSession?.();

        // UserProvider, for this case, will not refresh the router
        // After refresh, GuestGuard will handle the redirect
        router.refresh();
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Name</InputLabel>
                <OutlinedInput {...field} label="Name" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormControl error={Boolean(errors.phoneNumber)}>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput {...field} label="Phone number" />
                {errors.phoneNumber ? <FormHelperText>{errors.phoneNumber.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormControl error={Boolean(errors.role)} fullWidth>
                <Autocomplete
                  options={roleOptions}
                  value={field.value || null}
                  onChange={(_, value) => {
                    field.onChange(value);
                  }}
                  renderInput={(params) => <TextField {...params} label="Role" variant="outlined" />}
                />
                {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

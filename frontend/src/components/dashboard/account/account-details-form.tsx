'use client';

import * as React from 'react';
import { updateProfile } from '@/apis/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, FormHelperText, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { User } from '@/types/user';
import { useUser } from '@/hooks/auth/use-user';

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}

const schema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  phoneNumber: zod.string().min(1, { message: 'Phone number is required' }),
  shop: zod
    .object({
      name: zod.string().min(1, { message: 'Shop name is required' }),
    })
    .optional(),
  photoUrl: zod.string().optional(),
});

type Values = zod.infer<typeof schema>;

function getDefaultValues(user: User): Values {
  return {
    name: user.name ?? '',
    phoneNumber: user.phoneNumber ?? '',
    shop: user?.shop ?? undefined,
    photoUrl: user.photoUrl ?? undefined,
  };
}

export function AccountDetailsForm(): React.JSX.Element {
  const { user, setUser, checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const methods = useForm<Values>({ resolver: zodResolver(schema) });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = methods;

  React.useEffect(() => {
    if (user) {
      const defaultValues = getDefaultValues(user);
      reset(defaultValues);
    }
  }, [user]);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const avatar = watch('photoUrl');

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('photoUrl', url);
      }
    },
    [setValue]
  );

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);

        const res = await updateProfile(values);
        setUser(res.user);

        // Refresh the auth state
        await checkSession?.();
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    },
    [checkSession]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={avatar} sx={{ height: '80px', width: '80px' }} />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                onClick={() => {
                  avatarInputRef.current?.click();
                }}
                fullWidth
                variant="text"
              >
                Select
              </Button>
              <input hidden onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
            </CardActions>
          </Card>
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <Card>
            <CardHeader subheader="The information can be edited" title="Profile" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.name)}>
                        <InputLabel>Name</InputLabel>
                        <OutlinedInput {...field} label="Name" />
                        {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.phoneNumber)}>
                        <InputLabel>Phone number</InputLabel>
                        <OutlinedInput {...field} label="Phone number" />
                        {errors.phoneNumber ? <FormHelperText>{errors.phoneNumber.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel disabled>Email address</InputLabel>
                    <OutlinedInput disabled defaultValue={user?.email} label="Email address" name="email" />
                  </FormControl>
                </Grid>

                <Grid md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <OutlinedInput disabled defaultValue={user?.role} label="Role" />
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={isPending} type="submit" variant="contained">
          Save details
        </Button>
      </CardActions>
    </form>
  );
}

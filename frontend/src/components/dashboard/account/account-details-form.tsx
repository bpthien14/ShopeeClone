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
import { useUser } from '@/hooks/use-user';
import { SelectChangeEvent } from '@mui/material/Select';
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
}

export function AccountDetailsForm(): React.JSX.Element {
  const { user } = useUser();
  const defaultFormData: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: states[0].value,
    city: ''
  };

  const [formData, setFormData] = React.useState<FormData>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone as string || '',
    state: user?.state as string || states[0].value,
    city: user?.city || ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value as string
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name!]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Xử lý logic cập nhật thông tin user ở đây
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput 
                  value={formData.firstName}
                  onChange={handleChange}
                  label="First name" 
                  name="firstName" 
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput 
                  value={formData.lastName}
                  onChange={handleChange}
                  label="Last name" 
                  name="lastName" 
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput 
                  value={formData.email}
                  onChange={handleChange}
                  label="Email address" 
                  name="email" 
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput 
                  value={formData.phone}
                  onChange={handleChange}
                  label="Phone number" 
                  name="phone" 
                  type="tel" 
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state || ''}
                  onChange={handleSelectChange}
                  label="State" 
                  name="state"
                >
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput 
                  value={formData.city}
                  onChange={handleChange}
                  label="City" 
                  name="city"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Save details</Button>
        </CardActions>
      </Card>
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

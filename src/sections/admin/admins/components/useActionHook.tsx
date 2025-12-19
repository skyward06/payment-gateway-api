import type { Admin } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PASSWORD_REG_EXP } from 'src/consts';

import { toast } from 'src/components/SnackBar';

import { useCreateAdmin, useUpdateAdmin } from '../useApollo';

interface Props {
  current?: Admin;
}

export function useActionHook({ current }: Props) {
  const router = useRouter();

  type SchemaType = zod.infer<typeof Schema>;

  const Schema = zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    email: zod.email({ message: 'Invalid email address is provided' }),
    password: current
      ? zod.string().optional()
      : zod
          .string()
          .min(1, { message: 'New password is required!' })
          .min(8, { message: 'Password must be at least 8 characters!' })
          .regex(PASSWORD_REG_EXP, {
            message: 'Password must include uppercase, lowercase, number, and special character!',
          }),
  });

  const { loading: creating, createAdmin } = useCreateAdmin();
  const { loading: updating, updateAdmin } = useUpdateAdmin();

  const defaultValues = useMemo(
    () => ({ name: current?.name || '', email: current?.email || '', password: '' }),
    [current]
  );

  const methods = useForm<SchemaType>({
    defaultValues,
    resolver: zodResolver(Schema),
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async ({ password, ...newData }) => {
    try {
      const actionPromise = current
        ? await updateAdmin({ ...newData, id: current.id })
        : await createAdmin({ ...newData, password: password ?? '' });

      const { data } = await actionPromise;

      if (data) {
        toast.success('Successfully done!');
        reset();
        router.push(paths.admin.admins.root);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  return { methods, creating, updating, onSubmit };
}

'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { mobileLogin } from '@/server/actions/auth.action';
import { Button, Input, Password } from 'rizzui';
import { toast } from 'sonner';

import { PAGES } from '@/config/pages';
import { Envelop } from '@/components/atoms/icons/envelop';
import { Box } from '@/components/atoms/layout';
import { useSearchParams } from '@/components/atoms/next/navigation';

export const EmailLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const { username, password } = event.target.elements;

    if (!username.value) {
      toast.error('لطفا نام کاربری را وارد نمایید');
      setIsLoading(false);
      return;
    }

    const response = await mobileLogin(username.value, password.value);

    setIsLoading(false);
    if (!response.ok) {
      toast.error('اطلاعات نامعتبر می باشد');
      return;
    } else if (response.ok) {
      return redirect(PAGES.DASHBOARD.ROOT);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-2">
      <Box>
        <Input
          autoComplete="off"
          name="username"
          type="text"
          placeholder="نام کاربری را وارد نمایید"
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full 3xl:[&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40 mb-4 h-12"
          prefix={<Envelop className="w-5 md:w-6 h-5 md:h-6" />}
        />
        <Password
          autoComplete="off"
          name="password"
          placeholder="کلمه عبور را وارد نمایید"
          className="[&_.rizzui-input-container]:bg-white dark:[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container]:focus:ring-gray-500 [&_.rizzui-input-container_input]:w-full lg:[&_.rizzui-input-container]:h-14 [&_.rizzui-input-container]:w-full 3xl:[&_.rizzui-input-container]:w-full [&_.rizzui-input-container]:px-3 md:[&_.rizzui-input-container]:px-5 xl:[&_.rizzui-input-container]:px-7 h-10"
          inputClassName="[&.is-focus]:border-gray-500 ring-[#CBD5E1] dark:ring-[#3B404F] [&.is-focus]:ring-2 [&.is-focus]:ring-[#CBD5E1] dark:[&.is-focus]:ring-[#3B404F] [&.is-hover]:border-0 border-0 ring-1 lg:text-base text-[#475569] dark:text-steel-100/40  h-12"
          prefix={<Envelop className="w-5 md:w-6 h-5 md:h-6" />}
        />
      </Box>
      <Button
        type="submit"
        isLoading={isLoading}
        className="flex font-semibold items-center justify-center w-full h-10 lg:h-14 !mt-5 text-sm lg:text-base text-white transition-all !bg-custom-black dark:!bg-steel-600 hover:dark:!bg-steel-600/80  border-0 rounded-md hover:!bg-opacity-90 focus:outline-none hover:shadow-sm "
      >
        ورود
      </Button>
    </form>
  );
};

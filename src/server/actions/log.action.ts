'use server';

import { LogService } from '@/server/service/log.service';

import { handleServerError } from '@/lib/utils/error';
import { CreateLogInput } from '@/lib/validations/log.schema';

export const getAllLogs = async () => {
  return await LogService.getAll();
};

export const createLog = async (input: CreateLogInput) => {
  try {
    return await LogService.create(input);
  } catch (error) {
    return handleServerError(error);
  }
};

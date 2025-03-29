import { getAllLogs } from '@/server/actions/log.action';

import { FileSortType } from '@/config/sorting';
import { CompleteFile } from '@/db/schema/files';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { ShowFiles } from '@/components/templates/show-files';

type SearchParams = {
  search?: string;
  page?: number;
  size?: number;
  sort?: FileSortType;
  status?: LogStatus;
  type?: string;
  tag?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchParams1 = await searchParams;
  const [logs] = await Promise.all([getAllLogs()]);

  return <></>
}

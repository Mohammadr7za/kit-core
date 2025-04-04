import { cookies } from 'next/headers';
import { notFound, useSearchParams } from 'next/navigation';
import { CompleteBreadcrumbs, CompleteFile } from '@/db/schema';
import { getAnalyticsData } from '@/server/actions/analytics.action';
import { getAllFolders, getFolders } from '@/server/actions/folders.action';
import { getAllTags } from '@/server/actions/tag.action';
import { getCurrentTeam } from '@/server/actions/team.action';
import { isCuid } from '@paralleldrive/cuid2';

import { getCurrentUser } from '@/lib/utils/session';
import { FilesLayoutType } from '@/components/organisms/file-layout-switcher';
import { ShowFiles } from '@/components/templates/show-files';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  isCuid(params.id) || notFound();
  const searchParams = await useSearchParams()

  const { files, count, breadcrumbs } = await getFolders(params.id, {
    size: 50,
    ...searchParams,
  });

  const parentId = Boolean(params.id) ? params.id : null;
  const folders = await getAllFolders(user.id, user.currentTeamId);
  const cookieStore = await cookies()

  const tags = await getAllTags({ search: '' });

  const currentTeam = await getCurrentTeam();
  const { totalStorage, totalUsed } = await getAnalyticsData(
    currentTeam?.id,
    user?.id
  );
  const availableStorage = totalStorage - totalUsed.bytes;
  const defaultLayout = cookieStore.get('files-layout')?.value ?? 'grid';

  return (
    <ShowFiles
      files={files as CompleteFile[]}
      totalFiles={count}
      folders={folders as CompleteFile[]}
      user={user}
      tags={tags}
      parentId={parentId}
      breadcrumbs={breadcrumbs as CompleteBreadcrumbs[]}
      availableStorage={availableStorage}
      defaultLayout={defaultLayout as FilesLayoutType}
    />
  );
}

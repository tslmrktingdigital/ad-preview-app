import { prisma } from '../lib/prisma.js';
import type { AdStatus } from '@tassel/types';

export async function getAdById(id: string) {
  return prisma.adDraft.findUniqueOrThrow({ where: { id } });
}

export async function updateAdStatus(id: string, status: AdStatus, approvedById?: string) {
  return prisma.adDraft.update({
    where: { id },
    data: {
      status,
      ...(status === 'approved' && {
        approvedById,
        approvedAt: new Date(),
      }),
    },
  });
}

export async function updateAdCopy(
  id: string,
  data: Partial<{
    primaryText: string;
    headline: string;
    description: string;
    cta: string;
  }>
) {
  return prisma.adDraft.update({ where: { id }, data });
}

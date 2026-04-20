import { prisma } from '../lib/prisma.js';
import type { SchoolProfile } from '@tassel/types';

export async function createClient(data: { name: string; websiteUrl: string }) {
  return prisma.client.create({ data });
}

export async function listClients() {
  return prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      schoolProfile: { select: { scanStatus: true, scanDate: true } },
      _count: { select: { campaigns: true } },
    },
  });
}

export async function getClientById(id: string) {
  return prisma.client.findUniqueOrThrow({
    where: { id },
    include: {
      schoolProfile: true,
      campaigns: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, goal: true, status: true, createdAt: true },
      },
    },
  });
}

export async function updateSchoolProfile(clientId: string, profileData: SchoolProfile) {
  return prisma.schoolProfile.upsert({
    where: { clientId },
    update: { profileData: profileData as any, scanStatus: 'complete', scanDate: new Date() },
    create: { clientId, profileData: profileData as any, scanStatus: 'complete' },
  });
}

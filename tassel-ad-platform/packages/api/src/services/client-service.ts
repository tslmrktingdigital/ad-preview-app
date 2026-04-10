import { prisma } from '../lib/prisma.js';
import type { SchoolProfile } from '@tassel/types';

export async function createClient(data: { name: string; websiteUrl: string }) {
  return prisma.client.create({ data });
}

export async function listClients() {
  return prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getClientById(id: string) {
  return prisma.client.findUniqueOrThrow({ where: { id } });
}

export async function updateSchoolProfile(clientId: string, profileData: SchoolProfile) {
  return prisma.schoolProfile.upsert({
    where: { clientId },
    update: { profileData: profileData as any, scanStatus: 'complete' },
    create: { clientId, profileData: profileData as any, scanStatus: 'complete' },
  });
}

import ExcelJS from 'exceljs';
import { prisma } from '../lib/prisma.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function styleHeaderRow(row: ExcelJS.Row): void {
  row.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' },
    };
    cell.alignment = { vertical: 'middle', wrapText: false };
  });
}

function applyAlternateRowFill(row: ExcelJS.Row, rowIndex: number): void {
  // rowIndex 1 = header; data rows start at index 2
  if (rowIndex % 2 === 0) {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF9FAFB' },
      };
    });
  }
}

function setColumnWidths(
  sheet: ExcelJS.Worksheet,
  widths: { key: string; width: number }[],
): void {
  widths.forEach(({ key, width }) => {
    const col = sheet.getColumn(key);
    col.width = width;
  });
}

// ── Campaign export ───────────────────────────────────────────────────────────

export async function exportCampaignToExcel(campaignId: string): Promise<Buffer> {
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
    include: {
      client: true,
      adDrafts: { orderBy: { createdAt: 'asc' } },
    },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Tassel Ad Platform';
  workbook.created = new Date();

  // ── Sheet 1: Campaign Brief ─────────────────────────────────────────────────

  const briefSheet = workbook.addWorksheet('Campaign Brief');

  briefSheet.columns = [
    { header: 'Field', key: 'field', width: 25 },
    { header: 'Value', key: 'value', width: 40 },
  ];

  styleHeaderRow(briefSheet.getRow(1));
  briefSheet.views = [{ state: 'frozen', ySplit: 1 }];

  const briefRows = [
    { field: 'Campaign Name', value: campaign.name },
    { field: 'Client', value: campaign.client.name },
    { field: 'Goal', value: campaign.goal },
    { field: 'Season', value: campaign.season ?? '' },
    { field: 'Target Demographic', value: campaign.targetDemographic ?? '' },
    {
      field: 'Daily Budget',
      value: campaign.budget != null ? `$${Number(campaign.budget).toFixed(2)}` : '',
    },
    {
      field: 'Start Date',
      value: campaign.startDate ? campaign.startDate.toISOString().split('T')[0] : '',
    },
    {
      field: 'End Date',
      value: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
    },
    { field: 'Status', value: campaign.status },
    {
      field: 'Created',
      value: campaign.createdAt.toISOString().split('T')[0],
    },
  ];

  briefRows.forEach((data, i) => {
    const row = briefSheet.addRow(data);
    applyAlternateRowFill(row, i + 2); // +2 because header is row 1
  });

  // ── Sheet 2: Ad Drafts ──────────────────────────────────────────────────────

  const draftsSheet = workbook.addWorksheet('Ad Drafts');

  draftsSheet.columns = [
    { header: 'Variant #', key: 'variant', width: 12 },
    { header: 'Headline', key: 'headline', width: 30 },
    { header: 'Primary Text', key: 'primaryText', width: 40 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Call to Action', key: 'cta', width: 18 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Platform', key: 'platform', width: 15 },
    { header: 'Image Brief', key: 'imageBrief', width: 40 },
    { header: 'Hashtags', key: 'hashtags', width: 30 },
    { header: 'Prompt Version', key: 'promptVersion', width: 18 },
    { header: 'Created', key: 'created', width: 15 },
  ];

  styleHeaderRow(draftsSheet.getRow(1));
  draftsSheet.views = [{ state: 'frozen', ySplit: 1 }];

  campaign.adDrafts.forEach((ad, i) => {
    const row = draftsSheet.addRow({
      variant: i + 1,
      headline: ad.headline,
      primaryText: ad.primaryText,
      description: ad.description ?? '',
      cta: ad.cta,
      status: ad.status,
      platform: 'Meta (FB/IG)',
      imageBrief: ad.imageBrief,
      hashtags: ad.hashtags.join(', '),
      promptVersion: ad.promptVersion ?? '',
      created: ad.createdAt.toISOString().split('T')[0],
    });
    applyAlternateRowFill(row, i + 2);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ── All-ads export ────────────────────────────────────────────────────────────

export async function exportAdsQueueToExcel(status?: string): Promise<Buffer> {
  const ads = await prisma.adDraft.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      campaign: {
        select: {
          name: true,
          client: { select: { name: true } },
        },
      },
    },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Tassel Ad Platform';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Ad Queue');

  sheet.columns = [
    { header: 'Client', key: 'client', width: 25 },
    { header: 'Campaign', key: 'campaign', width: 30 },
    { header: 'Variant #', key: 'variant', width: 12 },
    { header: 'Headline', key: 'headline', width: 30 },
    { header: 'Primary Text', key: 'primaryText', width: 40 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'CTA', key: 'cta', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Platform', key: 'platform', width: 15 },
    { header: 'Image Brief', key: 'imageBrief', width: 40 },
    { header: 'Created', key: 'created', width: 15 },
  ];

  styleHeaderRow(sheet.getRow(1));
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  ads.forEach((ad, i) => {
    const row = sheet.addRow({
      client: ad.campaign?.client?.name ?? '',
      campaign: ad.campaign?.name ?? '',
      variant: i + 1,
      headline: ad.headline,
      primaryText: ad.primaryText,
      description: ad.description ?? '',
      cta: ad.cta,
      status: ad.status,
      platform: 'Meta (FB/IG)',
      imageBrief: ad.imageBrief,
      created: ad.createdAt.toISOString().split('T')[0],
    });
    applyAlternateRowFill(row, i + 2);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

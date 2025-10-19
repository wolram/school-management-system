import { prisma } from '../config/database';
import { CreateSegmentInput, CreateSeriesInput, CreateClassInput } from '../types';

// ═══════════════════════════════════════════════════════════════
// SEGMENT SERVICES
// ═══════════════════════════════════════════════════════════════

export const segmentService = {
  // Create new segment
  async createSegment(data: CreateSegmentInput) {
    const segment = await prisma.segment.create({
      data: {
        name: data.name,
        ...(typeof data.order === 'number' && { order: data.order }),
        ...(typeof data.active === 'boolean' && { active: data.active }),
      },
      include: { series: true },
    });
    return segment;
  },

  // Get all segments with pagination
  async getAllSegments(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [segments, total] = await Promise.all([
      prisma.segment.findMany({
        skip,
        take: limit,
        include: { series: { include: { classes: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.segment.count(),
    ]);
    return { segments, total, page, limit };
  },

  // Get segment by ID
  async getSegmentById(id: string) {
    const segment = await prisma.segment.findUnique({
      where: { id },
      include: { series: { include: { classes: true } } },
    });
    if (!segment) throw new Error('Segment not found');
    return segment;
  },

  // Update segment
  async updateSegment(id: string, data: Partial<CreateSegmentInput>) {
    const segment = await prisma.segment.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(typeof data.order === 'number' && { order: data.order }),
        ...(typeof data.active === 'boolean' && { active: data.active }),
      },
      include: { series: true },
    });
    return segment;
  },

  // Delete segment
  async deleteSegment(id: string) {
    await prisma.segment.delete({ where: { id } });
    return { success: true };
  },
};

// ═══════════════════════════════════════════════════════════════
// SERIES SERVICES
// ═══════════════════════════════════════════════════════════════

export const seriesService = {
  // Create new series
  async createSeries(data: CreateSeriesInput) {
    const series = await prisma.series.create({
      data: {
        name: data.name,
        segmentId: data.segmentId,
        ...(typeof data.order === 'number' && { order: data.order }),
        ...(typeof data.active === 'boolean' && { active: data.active }),
      },
      include: { segment: true, classes: true },
    });
    return series;
  },

  // Get all series by segment
  async getSeriesBySegment(segmentId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [series, total] = await Promise.all([
      prisma.series.findMany({
        where: { segmentId },
        skip,
        take: limit,
        include: { segment: true, classes: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.series.count({ where: { segmentId } }),
    ]);
    return { series, total, page, limit };
  },

  // Get all series with pagination
  async getAllSeries(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [series, total] = await Promise.all([
      prisma.series.findMany({
        skip,
        take: limit,
        include: { segment: true, classes: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.series.count(),
    ]);
    return { series, total, page, limit };
  },

  // Get series by ID
  async getSeriesById(id: string) {
    const series = await prisma.series.findUnique({
      where: { id },
      include: { segment: true, classes: true },
    });
    if (!series) throw new Error('Series not found');
    return series;
  },

  // Update series
  async updateSeries(id: string, data: Partial<CreateSeriesInput>) {
    const series = await prisma.series.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.segmentId && { segmentId: data.segmentId }),
        ...(typeof data.order === 'number' && { order: data.order }),
        ...(typeof data.active === 'boolean' && { active: data.active }),
      },
      include: { segment: true, classes: true },
    });
    return series;
  },

  // Delete series
  async deleteSeries(id: string) {
    await prisma.series.delete({ where: { id } });
    return { success: true };
  },
};

// ═══════════════════════════════════════════════════════════════
// CLASS SERVICES
// ═══════════════════════════════════════════════════════════════

export const classService = {
  // Create new class
  async createClass(data: CreateClassInput) {
    const schoolClass = await prisma.class.create({
      data: {
        name: data.name,
        seriesId: data.seriesId,
        defaultEntryTime: data.defaultEntryTime,
        defaultExitTime: data.defaultExitTime,
        active: data.active ?? true,
      },
      include: { series: { include: { segment: true } } },
    });
    return schoolClass;
  },

  // Get all classes by series
  async getClassesBySeries(seriesId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where: { seriesId },
        skip,
        take: limit,
        include: { series: { include: { segment: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.class.count({ where: { seriesId } }),
    ]);
    return { classes, total, page, limit };
  },

  // Get class by ID
  async getClassById(id: string) {
    const schoolClass = await prisma.class.findUnique({
      where: { id },
      include: { series: { include: { segment: true } } },
    });
    if (!schoolClass) throw new Error('Class not found');
    return schoolClass;
  },

  // Update class
  async updateClass(id: string, data: Partial<CreateClassInput>) {
    const schoolClass = await prisma.class.update({
      where: { id },
      data,
      include: { series: { include: { segment: true } } },
    });
    return schoolClass;
  },

  // Delete class
  async deleteClass(id: string) {
    await prisma.class.delete({ where: { id } });
    return { success: true };
  },

  // Get all classes (system-wide)
  async getAllClasses(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        skip,
        take: limit,
        include: { series: { include: { segment: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.class.count(),
    ]);
    return { classes, total, page, limit };
  },
};

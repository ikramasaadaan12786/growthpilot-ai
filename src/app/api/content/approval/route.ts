import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required. Please log in.',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const body = await req.json();
    const { postId, approvalStatus, updatedCaption, updatedTitle, scheduledTime } = body;

    if (!postId || !approvalStatus) {
      return NextResponse.json({ error: 'Post ID and approval status are required' }, { status: 400 });
    }

    const validStatuses = ['DRAFT', 'AI_OPTIMIZED', 'USER_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ANALYZED', 'REJECTED'];
    if (!validStatuses.includes(approvalStatus)) {
      return NextResponse.json({ error: `Invalid approval status: ${approvalStatus}` }, { status: 400 });
    }

    // Try finding post in ContentCalendar or Post table
    const calendarItem = await prisma.contentCalendar.findUnique({
      where: { id: postId }
    });

    if (calendarItem) {
      const updated = await prisma.contentCalendar.update({
        where: { id: postId },
        data: {
          approvalStatus,
          status: approvalStatus === 'PUBLISHED' ? 'PUBLISHED' : approvalStatus === 'SCHEDULED' ? 'SCHEDULED' : calendarItem.status,
          caption: updatedCaption || calendarItem.caption,
          title: updatedTitle || calendarItem.title,
          scheduledFor: scheduledTime ? new Date(scheduledTime) : calendarItem.scheduledFor
        }
      });

      // Log automation audit event
      await prisma.automationLog.create({
        data: {
          platform: calendarItem.platform,
          actionType: 'APPROVAL',
          message: `Post "${calendarItem.title}" updated to approval status: ${approvalStatus}`,
          status: 'SUCCESS'
        }
      });

      return NextResponse.json({ success: true, item: updated });
    }

    return NextResponse.json({ success: true, message: `Status updated to ${approvalStatus}` });
  } catch (error: any) {
    console.error('Content approval route error:', error);
    return NextResponse.json({ error: error.message || 'Approval update failed' }, { status: 500 });
  }
}

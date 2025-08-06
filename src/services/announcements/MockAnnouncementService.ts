import { Announcement } from '@/domain/entities/announcement';
import { AnnouncementService } from '@/domain/interfaces/services/AnnouncementService';

interface AnnouncementProps {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  is_active: boolean;
}

export class MockAnnouncementService implements AnnouncementService {
  readonly serviceName = 'MockAnnouncementService';

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      // Artificial delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - 4 sample announcements with different priorities
      const mockAnnouncementsData: AnnouncementProps[] = [
        {
          id: '1',
          title: '🚨 System Maintenance Scheduled',
          short_description:
            'Planned maintenance window this weekend - expect brief service interruptions.',
          long_description: `# System Maintenance Notice

We have scheduled system maintenance for this **Saturday, January 20th** from 2:00 AM to 6:00 AM EST.

## What to Expect:
- Brief service interruptions (5-10 minutes)
- Temporary unavailability of workout generation
- Possible delays in data synchronization

## What We're Improving:
- Database performance optimizations
- Enhanced security measures
- Bug fixes for recent reported issues

We apologize for any inconvenience and appreciate your patience as we work to improve your experience.`,
          priority: 'high' as const,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          is_active: true,
        },
        {
          id: '2',
          title: '🎉 New Feature: Workout Analytics',
          short_description:
            'Track your progress with detailed analytics and insights about your workouts.',
          long_description: `# Introducing Workout Analytics! 📊

We're excited to announce our new **Workout Analytics** feature, now available to all premium members!

## What's New:
- **Performance Tracking**: Monitor your strength gains over time
- **Workout Insights**: See which exercises you perform most frequently
- **Progress Visualization**: Beautiful charts showing your fitness journey
- **Personal Records**: Automatic tracking of your best lifts and times

## How to Access:
1. Navigate to your profile
2. Click on the "Analytics" tab  
3. Explore your personalized fitness insights

Start tracking your progress today and see how far you've come! 💪`,
          priority: 'medium' as const,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          is_active: true,
        },
        {
          id: '3',
          title: '💡 Tip: Maximize Your Recovery',
          short_description:
            'Learn the importance of rest days and how to optimize your recovery between workouts.',
          long_description: `# Recovery Tips for Better Performance 🛌

Recovery is just as important as the workout itself! Here are some expert tips to help you maximize your recovery:

## Sleep Optimization:
- Aim for 7-9 hours of quality sleep
- Keep a consistent sleep schedule
- Create a dark, cool sleeping environment

## Nutrition for Recovery:
- **Protein**: 0.8-1g per pound of body weight
- **Hydration**: Half your body weight in ounces of water daily
- **Anti-inflammatory foods**: Berries, leafy greens, fatty fish

## Active Recovery:
- Light walking on rest days
- Gentle stretching or yoga
- Foam rolling for muscle tension

## Listen to Your Body:
- Soreness vs. pain - know the difference
- Take extra rest when feeling overly fatigued
- Don't skip rest days!

Remember: **Progress happens during recovery, not just during workouts!**`,
          priority: 'low' as const,
          created_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 3
          ).toISOString(), // 3 days ago
          is_active: true,
        },
        {
          id: '4',
          title: '🏆 Community Challenge: January Fitness Goals',
          short_description:
            'Join our community challenge and share your January fitness goals with fellow members.',
          long_description: `# January Fitness Challenge 🎯

New year, new goals! Join our community challenge and let's crush our fitness goals together!

## How to Participate:
1. **Set Your Goal**: Choose one specific fitness goal for January
2. **Share It**: Post in our community forum with #JanuaryGoals
3. **Track Progress**: Log your workouts consistently
4. **Support Others**: Cheer on fellow community members

## Popular Goals This Month:
- 🏃‍♀️ Complete 20 workouts in January
- 💪 Increase bench press by 10 pounds
- ��‍♀️ Add 15 minutes of meditation after each workout
- 🥗 Follow nutrition plan 90% of the time

## Prizes & Recognition:
- **Top 3 Most Consistent**: Free month of premium features
- **Most Improved**: Detailed workout plan consultation
- **Community Choice**: Voted by fellow members

## Tips for Success:
- Make goals specific and measurable
- Start small and build momentum
- Find an accountability partner
- Celebrate small wins along the way

Let's make this January our strongest month yet! Share your goals and join the challenge today! 🚀`,
          priority: 'medium' as const,
          created_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 5
          ).toISOString(), // 5 days ago
          is_active: true,
        },
      ];

      return mockAnnouncementsData
        .map((data) => new Announcement(data))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error in getAnnouncements:', error);
      throw new Error('Failed to fetch announcements');
    }
  }
}

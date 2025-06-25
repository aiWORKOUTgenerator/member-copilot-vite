# Rewards System Documentation

A complete gamification and rewards system for the member-copilot-vite application.

## 🎯 Overview

This rewards system enables you to:
- **Gamify user actions** (phone verification, workout completion, streaks)
- **Reward user engagement** with coupons, discounts, free items, points, and badges
- **Track progress** toward reward achievements
- **Manage reward lifecycle** from creation to redemption

## 🏗️ Architecture

The system follows clean architecture principles:

- **Domain Layer**: Business entities and rules (`Reward`, `UserRewardClaim`)
- **Service Layer**: Business logic interface and implementation
- **Context Layer**: React state management with Clerk authentication
- **Hook Layer**: Specialized hooks for different use cases
- **UI Layer**: Atomic design components (atoms, molecules, organisms)

## 📦 Frontend Integration

### Quick Start

```tsx
import { useRewardTriggers } from '@/hooks/useRewards';

function MyComponent() {
  const { triggerPhoneVerification, triggerFirstWorkout } = useRewardTriggers();
  
  const handlePhoneVerified = async () => {
    // Your existing phone verification logic
    await verifyPhone();
    
    // Trigger reward check
    const rewards = await triggerPhoneVerification();
    if (rewards.length > 0) {
      console.log('User earned rewards!', rewards);
    }
  };
}
```

### Available Hooks

```tsx
import {
  useRewards,           // Basic reward data and operations
  useRewardClaiming,    // Claim functionality
  useRewardRedemption,  // Redemption functionality
  useRewardProgress,    // Progress tracking
  useRewardTriggers,    // Event triggers
  useRewardFilters      // Filtering and search
} from '@/hooks/useRewards';
```

### Integration Examples

#### 1. Phone Verification Integration

```tsx
import { useRewardTriggers } from '@/hooks/useRewards';

export function PhoneVerificationForm() {
  const { triggerPhoneVerification } = useRewardTriggers();
  
  const handleVerifyPhone = async (phoneNumber: string) => {
    try {
      await verifyPhoneNumber(phoneNumber);
      
      // Trigger rewards
      const rewards = await triggerPhoneVerification();
      
      if (rewards.length > 0) {
        showNotification(`Phone verified! You earned ${rewards.length} reward(s)!`);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };
}
```

#### 2. Workout Completion Integration

```tsx
import { useRewardTriggers } from '@/hooks/useRewards';

export function WorkoutComplete({ isFirstWorkout }: { isFirstWorkout: boolean }) {
  const { triggerFirstWorkout, triggerWorkoutStreak } = useRewardTriggers();
  
  const handleWorkoutComplete = async () => {
    await markWorkoutComplete();
    
    if (isFirstWorkout) {
      await triggerFirstWorkout();
    }
    
    const currentStreak = calculateWorkoutStreak();
    if (currentStreak >= 3) {
      await triggerWorkoutStreak(currentStreak);
    }
  };
}
```

### UI Components

#### Full Dashboard
```tsx
import { RewardDashboard } from '@/ui/shared/organisms/RewardDashboard';

function MyPage() {
  return <RewardDashboard />;
}
```

#### Individual Components
```tsx
import { 
  RewardCard,
  RewardClaimCard,
  RewardProgressCard,
  RewardNotification 
} from '@/ui/shared/molecules';

import {
  RewardBadge,
  ProgressBar,
  CouponCode
} from '@/ui/shared/atoms';
```

## 🔧 Backend API Specification

### Base URLs
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-api.com/api`

### Authentication
All API requests require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Error Response Format
```json
{
  "error": {
    "type": "reward_not_found",
    "message": "Reward not found",
    "details": {
      "reward_id": "invalid-id"
    },
    "retryable": false
  }
}
```

### API Endpoints

#### 1. Get Active Rewards
```http
GET /api/rewards
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "phone-verification-reward",
      "name": "Phone Verification Bonus",
      "description": "Verify your phone number and get a welcome coupon!",
      "type": "coupon",
      "value": "10% off your first smoothie",
      "status": "active",
      "expires_at": null,
      "quantity_limit": null,
      "quantity_claimed": 0,
      "redemption_instructions": "Show this coupon to staff at checkout",
      "terms_and_conditions": "Valid for 30 days from claiming. One-time use only.",
      "image_url": null,
      "config": {
        "trigger_type": "phone_verification",
        "trigger_data": {}
      },
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### 2. Check Reward Eligibility
```http
GET /api/rewards/{rewardId}/eligibility
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eligible": true,
    "reason": null,
    "requirements_met": {
      "phone_verified": true,
      "not_already_claimed": true
    },
    "next_requirement": null
  }
}
```

#### 3. Claim Reward
```http
POST /api/rewards/{rewardId}/claim
```

**Request Body:**
```json
{
  "trigger_data": {
    "source": "phone_verification",
    "phone_number": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "claim": {
      "id": "claim-123",
      "user_id": "user-456",
      "reward_id": "phone-verification-reward",
      "coupon_code": "PHONE10",
      "claimed_at": "2025-01-01T12:00:00Z",
      "expires_at": "2025-02-01T12:00:00Z",
      "redeemed_at": null,
      "trigger_data": {
        "source": "phone_verification",
        "phone_number": "+1234567890"
      }
    },
    "message": "Reward claimed successfully!"
  }
}
```

#### 4. Get User Claims
```http
GET /api/user/rewards/claims
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "claim-123",
      "user_id": "user-456",
      "reward_id": "phone-verification-reward",
      "coupon_code": "PHONE10",
      "claimed_at": "2025-01-01T12:00:00Z",
      "expires_at": "2025-02-01T12:00:00Z",
      "redeemed_at": null,
      "trigger_data": {
        "source": "phone_verification"
      }
    }
  ]
}
```

#### 5. Redeem Claim
```http
POST /api/user/rewards/claims/{claimId}/redeem
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reward redeemed successfully!"
  }
}
```

#### 6. Get User Reward Summary
```http
GET /api/user/rewards/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_rewards_available": 5,
    "total_rewards_claimed": 2,
    "total_rewards_redeemed": 1,
    "active_claims": [
      {
        "id": "claim-123",
        "reward_id": "phone-verification-reward",
        "coupon_code": "PHONE10",
        "expires_at": "2025-02-01T12:00:00Z"
      }
    ],
    "points_balance": 150
  }
}
```

#### 7. Get User Progress
```http
GET /api/user/rewards/progress
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "reward_id": "workout-streak-3",
      "reward": {
        "id": "workout-streak-3",
        "name": "3-Day Workout Streak",
        "value": "Free protein smoothie"
      },
      "progress_percentage": 66.7,
      "current_value": 2,
      "target_value": 3,
      "description": "Complete 1 more workout in the next 2 days to earn this reward"
    }
  ]
}
```

#### 8. Trigger Reward Check
```http
POST /api/user/rewards/trigger
```

**Request Body:**
```json
{
  "trigger_type": "phone_verification",
  "trigger_data": {
    "phone_number": "+1234567890",
    "verified_at": "2025-01-01T12:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "triggered_rewards": [
      {
        "success": true,
        "claim": {
          "id": "claim-123",
          "reward_id": "phone-verification-reward",
          "coupon_code": "PHONE10"
        },
        "message": "Phone verification reward claimed!"
      }
    ],
    "available_rewards": [
      {
        "id": "workout-streak-3",
        "name": "3-Day Workout Streak"
      }
    ]
  }
}
```

#### 9. Validate Coupon Code
```http
GET /api/rewards/coupon/{couponCode}/validate
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "claim": {
      "id": "claim-123",
      "user_id": "user-456",
      "coupon_code": "PHONE10"
    },
    "reward": {
      "id": "phone-verification-reward",
      "name": "Phone Verification Bonus",
      "value": "10% off your first smoothie"
    },
    "message": "Valid coupon code"
  }
}
```

## 🗄️ Database Schema

### Tables

#### 1. rewards
```sql
CREATE TABLE rewards (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('coupon', 'discount', 'free_item', 'points', 'badge') NOT NULL,
    value VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'expired', 'exhausted') DEFAULT 'active',
    expires_at TIMESTAMP NULL,
    quantity_limit INT NULL,
    quantity_claimed INT DEFAULT 0,
    redemption_instructions TEXT,
    terms_and_conditions TEXT,
    image_url VARCHAR(500) NULL,
    config JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_expires_at (expires_at)
);
```

#### 2. user_reward_claims
```sql
CREATE TABLE user_reward_claims (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    reward_id VARCHAR(255) NOT NULL,
    coupon_code VARCHAR(100) NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    redeemed_at TIMESTAMP NULL,
    trigger_data JSON,
    
    FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_reward_id (reward_id),
    INDEX idx_coupon_code (coupon_code),
    INDEX idx_claimed_at (claimed_at),
    INDEX idx_expires_at (expires_at),
    
    UNIQUE KEY unique_user_reward (user_id, reward_id)
);
```

#### 3. user_progress (Optional - for tracking detailed progress)
```sql
CREATE TABLE user_progress (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    progress_type ENUM('phone_verification', 'workout_count', 'workout_streak', 'milestone') NOT NULL,
    current_value INT DEFAULT 0,
    target_value INT NOT NULL,
    data JSON,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_progress_type (progress_type),
    UNIQUE KEY unique_user_progress (user_id, progress_type)
);
```

### Sample Data

#### Sample Rewards
```sql
INSERT INTO rewards (id, name, description, type, value, config) VALUES
('phone-verification-reward', 'Phone Verification Bonus', 'Verify your phone number and get a welcome coupon!', 'coupon', '10% off your first smoothie', '{"trigger_type": "phone_verification", "trigger_data": {}}'),
('first-workout-bonus', 'First Workout Bonus', 'Complete your first workout and get a free protein bar!', 'free_item', 'Free protein bar', '{"trigger_type": "first_workout", "trigger_data": {}}'),
('workout-streak-3', '3-Day Workout Streak', 'Complete 3 workouts in 3 days and earn a free smoothie!', 'free_item', 'Free protein smoothie', '{"trigger_type": "workout_streak", "trigger_data": {"streak_days": 3, "window_days": 3}}');
```

### Database Indexes

For optimal performance, ensure these indexes exist:

```sql
-- Rewards table
CREATE INDEX idx_rewards_status_type ON rewards(status, type);
CREATE INDEX idx_rewards_config_trigger ON rewards((JSON_EXTRACT(config, '$.trigger_type')));

-- User claims table  
CREATE INDEX idx_claims_user_status ON user_reward_claims(user_id, redeemed_at);
CREATE INDEX idx_claims_active ON user_reward_claims(user_id, expires_at) WHERE redeemed_at IS NULL;

-- User progress table
CREATE INDEX idx_progress_user_type ON user_progress(user_id, progress_type);
```

## 🔒 Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only access their own reward data
3. **Rate Limiting**: Implement rate limiting on claim endpoints
4. **Validation**: Validate all trigger data and reward eligibility server-side
5. **Coupon Security**: Generate cryptographically secure coupon codes
6. **Audit Logging**: Log all reward claims and redemptions

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL=your_database_connection_string

# Redis (for caching)
REDIS_URL=your_redis_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Feature flags
REWARDS_ENABLED=true
```

### Migration Scripts
Create database migration scripts for the schema above and run them in your deployment pipeline.

## 📊 Analytics & Monitoring

Consider tracking these metrics:
- Reward claim rates by type
- User engagement after claiming rewards
- Redemption rates by reward type
- Progress abandonment rates
- Popular reward types

## 🧪 Testing

The frontend includes comprehensive tests:
- **58 tests covering all layers**
- Domain entities: 19 tests
- Service layer: 32 tests  
- UI components: 6 tests
- Hook integration: 1 test

For backend testing, ensure you test:
- Reward eligibility logic
- Claim validation and deduplication
- Progress tracking accuracy
- Coupon code generation and validation
- Error handling and edge cases

## 🎯 Next Steps

1. **Implement Backend API**: Use the specifications above
2. **Set up Database**: Create tables and indexes
3. **Configure Authentication**: Integrate with your auth system
4. **Add Analytics**: Track reward system metrics
5. **Test Integration**: Verify frontend-backend integration
6. **Deploy**: Deploy both frontend and backend changes

## 💡 Customization

The system is designed to be extensible:
- Add new reward types in the `RewardType` enum
- Create new trigger types in `RewardTriggerType`
- Implement custom eligibility logic in the service layer
- Add new UI components following the atomic design pattern

## 📞 Support

For questions or issues:
1. Check the component tests for usage examples
2. Review the service implementation for business logic
3. Examine the UI components for styling patterns
4. Refer to this documentation for API specifications 
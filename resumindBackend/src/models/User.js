const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WEEKLY_RESUME_LIMIT = 10;
const WEEKLY_ANALYSIS_LIMIT = 10;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const weeklyUsageSchema = new mongoose.Schema(
  {
    windowStart: {
      type: Date,
      default: () => new Date()
    },
    resumesCreated: {
      type: Number,
      default: 0,
      min: 0
    },
    analysesRun: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    weeklyUsage: {
      type: weeklyUsageSchema,
      default: () => ({
        windowStart: new Date(),
        resumesCreated: 0,
        analysesRun: 0
      })
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare candidate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Synchronize weekly window (auto-resets if 7 days have passed)
userSchema.methods.syncWeeklyQuota = async function () {
  const now = Date.now();
  if (!this.weeklyUsage || !this.weeklyUsage.windowStart) {
    this.weeklyUsage = {
      windowStart: new Date(now),
      resumesCreated: 0,
      analysesRun: 0
    };
    await this.save();
    return this.getQuotaSummary();
  }

  const startMs = new Date(this.weeklyUsage.windowStart).getTime();
  if (now - startMs >= SEVEN_DAYS_MS) {
    this.weeklyUsage.windowStart = new Date(now);
    this.weeklyUsage.resumesCreated = 0;
    this.weeklyUsage.analysesRun = 0;
    await this.save();
  }

  return this.getQuotaSummary();
};

// Compute structured quota summary for API responses
userSchema.methods.getQuotaSummary = function () {
  const now = Date.now();
  const windowStart =
    this.weeklyUsage && this.weeklyUsage.windowStart
      ? new Date(this.weeklyUsage.windowStart)
      : new Date(now);

  let startMs = windowStart.getTime();
  let resumesUsed = (this.weeklyUsage && this.weeklyUsage.resumesCreated) || 0;
  let analysesUsed = (this.weeklyUsage && this.weeklyUsage.analysesRun) || 0;

  if (now - startMs >= SEVEN_DAYS_MS) {
    startMs = now;
    resumesUsed = 0;
    analysesUsed = 0;
  }

  const resetAt = new Date(startMs + SEVEN_DAYS_MS).toISOString();

  return {
    resumesLimit: WEEKLY_RESUME_LIMIT,
    resumesUsed,
    resumesRemaining: Math.max(0, WEEKLY_RESUME_LIMIT - resumesUsed),
    analysesLimit: WEEKLY_ANALYSIS_LIMIT,
    analysesUsed,
    analysesRemaining: Math.max(0, WEEKLY_ANALYSIS_LIMIT - analysesUsed),
    windowStart: new Date(startMs).toISOString(),
    resetAt
  };
};

// Never expose password hash in JSON output; always include computed weeklyQuota
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  user.weeklyQuota = this.getQuotaSummary();
  return user;
};

const User = mongoose.model('User', userSchema);
User.WEEKLY_RESUME_LIMIT = WEEKLY_RESUME_LIMIT;
User.WEEKLY_ANALYSIS_LIMIT = WEEKLY_ANALYSIS_LIMIT;
module.exports = User;

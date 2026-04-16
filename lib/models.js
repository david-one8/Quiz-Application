import mongoose from "mongoose";

function createSchema(definition, options = {}) {
  return new mongoose.Schema(definition, {
    timestamps: true,
    versionKey: false,
    ...options,
    toJSON: {
      virtuals: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
      ...options.toJSON
    },
    toObject: {
      virtuals: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
      ...options.toObject
    }
  });
}

const idField = {
  type: String,
  default: () => new mongoose.Types.ObjectId().toString()
};

const userSchema = createSchema({
  _id: idField,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "TEACHER", "STUDENT"],
    default: "STUDENT"
  }
});

const quizSchema = createSchema({
  _id: idField,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdById: {
    type: String,
    ref: "User",
    required: true,
    index: true
  }
});

const questionSchema = createSchema({
  _id: idField,
  quizId: {
    type: String,
    ref: "Quiz",
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  optionA: {
    type: String,
    required: true
  },
  optionB: {
    type: String,
    required: true
  },
  optionC: {
    type: String,
    required: true
  },
  optionD: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  marks: {
    type: Number,
    default: 1
  }
});

const attemptSchema = createSchema(
  {
    _id: idField,
    quizId: {
      type: String,
      ref: "Quiz",
      required: true,
      index: true
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true
    },
    score: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: false
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);
export const Attempt =
  mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);

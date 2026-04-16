import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Attempt, Question, Quiz, User } from "@/lib/models";

function serialize(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }

  if (value instanceof mongoose.Document) {
    return serialize(value.toObject());
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "object") {
    const output = {};

    for (const [key, current] of Object.entries(value)) {
      if (key === "__v") {
        continue;
      }

      if (key === "_id") {
        output.id = String(current);
        continue;
      }

      output[key] = serialize(current);
    }

    return output;
  }

  return value;
}

function applySelect(doc, select) {
  const plain = serialize(doc);

  if (!select) {
    return plain;
  }

  const output = {};

  for (const [key, enabled] of Object.entries(select)) {
    if (enabled && key in plain) {
      output[key] = plain[key];
    }
  }

  return output;
}

function buildSort(orderBy) {
  if (!orderBy) {
    return undefined;
  }

  if (Array.isArray(orderBy)) {
    return orderBy.reduce((accumulator, entry) => {
      const [field, direction] = Object.entries(entry)[0];
      accumulator[field === "id" ? "_id" : field] = direction === "desc" ? -1 : 1;
      return accumulator;
    }, {});
  }

  const [field, direction] = Object.entries(orderBy)[0];
  return {
    [field === "id" ? "_id" : field]: direction === "desc" ? -1 : 1
  };
}

async function buildWhere(modelName, where = {}) {
  if (!where || !Object.keys(where).length) {
    return {};
  }

  const output = {};

  for (const [key, value] of Object.entries(where)) {
    if (key === "OR" && Array.isArray(value)) {
      output.$or = await Promise.all(value.map((entry) => buildWhere(modelName, entry)));
      continue;
    }

    if (key === "id") {
      output._id = value;
      continue;
    }

    if (key === "quiz" && (modelName === "question" || modelName === "attempt")) {
      const quizFilter = await buildWhere("quiz", value);
      const quizIds = await Quiz.find(quizFilter).distinct("_id");
      output.quizId = { $in: quizIds };
      continue;
    }

    output[key] = value;
  }

  return output;
}

async function includeQuestion(doc, include) {
  const plain = serialize(doc);

  if (!include) {
    return plain;
  }

  if (include.quiz) {
    const quiz = await Quiz.findById(plain.quizId);
    plain.quiz =
      include.quiz === true ? serialize(quiz) : applySelect(quiz, include.quiz.select);
  }

  return plain;
}

async function includeAttempt(doc, include) {
  const plain = serialize(doc);

  if (!include) {
    return plain;
  }

  if (include.quiz) {
    const quiz = await Quiz.findById(plain.quizId);
    plain.quiz =
      include.quiz === true ? serialize(quiz) : applySelect(quiz, include.quiz.select);
  }

  if (include.user) {
    const user = await User.findById(plain.userId);
    plain.user =
      include.user === true ? serialize(user) : applySelect(user, include.user.select);
  }

  return plain;
}

async function includeQuiz(doc, include) {
  const plain = serialize(doc);

  if (!include) {
    return plain;
  }

  if (include.createdBy) {
    const user = await User.findById(plain.createdById);
    plain.createdBy =
      include.createdBy === true
        ? serialize(user)
        : applySelect(user, include.createdBy.select);
  }

  if (include.questions) {
    const questions = await Question.find({ quizId: plain.id }).sort({ createdAt: 1 });
    plain.questions = serialize(questions);
  }

  if (include.attempts) {
    const sort = buildSort(include.attempts.orderBy);
    let query = Attempt.find({ quizId: plain.id });

    if (sort) {
      query = query.sort(sort);
    }

    const attempts = await query;
    plain.attempts = await Promise.all(
      attempts.map((attempt) => includeAttempt(attempt, include.attempts.include))
    );
  }

  if (include._count?.select) {
    const counts = {};

    if (include._count.select.questions) {
      counts.questions = await Question.countDocuments({ quizId: plain.id });
    }

    if (include._count.select.attempts) {
      counts.attempts = await Attempt.countDocuments({ quizId: plain.id });
    }

    plain._count = counts;
  }

  return plain;
}

async function findMany(modelName, Model, args = {}) {
  await connectToDatabase();

  const where = await buildWhere(modelName, args.where);
  let query = Model.find(where);
  const sort = buildSort(args.orderBy);

  if (sort) {
    query = query.sort(sort);
  }

  if (typeof args.take === "number") {
    query = query.limit(args.take);
  }

  const docs = await query;

  if (args.select) {
    return docs.map((doc) => applySelect(doc, args.select));
  }

  if (modelName === "quiz") {
    return Promise.all(docs.map((doc) => includeQuiz(doc, args.include)));
  }

  if (modelName === "question") {
    return Promise.all(docs.map((doc) => includeQuestion(doc, args.include)));
  }

  if (modelName === "attempt") {
    return Promise.all(docs.map((doc) => includeAttempt(doc, args.include)));
  }

  return docs.map((doc) => applySelect(doc, args.select));
}

async function findUnique(modelName, Model, args = {}) {
  await connectToDatabase();

  const key = Object.keys(args.where || {})[0];
  const value = args.where?.[key];
  const filter = key === "id" ? { _id: value } : { [key]: value };
  const doc = await Model.findOne(filter);

  if (!doc) {
    return null;
  }

  if (args.select) {
    return applySelect(doc, args.select);
  }

  if (modelName === "quiz") {
    return includeQuiz(doc, args.include);
  }

  if (modelName === "question") {
    return includeQuestion(doc, args.include);
  }

  if (modelName === "attempt") {
    return includeAttempt(doc, args.include);
  }

  return applySelect(doc, args.select);
}

async function count(modelName, Model, args = {}) {
  await connectToDatabase();
  const where = await buildWhere(modelName, args.where);
  return Model.countDocuments(where);
}

async function findFirst(modelName, Model, args = {}) {
  await connectToDatabase();

  const where = await buildWhere(modelName, args.where);
  let query = Model.findOne(where);
  const sort = buildSort(args.orderBy);

  if (sort) {
    query = query.sort(sort);
  }

  const doc = await query;
  return doc ? serialize(doc) : null;
}

async function createQuiz(args) {
  await connectToDatabase();

  const nestedQuestions = args.data.questions?.create || [];
  const quiz = await Quiz.create({
    title: args.data.title,
    description: args.data.description,
    category: args.data.category,
    difficulty: args.data.difficulty,
    duration: args.data.duration,
    isPublished: args.data.isPublished ?? false,
    createdById: args.data.createdById
  });

  if (nestedQuestions.length) {
    await Question.insertMany(
      nestedQuestions.map((question) => ({
        ...question,
        quizId: quiz.id
      }))
    );
  }

  if (args.include) {
    return includeQuiz(quiz, args.include);
  }

  return serialize(quiz);
}

async function updateQuiz(args) {
  await connectToDatabase();
  await Quiz.updateOne({ _id: args.where.id }, { $set: args.data });
  const quiz = await Quiz.findById(args.where.id);
  return serialize(quiz);
}

async function deleteQuiz(args) {
  await connectToDatabase();
  await Question.deleteMany({ quizId: args.where.id });
  await Attempt.deleteMany({ quizId: args.where.id });
  await Quiz.deleteOne({ _id: args.where.id });
  return { message: "Quiz deleted" };
}

async function deleteManyQuizzes(args) {
  await connectToDatabase();
  const where = await buildWhere("quiz", args.where);
  const quizIds = await Quiz.find(where).distinct("_id");
  await Question.deleteMany({ quizId: { $in: quizIds } });
  await Attempt.deleteMany({ quizId: { $in: quizIds } });
  return Quiz.deleteMany({ _id: { $in: quizIds } });
}

async function createQuestion(args) {
  await connectToDatabase();
  const question = await Question.create(args.data);
  return serialize(question);
}

async function updateQuestion(args) {
  await connectToDatabase();
  await Question.updateOne({ _id: args.where.id }, { $set: args.data });
  const question = await Question.findById(args.where.id);
  return serialize(question);
}

async function deleteQuestion(args) {
  await connectToDatabase();
  await Question.deleteOne({ _id: args.where.id });
  return { message: "Question deleted" };
}

async function createAttempt(args) {
  await connectToDatabase();
  const attempt = await Attempt.create(args.data);

  if (args.include) {
    return includeAttempt(attempt, args.include);
  }

  return serialize(attempt);
}

async function updateUser(args) {
  await connectToDatabase();

  const where = args.where?.id ? { _id: args.where.id } : { email: args.where.email };
  await User.updateOne(where, { $set: args.data });
  const user = await User.findOne(where);

  if (!user) {
    return null;
  }

  return args.select ? applySelect(user, args.select) : serialize(user);
}

async function deleteUser(args) {
  await connectToDatabase();

  const where = args.where?.id ? { _id: args.where.id } : { email: args.where.email };
  await User.deleteOne(where);

  return { message: "User deleted" };
}

async function upsertUser(args) {
  await connectToDatabase();
  let user = await User.findOne({ email: args.where.email });

  if (!user) {
    user = await User.create(args.create);
  } else if (args.update && Object.keys(args.update).length) {
    await User.updateOne({ email: args.where.email }, { $set: args.update });
    user = await User.findOne({ email: args.where.email });
  }

  return serialize(user);
}

export const db = {
  user: {
    findMany: (args = {}) => findMany("user", User, args),
    findUnique: (args) => findUnique("user", User, args),
    create: async (args) => {
      await connectToDatabase();
      const user = await User.create(args.data);
      return applySelect(user, args.select);
    },
    update: updateUser,
    delete: deleteUser,
    upsert: upsertUser,
    count: (args = {}) => count("user", User, args)
  },
  quiz: {
    findMany: (args = {}) => findMany("quiz", Quiz, args),
    findUnique: (args) => findUnique("quiz", Quiz, args),
    create: createQuiz,
    update: updateQuiz,
    delete: deleteQuiz,
    deleteMany: deleteManyQuizzes,
    count: (args = {}) => count("quiz", Quiz, args)
  },
  question: {
    findMany: (args = {}) => findMany("question", Question, args),
    findUnique: (args) => findUnique("question", Question, args),
    create: createQuestion,
    update: updateQuestion,
    delete: deleteQuestion,
    count: (args = {}) => count("question", Question, args)
  },
  attempt: {
    findMany: (args = {}) => findMany("attempt", Attempt, args),
    findUnique: (args) => findUnique("attempt", Attempt, args),
    findFirst: (args = {}) => findFirst("attempt", Attempt, args),
    create: createAttempt,
    count: (args = {}) => count("attempt", Attempt, args)
  },
  $disconnect: async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

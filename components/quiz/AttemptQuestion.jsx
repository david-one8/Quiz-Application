"use client";

export default function AttemptQuestion({
  index,
  question,
  selectedAnswer,
  onSelect
}) {
  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD }
  ];

  return (
    <div className="surface-muted p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-teal-600">Question {index + 1}</p>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
          {question.marks} mark{question.marks > 1 ? "s" : ""}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold">{question.question}</h3>

      <div className="mt-4 grid gap-3">
        {options.map((option) => {
          const active = selectedAnswer === option.key;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(question.id, option.key)}
              className={`min-h-[48px] rounded-2xl border px-4 py-3 text-left text-sm transition ${
                active
                  ? "border-teal-600 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              }`}
            >
              <span className="font-semibold">{option.key}.</span> {option.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
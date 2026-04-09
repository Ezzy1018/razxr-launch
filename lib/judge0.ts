type Judge0SubmissionRequest = {
  sourceCode: string;
  languageId: number;
  stdin?: string;
  expectedOutput?: string;
};

export type Judge0SubmissionResult = {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
};

const JUDGE0_BASE_URL =
  process.env.JUDGE0_API_URL ??
  "https://judge0-ce.p.rapidapi.com/submissions";

function readJudge0Key(): string {
  const key = process.env.JUDGE0_API_KEY;
  if (!key) {
    throw new Error("Missing required environment variable: JUDGE0_API_KEY");
  }
  return key;
}

export async function submitToJudge0(
  payload: Judge0SubmissionRequest,
): Promise<Judge0SubmissionResult> {
  const body = {
    source_code: payload.sourceCode,
    language_id: payload.languageId,
    stdin: payload.stdin ?? "",
    expected_output: payload.expectedOutput ?? "",
  };

  const submissionResponse = await fetch(`${JUDGE0_BASE_URL}?base64_encoded=false`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-key": readJudge0Key(),
      "x-rapidapi-host": process.env.JUDGE0_API_HOST ?? "judge0-ce.p.rapidapi.com",
    },
    body: JSON.stringify(body),
  });

  if (!submissionResponse.ok) {
    const errBody = await submissionResponse.text();
    throw new Error(`Judge0 submission failed: ${submissionResponse.status} ${errBody}`);
  }

  const submission = (await submissionResponse.json()) as { token: string };

  const resultResponse = await fetch(
    `${JUDGE0_BASE_URL}/${submission.token}?base64_encoded=false&wait=true`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": readJudge0Key(),
        "x-rapidapi-host": process.env.JUDGE0_API_HOST ?? "judge0-ce.p.rapidapi.com",
      },
    },
  );

  if (!resultResponse.ok) {
    const errBody = await resultResponse.text();
    throw new Error(`Judge0 fetch failed: ${resultResponse.status} ${errBody}`);
  }

  const result = (await resultResponse.json()) as Judge0SubmissionResult;
  return result;
}

"use client";

import { useRef, useCallback } from "react";

export interface RunResult {
  logs: { type: string; message: string }[];
  assertionResults: { passed: boolean; message: string }[];
  error: { name: string; message: string; stack?: string } | null;
  allPassed: boolean;
}

export function useCodeRunner() {
  const workerRef = useRef<Worker | null>(null);

  const run = useCallback(
    (code: string, testCases?: string): Promise<RunResult> => {
      return new Promise((resolve) => {
        // Terminate previous worker if still running
        if (workerRef.current) {
          workerRef.current.terminate();
        }

        const worker = new Worker("/code-worker.js");
        workerRef.current = worker;

        const timeout = setTimeout(() => {
          worker.terminate();
          resolve({
            logs: [],
            assertionResults: [],
            error: {
              name: "TimeoutError",
              message:
                "Code execution timed out after 5 seconds. Check for infinite loops.",
            },
            allPassed: false,
          });
        }, 5000);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          workerRef.current = null;
          resolve(e.data);
        };

        worker.onerror = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          workerRef.current = null;
          resolve({
            logs: [],
            assertionResults: [],
            error: {
              name: "WorkerError",
              message: e.message || "Unknown error in code runner",
            },
            allPassed: false,
          });
        };

        worker.postMessage({ code, testCases });
      });
    },
    []
  );

  return { run };
}

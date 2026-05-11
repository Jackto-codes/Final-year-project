import { extractSymptoms } from "./symptomExtractor";
import { 
  calculateScore, 
  getSeverity, 
  TriageAnswers, 
  Severity,
  classifyRisk,
  getAction,
  Action,
  RiskLevel
} from "./triage";

export interface TriageResult {
  symptoms: string[];
  answers: TriageAnswers;
  score: number;
  risk: RiskLevel;
  severity: Severity;
  action: Action;
  message: string;
  bookingDetails?: { batch_number: number; seat_number: number };
}

let currentBatch = 1;
let currentSeat = 1;

export function bookShuttle(userId: string, severity: Severity) {
  const batch_number = currentBatch;
  const seat_number = currentSeat;
  currentSeat++;
  if (currentSeat > 7) {
    currentSeat = 1;
    currentBatch++;
    if (currentBatch > 4) {
      currentBatch = 1; // reset for simulation
    }
  }
  return { batch_number, seat_number };
}

export function triggerEmergency() {
  console.log("Emergency dispatched.");
}

export function generateMessage(severity: Severity, action: Action): string {
  if (severity === "EMERGENCY") {
    return "You may require immediate medical attention. Emergency services have been notified.";
  }
  if (severity === "URGENT") {
    return "You should visit the clinic as soon as possible. A priority shuttle has been arranged.";
  }
  if (severity === "MODERATE") {
    return "A shuttle has been booked for you. Please proceed to the clinic.";
  }
  return "Your condition appears mild. Monitor your symptoms and rest.";
}

export async function runTriage(userInput: string, answers: TriageAnswers): Promise<TriageResult> {
  // 1. extract symptoms
  const { symptoms } = await extractSymptoms(userInput);

  // 2. interpret answers (passed as argument)
  
  // 3. classify risk
  const risk = classifyRisk(symptoms);

  // 4. calculate score
  const score = calculateScore({ symptoms, answers });

  // 5. determine severity
  const severity = getSeverity(score, risk, answers, symptoms);

  // 6. determine action
  const action = getAction(severity);

  // generate message
  const message = generateMessage(severity, action);

  let bookingDetails;
  if (action === "BOOK_SHUTTLE" || action === "PRIORITY_BOOKING") {
    bookingDetails = bookShuttle("some-user-id", severity);
  } else if (action === "EMERGENCY_DISPATCH") {
    triggerEmergency();
  }

  return {
    symptoms,
    answers,
    score,
    risk,
    severity,
    action,
    message,
    ...(bookingDetails && { bookingDetails })
  };
}
